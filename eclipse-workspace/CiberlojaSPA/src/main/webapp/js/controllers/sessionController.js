import SessionView from "../views/sessionView.js"; // Note: Renamed to SessionView to match export
import SesionService from "../services/sessionService.js";
import App from "../app.js";
import Translations from '../resources/translations.js';

const SesionController = {
    init(action, lang = 'pt') {
        console.log(`SesionController.init(${action}, ${lang})...`);
        this.currentLang = lang;
        if (action === "login") {
            this.loadLoginForm();
        } else if (action === "register") {
            this.loadRegisterForm();
        }
    },

    setupEvents() {
        console.log("SesionController.setupEvents()...");

        const mainContainer = document.getElementById("pro-inventario");
        if (mainContainer && !mainContainer.hasListener) {
            mainContainer.addEventListener("click", (event) => {
                if (event.target.id === "logoutBtn") {
                    this.handleLogout();
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
            const isNumeric = /^\d+$/.test(emailOrId); // Check if it's a number (employee ID)

            if (isNumeric) {
                // Employee login using ID and password
                const credentials = { id: emailOrId, password };
                console.log("Credenciais de funcionário a enviar:", credentials);
                response = await SesionService.loginEmpleado(credentials);

                if (!response || Object.keys(response).length === 0) {
                    throw new Error(Translations[this.currentLang].alerts.employee_login_failed || "Autenticação de funcionário falhou: Dados inválidos recebidos.");
                }

                console.log("Resposta do servidor (funcionário):", response);

                // Ensure employee has rol_id = 2
                if (response.rol_id !== 2) {
                    console.warn("O funcionário não tem rol_id = 2, forçando valor");
                    response.rol_id = 2;
                }

                // Store employee data in sessionStorage
                sessionStorage.setItem("empleado", JSON.stringify(response));
                sessionStorage.removeItem("cliente");
            } else if (emailOrId.includes("@")) {
                // Client login using email and password
                const credentials = { username: emailOrId, password };
                console.log("Credenciais de cliente a enviar:", credentials);
                response = await SesionService.login(credentials);

                if (!response || Object.keys(response).length === 0) {
                    throw new Error(Translations[this.currentLang].alerts.client_login_failed || "Autenticação de cliente falhou: Dados inválidos recebidos.");
                }

                console.log("Resposta do servidor (cliente):", response);

                // Ensure client has rol_id = 1
                if (response.rol_id !== 1) {
                    console.warn("O cliente não tem rol_id = 1, forçando valor");
                    response.rol_id = 1;
                }

                // Store client data in sessionStorage
                sessionStorage.setItem("cliente", JSON.stringify(response));
                sessionStorage.removeItem("empleado");
            } else {
                throw new Error(Translations[this.currentLang].alerts.invalid_email_or_id || "Por favor, insira um email válido ou um ID numérico.");
            }

            // Show success message
            const welcomeMessage = isNumeric
                ? Translations[this.currentLang].alerts.employee_login_success || "Login bem-sucedido! Bem-vindo, funcionário."
                : Translations[this.currentLang].alerts.client_login_success || "Login bem-sucedido! Bem-vindo, cliente.";
            SessionView.renderLoginSuccess(welcomeMessage, this.currentLang);

            // Notify App of successful login and sync state
            App.onLoginSuccess(response);

            // Redirect to home after a delay
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

            const response = await SesionService.registrar(registerData);
            console.log("Resposta do servidor:", response);

            SessionView.renderRegisterSuccess(
                Translations[this.currentLang].alerts.register_success || "Registo bem-sucedido! Pode iniciar sessão agora.",
                this.currentLang
            );
            document.getElementById("registerForm").reset();

            // Redirect to login form after a delay
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

    handleLogout() {
        console.log("SesionController.handleLogout()...");

        // Delegate logout handling to App for consistency
        App.handleLogout();

        // Show success message
        SessionView.renderLogoutSuccess(
            Translations[this.currentLang].alerts.logout_success || "Sessão terminada com sucesso.",
            this.currentLang
        );
    }
};

export default SesionController;