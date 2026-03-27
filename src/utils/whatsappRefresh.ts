import { metaTagsManager } from './metaTagsManager';

export class WhatsAppRefresh {
  private static instance: WhatsAppRefresh;
  
  static getInstance(): WhatsAppRefresh {
    if (!WhatsAppRefresh.instance) {
      WhatsAppRefresh.instance = new WhatsAppRefresh();
    }
    return WhatsAppRefresh.instance;
  }

  // Forçar atualização completa das meta tags e gerar URL para refresh do WhatsApp
  async forceRefresh(branding: any): Promise<string> {
    try {
      console.log('🔄 Iniciando WhatsApp refresh para:', branding.companyName);

      // 1. Atualizar meta tags imediatamente
      metaTagsManager.updateMetaTags({
        companyName: branding.companyName,
        logoUrl: branding.logoUrl,
        description: `Sistema de controle financeiro - ${branding.companyName}`
      });

      // 2. Validar se meta tags foram aplicadas
      const isValid = metaTagsManager.validateMetaTags();
      if (!isValid) {
        console.warn('⚠️ Algumas meta tags podem não ter sido aplicadas corretamente');
      }

      // 3. Tentar invalidar cache do WhatsApp
      await this.invalidateWhatsAppCache();

      // 4. Gerar URL com timestamp para forçar novo cache
      const refreshUrl = metaTagsManager.generateWhatsAppRefreshUrl();
      
      console.log('✅ WhatsApp refresh concluído. Nova URL:', refreshUrl);
      
      // 5. Notificar outros componentes
      this.notifyRefreshComplete(refreshUrl);

      return refreshUrl;

    } catch (error) {
      console.error('❌ Erro ao executar WhatsApp refresh:', error);
      return window.location.origin;
    }
  }

  // Tentar invalidar cache do WhatsApp usando diferentes estratégias
  private async invalidateWhatsAppCache(): Promise<void> {
    try {
      // Estratégia 1: Adicionar meta tag com timestamp
      const timestamp = Date.now().toString();
      const currentUrl = window.location.origin;
      
      metaTagsManager.updateMetaTags({
        companyName: document.title,
        logoUrl: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
        description: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
        url: `${currentUrl}?v=${timestamp}`
      });

      // Estratégia 2: Forçar reload de imagem (pre-load)
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      if (ogImage) {
        await this.preloadImageWithCache(ogImage);
      }

      console.log('📤 Cache invalidation strategies applied');

    } catch (error) {
      console.warn('⚠️ Não foi possível invalidar cache do WhatsApp automaticamente:', error);
    }
  }

  // Pre-carregar imagem com cache-busting
  private preloadImageWithCache(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timestamp = Date.now();
      const separator = imageUrl.includes('?') ? '&' : '?';
      
      img.onload = () => {
        console.log('✅ Imagem pre-carregada para WhatsApp:', imageUrl);
        resolve();
      };
      
      img.onerror = () => {
        console.warn('⚠️ Erro ao pre-carregar imagem:', imageUrl);
        resolve(); // Não falhar por causa da imagem
      };
      
      // Adicionar timestamp para invalidar cache
      img.src = `${imageUrl}${separator}cache=${timestamp}`;
    });
  }

  // Gerar link de compartilhamento otimizado para WhatsApp
  generateOptimizedShareUrl(customMessage?: string): string {
    const timestamp = Date.now();
    const refreshUrl = `${window.location.origin}?utm_source=whatsapp&refresh=${timestamp}`;
    
    const companyName = document.title || 'Sistema Financeiro';
    const message = customMessage || `Conheça o ${companyName} - Sistema de controle financeiro`;
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(refreshUrl);
    
    return `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
  }

  // Detectar se a página foi aberta via WhatsApp
  isOpenedFromWhatsApp(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const referrer = document.referrer.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    
    return userAgent.includes('whatsapp') || 
           referrer.includes('whatsapp') || 
           urlParams.get('utm_source') === 'whatsapp' ||
           urlParams.has('refresh');
  }

  // Aplicar configurações específicas para WhatsApp
  applyWhatsAppOptimizations(): void {
    if (this.isOpenedFromWhatsApp()) {
      console.log('📱 Página aberta via WhatsApp - aplicando otimizações');
      
      // Adicionar classe CSS para otimizações específicas do WhatsApp
      document.body.classList.add('whatsapp-view');
      
      // Garantir que meta tags estejam visíveis
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        const imageUrl = ogImage.getAttribute('content');
        if (imageUrl) {
          // Pre-carregar imagem para garantir que apareça no WhatsApp
          this.preloadImageWithCache(imageUrl).catch(() => {
            console.warn('Não foi possível pre-carregar imagem do WhatsApp');
          });
        }
      }

      // Adicionar meta tag específica para WhatsApp
      metaTagsManager.updateMetaTags({
        companyName: document.title,
        logoUrl: ogImage?.getAttribute('content') || '',
        description: `Acesse via WhatsApp - ${document.title}`
      });
      
      console.log('✅ Otimizações do WhatsApp aplicadas');
    }
  }

  // Notificar outros componentes sobre o refresh
  private notifyRefreshComplete(refreshUrl: string): void {
    window.dispatchEvent(new CustomEvent('whatsappRefreshComplete', {
      detail: { 
        refreshUrl,
        timestamp: Date.now(),
        companyName: document.title
      }
    }));
  }

  // Debug: verificar configurações atuais do WhatsApp
  debugWhatsAppStatus(): void {
    console.group('📱 WhatsApp Debug Status');
    console.log('Aberto via WhatsApp:', this.isOpenedFromWhatsApp());
    console.log('URL atual:', window.location.href);
    console.log('Título:', document.title);
    console.log('OG Image:', document.querySelector('meta[property="og:image"]')?.getAttribute('content'));
    console.log('OG Title:', document.querySelector('meta[property="og:title"]')?.getAttribute('content'));
    console.log('User Agent:', navigator.userAgent);
    console.log('Referrer:', document.referrer);
    console.groupEnd();
  }

  // Criar URL para teste do Facebook Debugger
  getFacebookDebuggerUrl(): string {
    const currentUrl = encodeURIComponent(window.location.origin);
    return `https://developers.facebook.com/tools/debug/?q=${currentUrl}`;
  }

  // Gerar relatório completo de meta tags para debugging
  generateMetaTagsReport(): string {
    const report = {
      url: window.location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const whatsappRefresh = WhatsAppRefresh.getInstance(); 