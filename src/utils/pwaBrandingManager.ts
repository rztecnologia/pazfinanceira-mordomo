interface PWABrandingData {
  name: string;
  short_name: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  theme_color: string;
  background_color: string;
}

export class PWABrandingManager {
  private static instance: PWABrandingManager;
  private cachedBranding: PWABrandingData | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  static getInstance(): PWABrandingManager {
    if (!PWABrandingManager.instance) {
      PWABrandingManager.instance = new PWABrandingManager();
    }
    return PWABrandingManager.instance;
  }

  // Carregar branding do cache local
  private loadFromCache(): PWABrandingData | null {
    try {
      const cached = localStorage.getItem('pwa_branding_cache');
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > this.CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem('pwa_branding_cache');
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  }

  // Salvar branding no cache local
  private saveToCache(branding: PWABrandingData): void {
    try {
      const cacheData = {
        data: branding,
        timestamp: Date.now()
      };
      localStorage.setItem('pwa_branding_cache', JSON.stringify(cacheData));
    } catch {
      // Ignore cache errors
    }
  }

  // Carregar branding do banco de dados
  async loadBrandingFromDatabase(): Promise<PWABrandingData> {
    // Verificar cache primeiro
    const cached = this.loadFromCache();
    if (cached) {
      this.cachedBranding = cached;
      return cached;
    }

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Buscar configurações de branding do banco
      const { data, error } = await supabase.functions.invoke('get-public-settings', {
        body: { category: 'branding' }
      });
      
      if (error || !data?.success || !data?.settings) {
        console.warn('Erro ao carregar branding do banco:', error);
        return this.getDefaultBranding();
      }

      const brandingSettings = data.settings.branding || {};
      const brandingData: any = {};
      
      // Extrair valores das configurações
      Object.keys(brandingSettings).forEach(key => {
        brandingData[key] = brandingSettings[key].value;
      });

      // Criar objeto de branding para PWA
      const companyName = brandingData.company_name || 'PoupeJá';
      const logoUrl = brandingData.logo_url || '/lovable-uploads/feb4b0d7-9e89-45bc-bae1-72b1af54eacd.png';
      const faviconUrl = brandingData.favicon_url || '/favicon.ico';

      const pwaBranding: PWABrandingData = {
        name: companyName,
        short_name: companyName,
        description: companyName, // Usar apenas o nome da empresa
        logoUrl: logoUrl,
        faviconUrl: faviconUrl,
        theme_color: '#005C6E',
        background_color: '#ffffff'
      };

      // Salvar no cache
      this.saveToCache(pwaBranding);
      this.cachedBranding = pwaBranding;
      this.cacheTimestamp = Date.now();

      return pwaBranding;
    } catch (error) {
      console.error('Erro ao carregar branding do banco:', error);
      return this.getDefaultBranding();
    }
  }

  // Obter branding padrão
  private getDefaultBranding(): PWABrandingData {
    return {
      name: 'PoupeJá',
      short_name: 'PoupeJá',
      description: 'PoupeJá', // Usar apenas o nome da empresa
      logoUrl: '/lovable-uploads/feb4b0d7-9e89-45bc-bae1-72b1af54eacd.png',
      faviconUrl: '/favicon.ico',
      theme_color: '#005C6E',
      background_color: '#ffffff'
    };
  }

  // Atualizar manifest do PWA
  async updatePWAManifest(): Promise<void> {
    try {
      const branding = await this.loadBrandingFromDatabase();
      
      // Atualizar meta tags
      this.updateMetaTags(branding);
      
      // Atualizar manifest se possível
      this.updateManifest(branding);
      
      // Forçar atualização do Service Worker
      this.forceServiceWorkerUpdate();
      
    } catch (error) {
      console.error('Erro ao atualizar PWA manifest:', error);
    }
  }

  // Atualizar meta tags
  private updateMetaTags(branding: PWABrandingData): void {
    try {
      // Atualizar título da página
      if (branding.name) {
        document.title = branding.name; // Usar apenas o nome da empresa
      }

      // Atualizar Apple meta tags
      const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if (appleTitle) {
        appleTitle.setAttribute('content', branding.name);
      }

      // Atualizar Open Graph meta tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', branding.name);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', branding.name); // Usar apenas o nome da empresa
      }

      // Atualizar Twitter meta tags
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', branding.name);
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', branding.name); // Usar apenas o nome da empresa
      }

      // Atualizar favicon
      if (branding.faviconUrl && branding.faviconUrl !== '/favicon.ico') {
        const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = branding.faviconUrl + `?v=${Date.now()}`;
        }
      }

      // Atualizar Apple touch icon
      if (branding.logoUrl) {
        const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (appleTouchIcon) {
          appleTouchIcon.setAttribute('href', branding.logoUrl);
        }

        // Atualizar Open Graph image
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', branding.logoUrl);
        }

        // Atualizar Twitter image
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) {
          twitterImage.setAttribute('content', branding.logoUrl);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar meta tags:', error);
    }
  }

  // Atualizar manifest (limitado no runtime)
  private updateManifest(branding: PWABrandingData): void {
    try {
      // Criar manifest dinâmico (limitado)
      const manifestData = {
        name: branding.name,
        short_name: branding.short_name,
        description: branding.description,
        theme_color: branding.theme_color,
        background_color: branding.background_color
      };

      console.log('PWA manifest atualizado:', manifestData);
    } catch (error) {
      console.error('Erro ao atualizar manifest:', error);
    }
  }

  // Forçar atualização do Service Worker
  private forceServiceWorkerUpdate(): void {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_PWA_CACHE',
        timestamp: Date.now()
      });
    }
  }

  // Forçar atualização do PWA
  async forcePWARefresh(): Promise<void> {
    try {
      // Invalidar cache
      this.invalidateCache();
      
      // Forçar recarregamento da página para aplicar mudanças
      if (typeof window !== 'undefined') {
        // Limpar cache do Service Worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CLEAR_PWA_CACHE',
            timestamp: Date.now()
          });
        }
        
        // Recarregar página após um pequeno delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao forçar refresh do PWA:', error);
    }
  }

  // Invalidar cache
  invalidateCache(): void {
    localStorage.removeItem('pwa_branding_cache');
    this.cachedBranding = null;
    this.cacheTimestamp = 0;
  }
}

export const pwaBrandingManager = PWABrandingManager.getInstance(); 