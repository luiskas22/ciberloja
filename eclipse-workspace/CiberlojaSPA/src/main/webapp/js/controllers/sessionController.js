import SessionView from "../views/sessionView.js";
import SessionService from "../services/sessionService.js";
import App from "../app.js";
import Translations from '../resources/translations.js';

const SesionController = {
    // Modificación del método init en SesionController
    init(action, lang = 'pt') {
        console.log(`SesionController.init(${action}, ${lang})...`);
        this.currentLang = lang;

        // Priorizar la detección de reset-password en el hash
        if (window.location.hash.startsWith('#/reset-password')) {
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
            const token = hashParams.get('token');
            const clientId = hashParams.get('id');

            if (token && clientId) {
                console.log(`Detected reset-password with token=${token} and id=${clientId}`);
                this.loadChangePasswordForm(token, clientId);
                return;
            } else {
                console.warn('Reset password URL missing token or id');
                SessionView.renderForgotPasswordError(
                    Translations[this.currentLang].alerts.missing_token_or_id || "Token ou ID de cliente inválido ou ausente.",
                    this.currentLang
                );
                this.loadForgotPasswordForm();
                return;
            }
        }

        // Verificar la URL completa (para compatibilidad con otras formas de acceso)
        const url = new URL(window.location.href);
        if (url.pathname.includes('/reset-password')) {
            const token = url.searchParams.get('token');
            const clientId = url.searchParams.get('id');

            if (token && clientId) {
                console.log(`Detected reset-password URL with token=${token} and id=${clientId}`);
                this.loadChangePasswordForm(token, clientId);
                return;
            } else {
                console.warn('Reset password URL missing token or id');
                SessionView.renderForgotPasswordError(
                    Translations[this.currentLang].alerts.missing_token_or_id || "Token ou ID de cliente inválido ou ausente.",
                    this.currentLang
                );
                this.loadForgotPasswordForm();
                return;
            }
        }

        // Procesar acciones normales solo si no es reset-password
        switch (action) {
            case "change_password":
                // Si llegamos aquí con change_password pero sin hash, mostrar error
                console.warn('Change password action without valid reset-password URL');
                SessionView.renderForgotPasswordError(
                    Translations[this.currentLang].alerts.missing_token_or_id || "Token ou ID de cliente inválido ou ausente.",
                    this.currentLang
                );
                this.loadForgotPasswordForm();
                break;
            case "login":
                this.loadLoginForm();
                break;
            case "register":
                this.loadRegisterForm();
                break;
            case "forgot_password":
                this.loadForgotPasswordForm();
                break;
            default:
                const cliente = JSON.parse(sessionStorage.getItem("cliente") || "null");
                const empleado = JSON.parse(sessionStorage.getItem("empleado") || "null");

                if (cliente || empleado) {
                    App.showHomeContent();
                } else {
                    this.loadLoginForm();
                }
        }
    },

    loadChangePasswordForm(token, clientId) {
        console.log("Carregando formulário de alteração de palavra-passe...");
        if (!token || !clientId) {
            console.error("Token or clientId missing, redirecting to forgot password form");
            SessionView.renderForgotPasswordError(
                Translations[this.currentLang].alerts.missing_token_or_id || "Token ou ID de cliente inválido ou ausente.",
                this.currentLang
            );
            this.loadForgotPasswordForm();
            return;
        }

        console.log(`Token: ${token}, ClientId: ${clientId}`);
        SessionView.render("pro-inventario", "change_password", this.currentLang, { token, clientId });

        setTimeout(() => {
            this.setupEvents();
            const form = document.getElementById("changePasswordForm");
            if (form) {
                console.log("Formulario cargado con datos:", {
                    tokenInForm: form.dataset.token,
                    clientIdInForm: form.dataset.clientId
                });
            } else {
                console.error("El formulario de cambio de contraseña no se encontró en el DOM");
            }
        }, 100);
    },

    setupEvents() {
        console.log("SesionController.setupEvents()...");

        const mainContainer = document.getElementById("pro-inventario");
        if (mainContainer && !mainContainer.hasListener) {
            mainContainer.addEventListener("click", (event) => {
                if (event.target.id === "logoutBtn") {
                    this.handleLogout();
                } else if (event.target.id === "forgotPasswordLink") {
                    event.preventDefault();
                    this.loadForgotPasswordForm();
                }
            });
            mainContainer.hasListener = true;
        }

        const loginForm = document.getElementById("loginForm");
        if (loginForm && !loginForm.hasListener) {
            loginForm.addEventListener("submit", (event) => this.handleLogin(event));
            loginForm.hasListener = true;
        }

        const registerForm = document.getElementById("registerForm");
        if (registerForm && !registerForm.hasListener) {
            registerForm.addEventListener("submit", (event) => this.handleRegister(event));
            registerForm.hasListener = true;
        }

        const forgotPasswordForm = document.getElementById("forgotPasswordForm");
        if (forgotPasswordForm && !forgotPasswordForm.hasListener) {
            forgotPasswordForm.addEventListener("submit", (event) => this.handleForgotPassword(event));
            forgotPasswordForm.hasListener = true;
        }

        const changePasswordForm = document.getElementById("changePasswordForm");
        if (changePasswordForm && !changePasswordForm.hasListener) {
            changePasswordForm.addEventListener("submit", (event) => this.handleChangePassword(event));
            changePasswordForm.hasListener = true;
        }
    },

    loadLoginForm() {
        console.log("Carregando formulário de login...");
        SessionView.render("pro-inventario", "login", this.currentLang);
        this.setupEvents();
    },

    loadRegisterForm() {
        console.log("Carregando formulário de registo...");
        SessionView.render("pro-inventario", "register", this.currentLang);
        this.setupEvents();
    },

    loadForgotPasswordForm() {
        console.log("Carregando formulário de recuperação de palavra-passe...");
        SessionView.render("pro-inventario", "forgot_password", this.currentLang);
        this.setupEvents();
    },

    async handleLogin(event) {
        event.preventDefault();
        console.log("SesionController.handleLogin()...");

        try {
            const emailOrId = document.getElementById("loginEmail")?.value.trim() || "";
            const password = document.getElementById("loginPassword")?.value || "";

            if (!emailOrId || !password) {
                throw new Error(Translations[this.currentLang].alerts.missing_fields || "Por favor, preencha todos os campos.");
            }

            let response;
            const isNumeric = /^\d+$/.test(emailOrId);

            if (isNumeric) {
                const credentials = { id: emailOrId, password };
                console.log("Credenciais de funcionário a enviar:", credentials);
                response = await SessionService.loginEmpleado(credentials);

                if (!response || Object.keys(response).length === 0) {
                    throw new Error(Translations[this.currentLang].alerts.employee_login_failed || "Autenticação de funcionário falhou: Dados inválidos recebidos.");
                }

                console.log("Resposta do servidor (funcionário):", response);

                if (response.rol_id !== 2) {
                    console.warn("O funcionário não tem rol_id = 2, forçando valor");
                    response.rol_id = 2;
                }

                sessionStorage.setItem("empleado", JSON.stringify(response));
                sessionStorage.removeItem("cliente");
            } else if (emailOrId.includes("@")) {
                const credentials = { username: emailOrId, password };
                console.log("Credenciais de cliente a enviar:", credentials);
                response = await SessionService.login(credentials);

                if (!response || Object.keys(response).length === 0) {
                    throw new Error(Translations[this.currentLang].alerts.client_login_failed || "Autenticação de cliente falhou: Dados inválidos recebidos.");
                }

                console.log("Resposta do servidor (cliente):", response);

                if (response.rol_id !== 1) {
                    console.warn("O cliente não tem rol_id = 1, forçando valor");
                    response.rol_id = 1;
                }

                sessionStorage.setItem("cliente", JSON.stringify(response));
                sessionStorage.removeItem("empleado");
            } else {
                throw new Error(Translations[this.currentLang].alerts.invalid_email_or_id || "Por favor, insira um email válido ou um ID numérico.");
            }

            const welcomeMessage = isNumeric
                ? Translations[this.currentLang].alerts.employee_login_success || "Login bem-sucedido! Bem-vindo, funcionário."
                : Translations[this.currentLang].alerts.client_login_success || "Login bem-sucedido! Bem-vindo, cliente.";
            SessionView.renderLoginSuccess(welcomeMessage, this.currentLang);

            App.onLoginSuccess(response);

            setTimeout(() => {
                App.showHomeContent();
            }, 1500);
        } catch (error) {
            console.error("Erro ao iniciar sessão:", {
                message: error.message,
                stack: error.stack
            });
            SessionView.renderLoginError(error.message || Translations[this.currentLang].alerts.login_error || "Erro ao iniciar sessão.", this.currentLang);
        }
    },

    async handleRegister(event) {
        event.preventDefault();
        console.log("SesionController.handleRegister()...");

        try {
            const registerData = {
                nickname: document.getElementById("registerNickname")?.value.trim() || "",
                nombre: document.getElementById("registerNombre")?.value.trim() || "",
                primerApellido: document.getElementById("registerApellido1")?.value.trim() || "",
                segundoApellido: document.getElementById("registerApellido2")?.value.trim() || "",
                dni: document.getElementById("registerDniNie")?.value.trim() || "",
                email: document.getElementById("registerEmail")?.value.trim() || "",
                telefono: document.getElementById("registerTelefono")?.value.trim() || "",
                password: document.getElementById("registerPassword")?.value.trim() || ""
            };

            if (!registerData.nickname || !registerData.nombre || !registerData.email || !registerData.password) {
                throw new Error(Translations[this.currentLang].alerts.missing_required_fields || "Os campos obrigatórios (nickname, nome, email, palavra-passe) devem estar preenchidos.");
            }

            console.log("Dados a enviar:", registerData);

            const response = await SessionService.registrar(registerData);
            console.log("Resposta do servidor:", response);

            SessionView.renderRegisterSuccess(
                Translations[this.currentLang].alerts.register_success || "Registo bem-sucedido! Pode iniciar sessão agora.",
                this.currentLang
            );
            document.getElementById("registerForm").reset();

            setTimeout(() => {
                this.loadLoginForm();
            }, 1500);
        } catch (error) {
            console.error("Erro ao registar:", error);
            SessionView.renderRegisterError(
                error.message || Translations[this.currentLang].alerts.register_error || "Erro ao registar o cliente.",
                this.currentLang
            );
        }
    },

    async handleForgotPassword(event) {
        event.preventDefault();
        console.log("SesionController.handleForgotPassword()...");

        try {
            const email = document.getElementById("forgotPasswordEmail")?.value.trim() || "";

            if (!email) {
                throw new Error(Translations[this.currentLang].alerts.missing_email || "Por favor, insira o seu email.");
            }

            if (!email.includes("@")) {
                throw new Error(Translations[this.currentLang].alerts.invalid_email || "Por favor, insira um email válido.");
            }

            console.log("Enviando solicitação de recuperação para:", email);

            const response = await SessionService.forgotPassword(email);
            console.log("Resposta do servidor:", response);

            SessionView.renderForgotPasswordSuccess(
                Translations[this.currentLang].alerts.forgot_password_success || "Um link de recuperação foi enviado para o seu email.",
                this.currentLang
            );

            setTimeout(() => {
                this.loadLoginForm();
            }, 2000);
        } catch (error) {
            console.error("Erro ao solicitar recuperação de palavra-passe:", error);
            SessionView.renderForgotPasswordError(
                error.message || Translations[this.currentLang].alerts.forgot_password_error || "Erro ao processar a solicitação de recuperação.",
                this.currentLang
            );
        }
    },

    async handleChangePassword(event) {
        event.preventDefault();
        console.log("SesionController.handleChangePassword()...");

        try {
            const newPassword = document.getElementById("newPassword")?.value.trim() || "";
            const confirmPassword = document.getElementById("confirmPassword")?.value.trim() || "";
            const form = document.getElementById("changePasswordForm");
            const token = form?.dataset.token || "";
            const clientId = form?.dataset.clientId || "";

            // Validaciones
            if (!newPassword || !confirmPassword) {
                throw new Error(Translations[this.currentLang].alerts.missing_password_fields || "Por favor, preencha ambos os campos de palavra-passe.");
            }

            if (newPassword !== confirmPassword) {
                throw new Error(Translations[this.currentLang].alerts.password_mismatch || "As palavras-passe não coincidem.");
            }

            if (!token || !clientId) {
                throw new Error(Translations[this.currentLang].alerts.missing_token_or_id || "Token ou ID de cliente inválido ou ausente.");
            }

            console.log("Solicitando cambio de contraseña al servicio...");
            const response = await SessionService.resetPassword(token, clientId, newPassword);
            console.log("Respuesta del servicio:", response);

            SessionView.renderChangePasswordSuccess(
                Translations[this.currentLang].alerts.change_password_success || "Palavra-passe alterada com sucesso! Pode iniciar sessão agora.",
                this.currentLang
            );

            setTimeout(() => {
                this.loadLoginForm();
            }, 2000);
        } catch (error) {
            console.error("Error en el controlador al cambiar contraseña:", error);
            SessionView.renderChangePasswordError(
                error.message || Translations[this.currentLang].alerts.change_password_error || "Erro ao alterar a palavra-passe.",
                this.currentLang
            );
        }
    },

    handleLogout() {
        console.log("SesionController.handleLogout()...");

        App.handleLogout();

        SessionView.renderLogoutSuccess(
            Translations[this.currentLang].alerts.logout_success || "Sessão terminada com sucesso.",
            this.currentLang
        );
    }
};

export default SesionController;