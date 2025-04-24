import ClienteView from '../views/clienteView.js';
import ClienteService from '../services/clienteService.js';
import Translations from '../resources/translations.js'; // Adjust path as needed

const ClienteController = {
    init(action, lang = 'es') {
        console.log(`ClienteController.init(${action})...`);
        this.currentLang = lang; // Store current language
        if (action === "perfil") {
            this.loadProfileForm();
            if (sessionStorage.getItem("profileUpdated")) {
                ClienteView.renderProfileUpdateSuccess('pro-inventario', null, this.currentLang);
                sessionStorage.removeItem("profileUpdated");
            }
        }
        this.setupEvents();
        // Listen for language changes
        document.addEventListener('languageChange', (e) => {
            this.currentLang = e.detail.lang;
            // Re-render profile if on profile page
            if (window.location.hash === '#perfil') {
                this.loadProfileForm();
            }
        });
    },

    setupEvents() {
        console.log("ClienteController.setupEvents()...");
        document.addEventListener('click', (event) => {
            const editProfileTarget = event.target.closest('.btn-edit-profile');
            if (editProfileTarget) {
                event.preventDefault();
                this.showEditProfileForm();
            }

            const saveEditedProfile = event.target.closest('#saveEditedProfile');
            if (saveEditedProfile) {
                event.preventDefault();
                this.handleEditProfileSubmit();
            }

            const changePasswordTarget = event.target.closest('.btn-change-password');
            if (changePasswordTarget) {
                event.preventDefault();
                this.showChangePasswordForm();
            }

            // Language switcher
            const langSwitcher = event.target.closest('.lang-switcher');
            if (langSwitcher) {
                const lang = langSwitcher.dataset.lang;
                this.changeLanguage(lang);
            }
        });
    },

    async loadProfileForm() {
        console.log("Cargando formulario de perfil...");
        try {
            let clienteData = this.getStoredClienteData();
            if (!clienteData) {
                clienteData = await ClienteService.obterPerfil();
                sessionStorage.setItem('cliente', JSON.stringify(clienteData));
            }
            if (clienteData) {
                ClienteView.renderProfile('pro-inventario', clienteData, this.currentLang);
            } else {
                ClienteView.renderError('pro-inventario', null, this.currentLang);
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
            ClienteView.renderError('pro-inventario', Translations[this.currentLang]?.cliente?.error_loading || 'Error al cargar perfil. Por favor, inicia sesión nuevamente.', this.currentLang);
        }
    },

    async showEditProfileForm() {
        console.log("Mostrando formulario para editar perfil...");
        const clienteData = this.getStoredClienteData();
        if (clienteData) {
            ClienteView.renderEditProfileModal('pro-inventario', clienteData, this.currentLang);
            const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
            modal.show();
        } else {
            ClienteView.renderError('pro-inventario', Translations[this.currentLang]?.cliente?.error_client_data || 'Datos del cliente no disponibles. Por favor, recarga la página.', this.currentLang);
        }
    },

    async handleEditProfileSubmit() {
        const form = document.getElementById('editProfileForm');
        if (!form) {
            ClienteView.renderError('pro-inventario', Translations[this.currentLang]?.cliente?.form_not_found || 'Formulario no encontrado.', this.currentLang);
            return;
        }

        const formData = new FormData(form);
        const clienteData = {
            id: parseInt(formData.get('id'), 10),
            nombre: formData.get('nombre'),
            apellido1: formData.get('apellido1'),
            apellido2: formData.get('apellido2') || null,
            nickname: formData.get('nickname'),
            email: formData.get('email'),
            dniNie: formData.get('dniNie'),
            telefono: formData.get('telefono') || null,
            password: formData.get('password') || null
        };

        try {
            await this.updateCliente(clienteData);
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            if (modal) {
                modal.hide();
                document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }
        } catch (error) {
            console.error("Error en handleEditProfileSubmit:", error);
            ClienteView.renderProfileUpdateError('pro-inventario', error.message || Translations[this.currentLang]?.cliente?.error_updating || 'Error al actualizar el perfil.', this.currentLang);
        }
    },

    async updateCliente(clienteData) {
        try {
            const updatedCliente = await ClienteService.updateCliente(clienteData);
            sessionStorage.setItem('cliente', JSON.stringify(updatedCliente));
            sessionStorage.setItem('profileUpdated', 'true');
            window.location.href = window.location.href;
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            throw error;
        }
    },

    async showChangePasswordForm() {
        // Placeholder for change password form (not implemented)
        console.log("Mostrando formulario para cambiar contraseña...");
        ClienteView.renderError('pro-inventario', Translations[this.currentLang]?.cliente?.feature_not_implemented || 'Funcionalidad de cambio de contraseña no implementada.', this.currentLang);
    },

    changeLanguage(lang) {
        if (Translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('preferredLanguage', lang);
            document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
        }
    },

    getStoredClienteData() {
        const clienteData = sessionStorage.getItem('cliente');
        return clienteData ? JSON.parse(clienteData) : null;
    }
};

export default ClienteController;