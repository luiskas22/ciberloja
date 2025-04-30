import Translations from '../resources/translations.js';

const SessionView = {
    getLoginForm(lang = 'pt') {
        let t = {};
        try {
            t = Translations[lang]?.session || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center" data-i18n="session.login_title">${t.login_title || 'Iniciar Sessão'}</h2>
            <form id="loginForm" class="bg-light p-4 rounded shadow-sm">
                <div class="row g-3">
                    <div class="col-md-12">
                        <label for="loginEmail" class="form-label" data-i18n="session.email">${t.email || 'Email ou ID'}</label>
                        <input type="text" id="loginEmail" class="form-control" 
                               placeholder="${t.email_placeholder || 'Insira o seu email ou ID'}" required>
                    </div>
                    <div class="col-md-12">
                        <label for="loginPassword" class="form-label" data-i18n="session.password">${t.password || 'Palavra-passe'}</label>
                        <input type="password" id="loginPassword" class="form-control" 
                               placeholder="${t.password_placeholder || 'Insira a sua palavra-passe'}" required>
                    </div>
                </div>
                <div class="mt-3 text-end">
                    <a href="#" id="forgotPasswordLink" data-i18n="session.forgot_password">${t.forgot_password || 'Esqueceu-se da palavra-passe?'}</a>
                </div>
                <div class="mt-4 text-center">
                    <button type="submit" class="btn btn-primary" data-i18n="session.login_button">${t.login_button || 'Entrar'}</button>
                </div>
            </form>
            <div id="loginResults" class="mt-4"></div>
        </div>
        `;
    },

    getForgotPasswordForm(lang = 'pt') {
        let t = {};
        try {
            t = Translations[lang]?.session || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center" data-i18n="session.forgot_password_title">${t.forgot_password_title || 'Recuperar Palavra-passe'}</h2>
            <form id="forgotPasswordForm" class="bg-light p-4 rounded shadow-sm">
                <div class="row g-3">
                    <div class="col-md-12">
                        <label for="forgotPasswordEmail" class="form-label" data-i18n="session.email">${t.email || 'Email'}</label>
                        <input type="email" id="forgotPasswordEmail" class="form-control" 
                               placeholder="${t.email_placeholder2 || 'Insira o seu email'}" required>
                    </div>
                </div>
                <div class="mt-4 text-center">
                    <button type="submit" class="btn btn-primary" data-i18n="session.forgot_password_button">${t.forgot_password_button || 'Enviar Link de Recuperação'}</button>
                </div>
            </form>
            <div id="forgotPasswordResults" class="mt-4"></div>
        </div>
        `;
    },

    getChangePasswordForm(lang = 'pt', { token, clientId } = {}) {
        let t = {};
        try {
            t = Translations[lang]?.session || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center" data-i18n="session.change_password_title">${t.change_password_title || 'Alterar Palavra-passe'}</h2>
            <form id="changePasswordForm" class="bg-light p-4 rounded shadow-sm" data-token="${token || ''}" data-client-id="${clientId || ''}">
                <div class="row g-3">
                    <div class="col-md-12">
                        <label for="newPassword" class="form-label" data-i18n="session.new_password">${t.new_password || 'Nova Palavra-passe'}</label>
                        <input type="password" id="newPassword" class="form-control" 
                               placeholder="${t.new_password_placeholder || 'Insira a nova palavra-passe'}" required>
                    </div>
                    <div class="col-md-12">
                        <label for="confirmPassword" class="form-label" data-i18n="session.confirm_password">${t.confirm_password || 'Confirmar Palavra-passe'}</label>
                        <input type="password" id="confirmPassword" class="form-control" 
                               placeholder="${t.confirm_password_placeholder || 'Confirme a nova palavra-passe'}" required>
                    </div>
                </div>
                <div class="mt-4 text-center">
                    <button type="submit" class="btn btn-primary" data-i18n="session.change_password_button">${t.change_password_button || 'Alterar Palavra-passe'}</button>
                </div>
            </form>
            <div id="changePasswordResults" class="mt-4"></div>
        </div>
        `;
    },

    getRegisterForm(lang = 'pt') {
        let t = {};
        try {
            t = Translations[lang]?.session || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center" data-i18n="session.register_title">${t.register_title || 'Registar Novo Cliente'}</h2>
            <form id="registerForm" class="bg-light p-4 rounded shadow-sm">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="registerNickname" class="form-label" data-i18n="session.nickname">${t.nickname || 'Nickname'}</label>
                        <input type="text" id="registerNickname" class="form-control" 
                               placeholder="${t.nickname_placeholder || 'Insira o nickname'}" required>
                    </div>
                    <div class="col-md-6">
                        <label for="registerNombre" class="form-label" data-i18n="session.name">${t.name || 'Nome'}</label>
                        <input type="text" id="registerNombre" class="form-control" 
                               placeholder="${t.name_placeholder || 'Insira o nome'}" required>
                    </div>
                    <div class="col-md-6">
                        <label for="registerApellido1" class="form-label" data-i18n="session.first_surname">${t.first_surname || 'Primeiro Apelido'}</label>
                        <input type="text" id="registerApellido1" class="form-control" 
                               placeholder="${t.first_surname_placeholder || 'Insira o primeiro apelido'}">
                    </div>
                    <div class="col-md-6">
                        <label for="registerApellido2" class="form-label" data-i18n="session.second_surname">${t.second_surname || 'Segundo Apelido'}</label>
                        <input type="text" id="registerApellido2" class="form-control" 
                               placeholder="${t.second_surname_placeholder || 'Insira o segundo apelido'}">
                    </div>
                    <div class="col-md-6">
                        <label for="registerDniNie" class="form-label" data-i18n="session.dni">${t.dni || 'DNI/NIE'}</label>
                        <input type="text" id="registerDniNie" class="form-control" 
                               placeholder="${t.dni_placeholder || 'Insira o DNI ou NIE'}">
                    </div>
                    <div class="col-md-6">
                        <label for="registerEmail" class="form-label" data-i18n="session.email">${t.email || 'Email'}</label>
                        <input type="email" id="registerEmail" class="form-control" 
                               placeholder="${t.email_placeholder || 'Insira o email'}" required>
                    </div>
                    <div class="col-md-6">
                        <label for="registerTelefono" class="form-label" data-i18n="session.phone">${t.phone || 'Telefone'}</label>
                        <input type="text" id="registerTelefono" class="form-control" 
                               placeholder="${t.phone_placeholder || 'Insira o telefone'}">
                    </div>
                    <div class="col-md-6">
                        <label for="registerPassword" class="form-label" data-i18n="session.password">${t.password || 'Palavra-passe'}</label>
                        <input type="password" id="registerPassword" class="form-control" 
                               placeholder="${t.password_placeholder || 'Insira a palavra-passe'}" required>
                    </div>
                </div>
                <div class="mt-4 text-center">
                    <button type="submit" class="btn btn-success" data-i18n="session.register_button">${t.register_button || 'Registar'}</button>
                </div>
            </form>
            <div id="registerResults" class="mt-4"></div>
        </div>
        `;
    },

    render(containerId, type, lang = 'pt', data = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML = '';
        if (type === "login") {
            container.innerHTML = this.getLoginForm(lang);
        } else if (type === "register") {
            container.innerHTML = this.getRegisterForm(lang);
        } else if (type === "forgot_password") {
            container.innerHTML = this.getForgotPasswordForm(lang);
        } else if (type === "change_password") {
            container.innerHTML = this.getChangePasswordForm(lang, data);
        }
    },

    renderLoginSuccess(message, lang = 'pt') {
        const resultsContainer = document.getElementById("loginResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert" data-i18n="session.login_success">
                    ${message}
                </div>
            `;
        }
    },

    renderLoginError(message, lang = 'pt') {
        const resultsContainer = document.getElementById("loginResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert" data-i18n="session.login_error">
                    ${message}
                </div>
            `;
        }
    },

    renderForgotPasswordSuccess(message, lang = 'pt') {
        const resultsContainer = document.getElementById("forgotPasswordResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert" data-i18n="session.forgot_password_success">
                    ${message}
                </div>
            `;
        }
    },

    renderForgotPasswordError(message, lang = 'pt') {
        const resultsContainer = document.getElementById("forgotPasswordResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert" data-i18n="session.forgot_password_error">
                    ${message}
                </div>
            `;
        }
    },

    renderChangePasswordSuccess(message, lang = 'pt') {
        const resultsContainer = document.getElementById("changePasswordResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert" data-i18n="session.change_password_success">
                    ${message}
                </div>
            `;
        }
    },

    renderChangePasswordError(message, lang = 'pt') {
        const resultsContainer = document.getElementById("changePasswordResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert" data-i18n="session.change_password_error">
                    ${message}
                </div>
            `;
        }
    },

    renderRegisterSuccess(message, lang = 'pt') {
        const resultsContainer = document.getElementById("registerResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert" data-i18n="session.register_success">
                    ${message}
                </div>
            `;
        }
    },

    renderRegisterError(message, lang = 'pt') {
        const resultsContainer = document.getElementById("registerResults");
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert" data-i18n="session.register_error">
                    ${message}
                </div>
            `;
        }
    },

    renderLogoutSuccess(message, lang = 'pt') {
        const container = document.getElementById("pro-inventario");
        if (container) {
            container.innerHTML = `
                <div class="alert alert-success" data-i18n="session.logout_success">${message}</div>
            `;
        }
    },
};

export default SessionView;