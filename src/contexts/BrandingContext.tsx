import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { brandingPreloader } from '@/utils/brandingPreloader';
import { pwaBrandingManager } from '@/utils/pwaBrandingManager';

interface BrandingData {
  companyName: string;
  logoUrl: string;
  faviconUrl: string;
  logoAltText: string;
}

interface BrandingContextType {
  branding: BrandingData;
  isLoading: boolean;
  error: string | null;
  refreshBranding: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  lastUpdated: number;
}

// Usar branding neutro como fallback
const defaultBranding: BrandingData = {
  companyName: '',
  logoUrl: '',
  faviconUrl: '/favicon.ico',
  logoAltText: ''
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingData>(() => {
    // Tentar carregar do cache imediatamente (síncrono)
    const cached = brandingPreloader.getCachedBranding();
    if (cached) {
      return {
        companyName: cached.companyName,
        logoUrl: cached.logoUrl,
        faviconUrl: cached.faviconUrl,
        logoAltText: cached.logoAltText
      };
    }
    return defaultBranding;
  });
  
  const [isLoading, setIsLoading] = useState(() => {
    // Se temos cache, não precisamos mostrar loading
    return !brandingPreloader.getCachedBranding();
  });
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const loadBranding = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (forceRefresh) {
        brandingPreloader.invalidateCache();
        pwaBrandingManager.invalidateCache();
      }
      
      const cachedBranding = await brandingPreloader.loadBranding();
      
      if (cachedBranding) {
        const newBranding: BrandingData = {
          companyName: cachedBranding.companyName,
          logoUrl: cachedBranding.logoUrl,
          faviconUrl: cachedBranding.faviconUrl,
          logoAltText: cachedBranding.logoAltText
        };
        
        setBranding(newBranding);
        setLastUpdated(Date.now());
        
        // Atualizar PWA com branding
        await pwaBrandingManager.updatePWAManifest();
        
        // Atualizar favicon se necessário
        if (newBranding.faviconUrl && newBranding.faviconUrl !== '/favicon.ico') {
          const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (link) {
            link.href = newBranding.faviconUrl + `?v=${Date.now()}`;
          }
        }
        
        // Atualizar título da página
        if (newBranding.companyName) {
          document.title = newBranding.companyName; // Usar apenas o nome da empresa
        }
      }
    } catch (err) {
      console.error('Erro ao carregar branding:', err);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBranding = async () => {
    await loadBranding();
  };

  const forceRefresh = async () => {
    brandingPreloader.invalidateCache();
    await loadBranding(true);
  };

  useEffect(() => {
    // Se não temos cache, carregar agora
    if (!brandingPreloader.getCachedBranding()) {
      loadBranding();
    } else {
      setIsLoading(false);
    }
    
    // Configurar listener para mudanças de configuração (via localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'branding-refresh') {
        const timestamp = e.newValue;
        console.log('Storage event - atualizando branding (timestamp:', timestamp, ')');
        loadBranding(true);
        localStorage.removeItem('branding-refresh'); // Limpar após processar
      }
    };
    
    // Listener para eventos customizados (mesma aba)
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.refresh === 'branding') {
        const timestamp = e.detail?.timestamp;
        console.log('Custom event - atualizando branding (timestamp:', timestamp, ')');
        loadBranding(true);
      }
    };
    
    // Listener para visibilidade da página (detecta quando volta de outra aba)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Verifica se precisa atualizar quando volta para a aba
        const lastRefresh = localStorage.getItem('branding-refresh');
        if (lastRefresh && parseInt(lastRefresh) > lastUpdated) {
          console.log('Visibilidade: atualizando branding por timestamp local');
          loadBranding(true);
          localStorage.removeItem('branding-refresh');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('brandingRefresh', handleCustomEvent as EventListener);
    window.addEventListener('brandingUpdated', () => forceRefresh());
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('brandingRefresh', handleCustomEvent as EventListener);
      window.removeEventListener('brandingUpdated', () => forceRefresh());
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const value = {
    branding,
    isLoading,
    error,
    refreshBranding,
    forceRefresh,
    lastUpdated
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};