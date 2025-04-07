import ProductoController from './controllers/productoController.js';
import SesionController from './controllers/sessionController.js';
import ClienteController from './controllers/clienteController.js';
import PedidoController from './controllers/pedidoController.js';
import CartController from './controllers/cartController.js';
import DireccionController from './controllers/direccionController.js'
import FooterController from './controllers/footerController.js'; // Nueva importación

const App = {
	cliente: null,
	previousResults: [],

	init() {
		console.log("App.init()...");
		this.setupSessionState();
		this.setEvents();
		this.showHomeContent();
		this.setupNavigation();
		this.updateUIForSession();
		if (this.cliente) {
			CartController.init(); // Inicializar el carrito solo si hay sesión
		}
		FooterController.init(); // Inicializar el footer
	},

	setupSessionState() {
		this.cliente = JSON.parse(sessionStorage.getItem("cliente")) || null;
		console.log("Estado de sesión:", this.cliente ? `Usuario logueado (rol_id: ${this.cliente.rol_id})` : "Usuario no logueado");
	},

	setEvents() {
		console.log("Configurando eventos...");

		document.querySelector('a[href="#"]')?.addEventListener("click", (e) => {
			e.preventDefault();
			this.showHomeContent();
		});

		document.getElementById("logoutLink")?.addEventListener("click", (e) => {
			e.preventDefault();
			this.handleLogout();
		});

		document.addEventListener("click", (e) => {
			if (e.target.id === "logoutBtn") {
				this.handleLogout();
			} else if (e.target.classList.contains("home-login-btn")) {
				e.preventDefault();
				SesionController.init("login");
				this.hideHomeContent();
			} else if (e.target.classList.contains("home-register-btn")) {
				e.preventDefault();
				SesionController.init("register");
				this.hideHomeContent();
			}
		});

		// Evento para buscar productos (disponible para todos)
		const btnBuscarProdutos = document.querySelector('a[href="#buscar-produtos"]');
		if (btnBuscarProdutos) {
			btnBuscarProdutos.addEventListener("click", () => {
				ProductoController.init("search");
				this.hideHomeContent();
			});
		}

		// Evento para crear productos (solo empleados)
		const btnCrearProducto = document.querySelector('a[href="#crear-productos"]');
		if (btnCrearProducto) {
			btnCrearProducto.addEventListener("click", () => {
				if (this.isEmpleado()) {
					ProductoController.init("create");
					this.hideHomeContent();
				} else {
					alert("Solo los empleados pueden crear productos.");
				}
			});
		}

		const btnMyProfile = document.querySelector('a[href="#mi-perfil"]');
		if (btnMyProfile) {
			btnMyProfile.addEventListener("click", () => {
				ClienteController.init("perfil");
				this.hideHomeContent();
			});
		}

		const btnDirecciones = document.querySelector('a[href="#mis-direcciones"]');
		if (btnDirecciones) {
			btnDirecciones.addEventListener("click", () => {
				DireccionController.init("direcciones");
				this.hideHomeContent();
			});
		}

		const btnPedidos = document.querySelector('a[href="#mis-pedidos"]');
		if (btnPedidos) {
			btnPedidos.addEventListener("click", () => {
				PedidoController.init("pedidos");
				this.hideHomeContent();
			});
		}

		// Evento para el carrito (solo clientes)
		const btnCart = document.querySelector('a[href="#cart"]');
		if (btnCart) {
			btnCart.addEventListener("click", () => {
				if (this.cliente) {
					if (this.isCliente()) {
						CartController.init();
						this.hideHomeContent();
					} else {
						alert("Solo los clientes pueden acceder al carrito.");
					}
				} else {
					alert("Por favor, inicia sesión para ver tu carrito.");
				}
			});
		}
	},

	setupNavigation() {
		window.addEventListener("hashchange", () => {
			const hash = window.location.hash;
			console.log("Hash cambiado:", hash);

			if (hash === "" || hash === "#") {
				this.showHomeContent();
			} else if (hash === "#cart" && this.cliente && this.isCliente()) {
				CartController.init();
				this.hideHomeContent();
			}
		});
	},

	showHomeContent() {
		console.log("Mostrando contenido home...");
		const homeContent = document.getElementById("home-content");
		const proInventario = document.getElementById("pro-inventario");

		homeContent.style.display = "block";
		proInventario.style.display = "none";
		proInventario.innerHTML = "";

		this.updateUIForSession();
		window.location.hash = "";
	},

	hideHomeContent() {
		console.log("Ocultando contenido home...");
		const homeContent = document.getElementById("home-content");
		const proInventario = document.getElementById("pro-inventario");

		homeContent.style.display = "none";
		proInventario.style.display = "block";
	},

	updateUIForSession() {
		console.log("Actualizando UI según estado de sesión...");
		this.updateNavbarButtons();
		this.updateHomeSessionButtons();
	},

	updateNavbarButtons() {
		console.log("Actualizando botones de navegación...");
		const accountDropdown = document.getElementById("accountDropdown");
		const btnCrearProducto = document.querySelector('a[href="#crear-productos"]');
		const btnCart = document.querySelector('a[href="#cart"]');

		if (!accountDropdown) return;

		if (this.cliente) {
			accountDropdown.style.display = "block";
			// Mostrar u ocultar opciones según el rol
			if (btnCrearProducto) {
				btnCrearProducto.style.display = this.isEmpleado() ? "block" : "none";
			}
			if (btnCart) {
				btnCart.style.display = this.isCliente() ? "block" : "none";
			}
		} else {
			accountDropdown.style.display = "none";
			if (btnCrearProducto) btnCrearProducto.style.display = "none";
			if (btnCart) btnCart.style.display = "none";
		}
	},

	updateHomeSessionButtons() {
		const sessionButtons = document.getElementById("session-buttons");
		if (!sessionButtons) return;

		if (this.cliente) {
			sessionButtons.innerHTML = `
                <div class="alert alert-success mb-3">
                    Bem-vindo, ${this.cliente.nombre}! (${this.isCliente() ? "Cliente" : "Empleado"})
                </div>
                <button id="logoutBtn" class="btn btn-danger">
                    <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </button>
            `;
		} else {
			sessionButtons.innerHTML = `
                <div class="d-grid gap-3">
                    <a href="#login" class="btn btn-primary home-login-btn">
                        <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
                    </a>
                    <a href="#register" class="btn btn-success home-register-btn">
                        <i class="fas fa-user-plus me-2"></i>Registrarse
                    </a>
                </div>
            `;
		}
	},

	handleLogout() {
		console.log("Cerrando sesión...");
		sessionStorage.removeItem("cliente");
		this.cliente = null;

		this.updateUIForSession();
		this.showHomeContent();
	},

	onLoginSuccess(clienteData) {
		console.log("Login exitoso, actualizando aplicación...", clienteData);
		this.cliente = clienteData;
		sessionStorage.setItem("cliente", JSON.stringify(clienteData));

		this.updateUIForSession();
		if (this.isCliente()) {
			CartController.init(); // Inicializar el carrito solo para clientes
		}

		const sessionButtons = document.getElementById("session-buttons");
		if (sessionButtons) {
			sessionButtons.innerHTML = `
                <div class="alert alert-success mb-3">
                    ¡Bienvenido ${clienteData.nombre}! (${this.isCliente() ? "Cliente" : "Empleado"})
                </div>
                <button id="logoutBtn" class="btn btn-danger">
                    <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </button>
            `;
		}
	},

	// Métodos auxiliares para verificar el tipo de usuario
	isCliente() {
		return this.cliente && this.cliente.rol_id === 1;
	},

	isEmpleado() {
		return this.cliente && this.cliente.rol_id === 2;
	}
};

$(function() {
	App.init();
});

export default App;