import ProductoController from './controllers/productoController.js';
import SesionController from './controllers/sessionController.js';
import ClienteController from './controllers/clienteController.js';
import PedidoController from './controllers/pedidoController.js';

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
    },

    setupSessionState() {
        this.cliente = JSON.parse(sessionStorage.getItem("cliente")) || null;
        console.log("Estado de sesión:", this.cliente ? "Usuario logueado" : "Usuario no logueado");
    },

    setEvents() {
        console.log("Configurando eventos...");

        // Evento para el enlace de Home
        document.querySelector('a[href="#"]')?.addEventListener("click", (e) => {
            e.preventDefault();
            this.showHomeContent();
        });

        // Evento para cerrar sesión
        document.getElementById("logoutLink")?.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Botón de logout en la página home
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

        // Navegación principal
        const btnBuscarProdutos = document.querySelector('a[href="#buscar-produtos"]');
        if (btnBuscarProdutos) {
            btnBuscarProdutos.addEventListener("click", () => {
                ProductoController.init("search");
                this.hideHomeContent();
            });
        }

        const btnCrearProducto = document.querySelector('a[href="#crear-productos"]');
        if (btnCrearProducto) {
            btnCrearProducto.addEventListener("click", () => {
                ProductoController.init("create");
                this.hideHomeContent();
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
                ClienteController.init("direcciones");
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
    },

    setupNavigation() {
        // Manejar cambios en el hash de la URL
        window.addEventListener("hashchange", () => {
            const hash = window.location.hash;
            console.log("Hash cambiado:", hash);

            if (hash === "" || hash === "#") {
                this.showHomeContent();
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

        if (!accountDropdown) return;

        if (this.cliente) {
            // Usuario logueado: mostrar el menú "Minha Conta"
            accountDropdown.style.display = "block";
        } else {
            // Usuario no logueado: ocultar el menú "Minha Conta"
            accountDropdown.style.display = "none";
        }
    },

    updateHomeSessionButtons() {
        const sessionButtons = document.getElementById("session-buttons");
        if (!sessionButtons) return;

        if (this.cliente) {
            // Usuario logueado
            sessionButtons.innerHTML = `
                <div class="alert alert-success mb-3">
                    Bem-vindo, ${this.cliente.nombre}!
                </div>
                <button id="logoutBtn" class="btn btn-danger">
                    <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </button>
            `;
        } else {
            // Usuario no logueado
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

        // Actualizar toda la UI y redirigir a Home
        this.updateUIForSession();
        this.showHomeContent(); // Redirige a la página de inicio
    },

    onLoginSuccess(clienteData) {
        console.log("Login exitoso, actualizando aplicación...", clienteData);
        this.cliente = clienteData;
        sessionStorage.setItem("cliente", JSON.stringify(clienteData));

        // Actualizar toda la UI
        this.updateUIForSession();

        // Mostrar mensaje de bienvenida
        const sessionButtons = document.getElementById("session-buttons");
        if (sessionButtons) {
            sessionButtons.innerHTML = `
                <div class="alert alert-success mb-3">
                    ¡Bienvenido ${clienteData.nombre}!
                </div>
                <button id="logoutBtn" class="btn btn-danger">
                    <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </button>
            `;
        }
    }
};

// Inicia la aplicación al cargar la página
$(function() {
    App.init();
});

// Exportar para que otros controladores puedan acceder
export default App;