import FooterView from '../views/footerView.js';

const FooterController = {
  init(lang = 'pt') {
    console.log("FooterController.init()...");
    this.currentLang = lang; // Almacenar idioma actual
    this.render();
    this.setupEvents();
    // Escuchar cambios de idioma
    document.addEventListener('languageChange', (e) => {
      this.currentLang = e.detail.lang;
      this.render();
      // Re-renderizar páginas de contacto o servicios si están activas
      if (window.location.hash === '#contacto' || window.location.hash === '#contact') {
        this.showContactPage();
      } else if (window.location.hash === '#servicos'  || window.location.hash === '#services') {
        this.showServicesPage();
      }
    });
  },

  render() {
    try {
      FooterView.renderFooter('footer-content', this.currentLang);
    } catch (error) {
      console.error('Error rendering footer:', error);
    }
  },

  setupEvents() {
    console.log("FooterController.setupEvents()...");
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('contact-link')) {
        e.preventDefault();
        this.showContactPage();
      } else if (e.target.classList.contains('services-link')) {
        e.preventDefault();
        this.showServicesPage();
      }
    });

    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#contacto' || window.location.hash === '#contact') {
        this.showContactPage();
      } else if (window.location.hash === '#servicos' || window.location.hash === '#services') {
        this.showServicesPage();
      }
    });
  },

  showContactPage() {
    console.log('Showing contact page...');
    const app = document.getElementById('pro-inventario');
    const homeContent = document.getElementById('home-content');

    if (homeContent) homeContent.style.display = 'none';
    if (app) {
      FooterView.renderContact('pro-inventario', this.currentLang);
      app.style.display = 'block';
    }
  },

  showServicesPage() {
    console.log('Showing services page...');
    const app = document.getElementById('pro-inventario');
    const homeContent = document.getElementById('home-content');

    if (homeContent) homeContent.style.display = 'none';
    if (app) {
      FooterView.renderServices('pro-inventario', this.currentLang);
      app.style.display = 'block';
    }
  },
};

export default FooterController;