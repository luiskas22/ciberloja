import SesionView from "../views/sessionView.js";
import SesionService from "../services/sessionService.js";
import App from "../app.js"; // Importar App para sincronizar el estado

const SesionController = {
    init(action) {
        console.log(`SesionController.init(${action})...`);
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
        console.log("Cargando formulario de login...");
        SesionView.render("pro-inventario", "login");
        this.setupEvents(); // Llamar a setupEvents después de renderizar
    },

    loadRegisterForm() {
        console.log("Cargando formulario de registro...");
        SesionView.render("pro-inventario", "register");
        this.setupEvents(); // Llamar a setupEvents después de renderizar
    },

    async handleLogin(event) {
        event.preventDefault();
        console.log("SesionController.handleLogin()...");

        try {
            const emailOrId = document.getElementById("loginEmail")?.value.trim() || "";
            const password = document.getElementById("loginPassword")?.value || "";

            if (!emailOrId || !password) {
                throw new Error("Por favor, complete todos los campos.");
            }

            let response;
            const isNumeric = /^\d+$/.test(emailOrId); // Verifica si es un número (ID de empleado)

            if (isNumeric) {
                // Login de empleado usando ID y contraseña
                const credentials = { id: emailOrId, password };
                console.log("Credenciales de empleado a enviar:", credentials);
                response = await SesionService.loginEmpleado(credentials);

                if (!response || Object.keys(response).length === 0) {
                    throw new Error("Autenticación de empleado fallida: No se recibieron datos válidos");
                }

                console.log("Respuesta del servidor (empleado):", response);

                // Guardar datos del empleado en sessionStorage
                sessionStorage.setItem("empleado", JSON.stringify(response));
                sessionStorage.removeItem("cliente"); // Asegurar que no haya datos de cliente
            } else if (emailOrId.includes("@")) {
                // Login de cliente usando email y contraseña
                const credentials = { username: emailOrId, password };
                console.log("Credenciales de cliente a enviar:", credentials);
                response = await SesionService.login(credentials);

                if (!response || Object.keys(response).length === 0) {
                    throw new Error("Autenticación de cliente fallida: No se recibieron datos válidos");
                }

                console.log("Respuesta del servidor (cliente):", response);

                // Guardar datos del cliente en sessionStorage
                sessionStorage.setItem("cliente", JSON.stringify(response));
                sessionStorage.removeItem("empleado"); // Asegurar que no haya datos de empleado
            } else {
                throw new Error("Por favor, ingrese un email válido o un ID numérico.");
            }

            // Mostrar mensaje de éxito
            SesionView.renderLoginSuccess(`¡Login exitoso! Bienvenid${isNumeric ? "o empleado" : "o"}!`);

            // Notificar a App del login exitoso y sincronizar estado
            App.onLoginSuccess(response, isNumeric ? "empleado" : "cliente");

            // Redirigir al home después de unos segundos
            setTimeout(() => {
                App.showHomeContent();
            }, 1500);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            SesionView.renderLoginError(error.message || "Error al iniciar sesión.");
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
                throw new Error("Los campos obligatorios (nickname, nombre, email, contraseña) deben estar completos.");
            }

            console.log("Datos a enviar:", registerData);

            const response = await SesionService.registrar(registerData);
            console.log("Respuesta del servidor:", response);

            SesionView.renderRegisterSuccess("Registro exitoso! Puede iniciar sesión ahora.");
            document.getElementById("registerForm").reset();

            // Redirigir al formulario de login después de unos segundos
            setTimeout(() => {
                this.loadLoginForm();
            }, 1500);
        } catch (error) {
            console.error("Error al registrar:", error);
            SesionView.renderRegisterError(error.message || "Error al registrar el cliente.");
        }
    },

    handleLogout() {
        console.log("SesionController.handleLogout()...");

        // Delegar el manejo del logout a App para mantener consistencia
        App.handleLogout();

        // Mostrar mensaje de éxito en el área de trabajo actual
        SesionView.renderLogoutSuccess("Has cerrado sesión correctamente.");
    }
};

export default SesionController;