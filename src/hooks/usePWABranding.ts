import { useState, useEffect } from 'react';
import { pwaBrandingManager } from '@/utils/pwaBrandingManager';

interface PWABrandingData {
  name: string;
  short_name: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  theme_color: string;
  background_color: string;
}

export const usePWABranding = () => {
  const [branding, setBranding] = useState<PWABrandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBranding = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const brandingData = await pwaBrandingManager.loadBrandingFromDatabase();
      setBranding(brandingData);
    } catch (err) {
      console.error('Erro ao carregar branding do PWA:', err);
      setError('Erro ao carregar branding');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePWAManifest = async () => {
    try {
      await pwaBrandingManager.updatePWAManifest();
    } catch (err) {
      console.error('Erro ao atualizar PWA manifest:', err);
      setError('Erro ao atualizar PWA');
    }
  };

  const invalidateCache = () => {
    pwaBrandingManager.invalidateCache();
    loadBranding();
  };

  useEffect(() => {
    loadBranding();
  }, []);

  // Listener para eventos de atualização
  useEffect(() => {
    const handleBrandingUpdate = () => {
      loadBranding();
    };

    window.addEventListener('brandingUpdated', handleBrandingUpdate);

    return () => {
      window.removeEventListener('brandingUpdated', handleBrandingUpdate);
    };
  }, []);

  return {
    branding,
    isLoading,
    error,
    loadBranding,
    updatePWAManifest,
    invalidateCache
  };
}; 