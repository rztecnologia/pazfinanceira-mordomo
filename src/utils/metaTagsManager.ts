interface BrandingMeta {
  companyName: string;
  logoUrl: string;
  description?: string;
  url?: string;
}

export class MetaTagsManager {
  private static instance: MetaTagsManager;
  
  static getInstance(): MetaTagsManager {
    if (!MetaTagsManager.instance) {
      MetaTagsManager.instance = new MetaTagsManager();
    }
    return MetaTagsManager.instance;
  }

  // Atualizar todas as meta tags relevantes
  updateMetaTags(branding: BrandingMeta): void {
    const {
      companyName,
      logoUrl,
      description = `Sistema de controle financeiro - ${companyName}`,
      url = window.location.origin
    } = branding;

    console.log('Atualizando meta tags para:', companyName);

    // Atualizar título da página
    document.title = companyName;

    // Atualizar meta description
    this.updateMetaTag('name', 'description', description);
    
    // Atualizar Open Graph (WhatsApp, Facebook)
    this.updateMetaTag('property', 'og:title', companyName);
    this.updateMetaTag('property', 'og:description', description);
    this.updateMetaTag('property', 'og:image', logoUrl);
    this.updateMetaTag('property', 'og:url', url);
    this.updateMetaTag('property', 'og:site_name', companyName);
    this.updateMetaTag('property', 'og:type', 'website');
    this.updateMetaTag('property', 'og:image:width', '1200');
    this.updateMetaTag('property', 'og:image:height', '630');
    this.updateMetaTag('property', 'og:image:alt', `Logo ${companyName}`);
    
    // Atualizar Twitter Cards
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:title', companyName);
    this.updateMetaTag('name', 'twitter:description', description);
    this.updateMetaTag('name', 'twitter:image', logoUrl);
    this.updateMetaTag('name', 'twitter:image:alt', `Logo ${companyName}`);
    
    // Atualizar Apple Touch Icon
    this.updateLinkTag('apple-touch-icon', logoUrl);
    
    // Atualizar favicon
    this.updateFavicon(logoUrl);
    
    // Atualizar PWA meta tags
    this.updateMetaTag('name', 'apple-mobile-web-app-title', companyName);
    this.updateMetaTag('name', 'application-name', companyName);
    
    // Atualizar dados estruturados JSON-LD
    this.updateStructuredData(branding);
    
    console.log('✅ Meta tags atualizadas com sucesso');
  }

  private updateMetaTag(attrName: string, attrValue: string, content: string): void {
    let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attrName, attrValue);
      document.head.appendChild(meta);
      console.log(`Created meta tag: ${attrName}="${attrValue}"`);
    }
    
    meta.setAttribute('content', content);
  }

  private updateLinkTag(rel: string, href: string): void {
    let link = document.querySelector(`link[rel="${rel}"]`);
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', href);
  }

  private updateFavicon(iconUrl: string): void {
    // Atualizar favicon padrão
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      favicon.setAttribute('type', 'image/png');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', iconUrl);

    // Atualizar shortcut icon
    let shortcutIcon = document.querySelector('link[rel="shortcut icon"]');
    if (!shortcutIcon) {
      shortcutIcon = document.createElement('link');
      shortcutIcon.setAttribute('rel', 'shortcut icon');
      shortcutIcon.setAttribute('type', 'image/png');
      document.head.appendChild(shortcutIcon);
    }
    shortcutIcon.setAttribute('href', iconUrl);
  }

  // Gerar URL para forçar refresh no WhatsApp
  generateWhatsAppRefreshUrl(): string {
    const baseUrl = window.location.origin;
    const timestamp = Date.now();
    return `${baseUrl}?refresh=${timestamp}&utm_source=whatsapp`;
  }

  // Criar dados estruturados JSON-LD
  private updateStructuredData(branding: BrandingMeta): void {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": branding.companyName,
      "logo": branding.logoUrl,
      "url": window.location.origin,
      "description": branding.description || `Sistema de controle financeiro - ${branding.companyName}`,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser"
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(structuredData, null, 2);
  }

  // Validar se meta tags foram aplicadas corretamente
  validateMetaTags(): boolean {
    const requiredTags = [
      'meta[property="og:title"]',
      'meta[property="og:image"]',
      'meta[property="og:description"]',
      'meta[name="twitter:card"]'
    ];

    return requiredTags.every(selector => {
      const element = document.querySelector(selector);
      return element && element.getAttribute('content');
    });
  }

  // Debug: listar todas as meta tags atuais
  debugMetaTags(): void {
    console.group('🔍 Debug Meta Tags');
    
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');
      if (name && content) {
        console.log(`${name}: ${content}`);
      }
    });
    
    console.groupEnd();
  }
}

export const metaTagsManager = MetaTagsManager.getInstance(); 