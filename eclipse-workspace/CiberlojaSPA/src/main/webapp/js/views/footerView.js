import Translations  from '../resources/translations.js'; // Adjusted the path to match the correct location

const FooterView = {
    renderFooter(containerId, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const t = Translations[lang].footer;
        container.innerHTML = `
      <div class="container text-center">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5><a href="#contacto" class="contact-link" data-i18n="footer.contact.title">${t.contact.title}</a></h5>
            <p data-i18n="footer.contact.email">${t.contact.email}</p>
            <p data-i18n="footer.contact.phone">${t.contact.phone}</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5><a href="#servicos" class="services-link" data-i18n="footer.services.title">${t.services.title}</a></h5>
            <p data-i18n="footer.services.address">${t.services.address}</p>
            <p data-i18n="footer.services.location">${t.services.location}</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5 data-i18n="footer.social.title">${t.social.title}</h5>
            <div class="social-links">
              <a href="https://www.facebook.com/p/Ciberloja-Sistemas-Inform%C3%A1ticos-100052847127155/" class="me-2" target="_blank"><i class="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/ciberloja/" class="me-2" target="_blank"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <hr>
        <p class="mb-0" data-i18n="footer.copyright">${t.copyright}</p>
      </div>
    `;
    },

    renderContact(containerId, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const t = Translations[lang].contact;
        container.innerHTML = `
      <main class="contact-container">
        <section class="contact-section">
          <h2 data-i18n="contact.title">${t.title}</h2>
          <p data-i18n="contact.description">${t.description}</p>
          <div class="contact-info">
            <h3 data-i18n="contact.infoTitle">${t.infoTitle}</h3>
            <ul>
              <li><strong data-i18n="contact.phone">${t.phone}</strong></li>
              <li><strong data-i18n="contact.email">${t.email}</strong>: <a href="mailto:geral@ciberloja.com">geral@ciberloja.com</a></li>
              <li><strong data-i18n="contact.hours">${t.hours}</strong></li>
            </ul>
          </div>
          <div class="location">
            <h3 data-i18n="contact.locationTitle">${t.locationTitle}</h3>
            <p data-i18n="contact.locationDescription">${t.locationDescription}</p>
            <p><strong data-i18n="contact.address">${t.address}</strong></p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.560841672112!2d-8.408868923383974!3d41.36325847130352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd24f4055752bcc5%3A0x77fb4131104ac957!2sCiberloja%20-%20Sistemas%20Inform%C3%A1ticos%2C%20Lda!5e0!3m2!1ses!2sec!4v1711419999999"
              width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy">
            </iframe>
            <p><a href="https://www.google.com/maps/place/Ciberloja+-+Sistemas+Inform%C3%A1ticos,+Lda/@41.3637932,-8.4062051,1627m/data=!3m1!1e3!4m6!3m5!1s0xd24f4055752bcc5:0x77fb4131104ac957!8m2!3d41.3632557!4d-8.4066802!16s%2Fg%2F1ptxw6xwp" target="_blank" data-i18n="contact.mapLink">${t.mapLink}</a></p>
          </div>
        </section>
      </main>
    `;
    },

    renderServices(containerId, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const t = Translations[lang].services;
        container.innerHTML = `
      <main class="services-container">
        <section class="services-section">
          <h2 data-i18n="services.title">${t.title}</h2>
          <p data-i18n="services.description">${t.description}</p>
          <ul class="services-list">
            <li>
              <h3 data-i18n="services.support.title">${t.support.title}</h3>
              <p data-i18n="services.support.description">${t.support.description}</p>
            </li>
            <li>
              <h3 data-i18n="services.development.title">${t.development.title}</h3>
              <p data-i18n="services.development.description">${t.development.description}</p>
            </li>
            <li>
              <h3 data-i18n="services.consulting.title">${t.consulting.title}</h3>
              <p data-i18n="services.consulting.description">${t.consulting.description}</p>
            </li>
            <li>
              <h3 data-i18n="services.maintenance.title">${t.maintenance.title}</h3>
              <p data-i18n="services.maintenance.description">${t.maintenance.description}</p>
            </li>
          </ul>
        </section>
      </main>
    `;
    },
};

export default FooterView;