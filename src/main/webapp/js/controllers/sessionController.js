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
		this.setupEvents();
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
	},

	loadRegisterForm() {
		console.log("Cargando formulario de registro...");
		SesionView.render("pro-inventario", "register");
	},

	async handleLogin(event) {
		event.preventDefault();
		console.log("SesionController.handleLogin()...");

		try {
			const email = document.getElementById("loginEmail")?.value || "";
			const password = document.getElementById("loginPassword")?.value || "";

			if (!email || !password) {
				throw new Error("Por favor, complete todos los campos.");
			}

			const credentials = { username: email, password };
			console.log("Credenciales a enviar:", credentials);

			const response = await SesionService.login(credentials);

			// Enhanced validation
			if (!response || Object.keys(response).length === 0) {
				throw new Error("Autenticación fallida: No se recibieron datos de usuario");
			}

			console.log("Respuesta del servidor:", response);

			// Store user data securely
			sessionStorage.setItem("cliente", JSON.stringify(response));
			console.log("Cliente guardado en sesión:", response);

			// Mostrar mensaje de éxito
			SesionView.renderLoginSuccess("Login exitoso! Bem-vindo!");
			
			// Notificar a App del login exitoso y sincronizar estado
			App.onLoginSuccess(response);
			
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