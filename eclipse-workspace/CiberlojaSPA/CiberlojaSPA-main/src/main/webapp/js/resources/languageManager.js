// LanguageManager.js
import Translations from './translations.js';

export class LanguageManager {
    constructor(defaultLang = 'pt') {
        this.currentLang = localStorage.getItem('language') || defaultLang;
        this.Translations = Translations;
        this.init();
    }

    init() {
        this.setLanguage(this.currentLang);
        document.querySelectorAll('[data-lang]').forEach((element) => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        if (!this.Translations[lang]) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.getElementById('html-lang').setAttribute('lang', lang);
        this.updateUI();
    }

    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.Translations[this.currentLang];
        for (const k of keys) {
            translation = translation[k];
            if (!translation) return key;
        }
        return translation;
    }

    updateUI() {
        console.log('updateUI start - Hash:', window.location.hash);
        const currentHash = window.location.hash; // Store current hash
        const langButton = document.getElementById('currentLanguage');
        if (langButton) {
            langButton.textContent = this.currentLang === 'es' ? 'Español' : 
                                    this.currentLang === 'pt' ? 'Português' : 
                                    'English';
        }

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const icon = element.querySelector('i');
            const text = this.getTranslation(key);
            if (icon) {
                element.innerHTML = `${icon.outerHTML} ${text}`;
            } else {
                element.textContent = text;
            }
        });

        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = this.getTranslation('header.title');
        }

        const event = new CustomEvent('languageChange', { detail: { lang: this.currentLang } });
        document.dispatchEvent(event);
        if (window.location.hash !== currentHash) {
            console.log('Hash changed during updateUI, restoring to:', currentHash);
            window.location.hash = currentHash; // Restore original hash
        }
        console.log('updateUI end - Hash:', window.location.hash);
    }
}

export default LanguageManager;