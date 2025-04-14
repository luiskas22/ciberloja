import ProductoController from './controllers/productoController.js';
import SesionController from './controllers/sessionController.js';
import ClienteController from './controllers/clienteController.js';
import PedidoController from './controllers/pedidoController.js';
import CartController from './controllers/cartController.js';
import DireccionController from './controllers/direccionController.js';
import FooterController from './controllers/footerController.js';
import LanguageManager from './resources/languageManager.js';

const App = {
  cliente: null,
  previousResults: [],
  languageManager: null,

  async init() {
    console.log("App.init()...");
    this.languageManager = new LanguageManager('pt');
    await this.setupSessionState();
    this.setEvents();
    this.setupNavigation();

    const hash = window.location.hash;
    console.log("Hash inicial:", hash);
    if (hash === "#cart" && this.cliente && this.isCliente()) {
      await CartController.init();
      this.hideHomeContent();
    } else if (hash === "#buscar-produtos") {
      ProductoController.init("search", this.languageManager.currentLang);
      this.hideHomeContent();
    } else if (hash === "#crear-productos" && this.isEmpleado()) {
      ProductoController.init("create", this.languageManager.currentLang);
      this.hideHomeContent();
    } else if (hash === "#buscar-pedidos" && this.cliente && this.isEmpleado()) {
      PedidoController.init("search", this.languageManager.currentLang);
      this.hideHomeContent();
    } else if (hash === "#mis-pedidos" && this.cliente) {
      PedidoController.init("pedidos", this.languageManager.currentLang);
      this.hideHomeContent();
    } else if (hash === "#mi-perfil") {
      ClienteController.init("perfil");
      this.hideHomeContent();
    } else if (hash === "#mis-direcciones") {
      DireccionController.init("direcciones");
      this.hideHomeContent();
    } else {
      await this.showHomeContent();
    }

    this.updateUIForSession();
    FooterController.init(this.languageManager.currentLang);
    this.languageManager.updateUI();
  },
  
  async setupSessionState() {
    const clienteData = sessionStorage.getItem("cliente");
    this.cliente = clienteData ? JSON.parse(clienteData) : null;

    console.log("Datos del cliente recuperados:", this.cliente);
    console.log("Rol detectado:", this.cliente ?
      (this.cliente.rol_id === 1 ? "Cliente" :
        this.cliente.rol_id === 2 ? "Empleado" : "Rol desconocido") :
      "No logueado");
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

    const btnBuscarProdutos = document.querySelector('a[href="#buscar-produtos"]');
    if (btnBuscarProdutos) {
      btnBuscarProdutos.addEventListener("click", (e) => {
        e.preventDefault();
        ProductoController.init("search", this.languageManager.currentLang);
        this.hideHomeContent();
      });
    }

    const btnCrearProducto = document.querySelector('a[href="#crear-productos"]');
    if (btnCrearProducto) {
      btnCrearProducto.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.isEmpleado()) {
          ProductoController.init("create", this.languageManager.currentLang);
          this.hideHomeContent();
        } else {
          alert(this.languageManager.getTranslation('alerts.employeeOnlyCreate'));
        }
      });
    }

    const btnBuscarPedidos = document.querySelector('a[href="#buscar-pedidos"]');
    if (btnBuscarPedidos) {
      btnBuscarPedidos.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.cliente) {
          if (this.isEmpleado()) {
            PedidoController.init("search", this.languageManager.currentLang);
            this.hideHomeContent();
          } else {
            alert(this.languageManager.getTranslation('alerts.employeeOnlyOrders'));
          }
        } else {
          alert(this.languageManager.getTranslation('alerts.loginEmployee'));
        }
      });
    }

    const btnMyProfile = document.querySelector('a[href="#mi-perfil"]');
    if (btnMyProfile) {
      btnMyProfile.addEventListener("click", (e) => {
        e.preventDefault();
        ClienteController.init("perfil");
        this.hideHomeContent();
      });
    }

    const btnDirecciones = document.querySelector('a[href="#mis-direcciones"]');
    if (btnDirecciones) {
      btnDirecciones.addEventListener("click", (e) => {
        e.preventDefault();
        DireccionController.init("direcciones");
        this.hideHomeContent();
      });
    }

    const btnPedidos = document.querySelector('a[href="#mis-pedidos"]');
    if (btnPedidos) {
      btnPedidos.addEventListener("click", (e) => {
        e.preventDefault();
        PedidoController.init("pedidos", this.languageManager.currentLang);
        this.hideHomeContent();
      });
    }

    const btnCart = document.querySelector('a[href="#cart"]');
    if (btnCart) {
      btnCart.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.cliente) {
          if (this.isCliente()) {
            CartController.init();
            this.hideHomeContent();
          } else {
            alert(this.languageManager.getTranslation('alerts.clientOnlyCart'));
          }
        } else {
          alert(this.languageManager.getTranslation('alerts.loginCart'));
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
      } else if (hash === "#buscar-pedidos" && this.cliente && this.isEmpleado()) {
        PedidoController.init("search", this.languageManager.currentLang);
      } else if (hash === "#mis-pedidos" && this.cliente) {
        PedidoController.init("pedidos", this.languageManager.currentLang);
      } else if (hash === "#buscar-produtos") {
        ProductoController.init("search", this.languageManager.currentLang);
      } else if (hash === "#crear-productos" && this.isEmpleado()) {
        ProductoController.init("create", this.languageManager.currentLang);
      } else if (hash === "#mi-perfil") {
        ClienteController.init("perfil");
      } else if (hash === "#mis-direcciones") {
        DireccionController.init("direcciones");
      }
    });
  },

  async showHomeContent() {
    console.log("Mostrando contenido home...");
    const homeContent = document.getElementById("home-content");
    const proInventario = document.getElementById("pro-inventario");

    if (homeContent && proInventario) {
      homeContent.style.display = "block";
      proInventario.style.display = "none";
      proInventario.innerHTML = "";
    }

    this.updateUIForSession();
    window.location.hash = "";
  },

  hideHomeContent() {
    console.log("Ocultando contenido home...");
    const homeContent = document.getElementById("home-content");
    const proInventario = document.getElementById("pro-inventario");

    if (homeContent && proInventario) {
      homeContent.style.display = "none";
      proInventario.style.display = "block";
    }
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
    const btnBuscarPedidos = document.querySelector('a[href="#buscar-pedidos"]');

    if (!accountDropdown) return;

    if (this.cliente) {
      accountDropdown.style.display = "block";
      if (btnCrearProducto) {
        btnCrearProducto.style.display = this.isEmpleado() ? "block" : "none";
      }
      if (btnCart) {
        btnCart.style.display = this.isCliente() ? "block" : "none";
      }
      if (btnBuscarPedidos) {
        btnBuscarPedidos.style.display = this.isEmpleado() ? "block" : "none";
      }
    } else {
      accountDropdown.style.display = "none";
      if (btnCrearProducto) btnCrearProducto.style.display = "none";
      if (btnCart) btnCart.style.display = "none";
      if (btnBuscarPedidos) btnBuscarPedidos.style.display = "none";
    }
  },

  updateHomeSessionButtons() {
    const sessionButtons = document.getElementById("session-buttons");
    if (!sessionButtons) return;

    if (this.cliente) {
      sessionButtons.innerHTML = `
        <div class="alert alert-success mb-3">
          ${this.languageManager.getTranslation('session.welcome')}, ${this.cliente.nombre}! (${this.isCliente() ? this.languageManager.getTranslation('session.client') : this.languageManager.getTranslation('session.employee')})
        </div>
        <button id="logoutBtn" class="btn btn-danger" data-i18n="session.logout">
          <i class="fas fa-sign-out-alt me-2"></i>${this.languageManager.getTranslation('session.logout')}
        </button>
      `;
    } else {
      sessionButtons.innerHTML = `
        <div class="d-grid gap-3">
          <a href="#login" class="btn btn-primary home-login-btn" data-i18n="session.login">
            <i class="fas fa-sign-in-alt me-2"></i>${this.languageManager.getTranslation('session.login')}
          </a>
          <a href="#register" class="btn btn-success home-register-btn" data-i18n="session.register">
            <i class="fas fa-user-plus me-2"></i>${this.languageManager.getTranslation('session.register')}
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

    const sessionButtons = document.getElementById("session-buttons");
    if (sessionButtons) {
      sessionButtons.innerHTML = `
        <div class="alert alert-success mb-3">
          ${this.languageManager.getTranslation('session.welcome')} ${clienteData.nombre}! (${this.isCliente() ? this.languageManager.getTranslation('session.client') : this.languageManager.getTranslation('session.employee')})
        </div>
        <button id="logoutBtn" class="btn btn-danger" data-i18n="session.logout">
          <i class="fas fa-sign-out-alt me-2"></i>${this.languageManager.getTranslation('session.logout')}
        </button>
      `;
    }
  },

  isCliente() {
    // Verifica tanto el rol_id como si es un objeto cliente válido
    return this.cliente && (this.cliente.rol_id === 1 || !this.cliente.hasOwnProperty('rol_id'));
  },

  isEmpleado() {
    // Solo empleados si tienen rol_id explícitamente como 2
    return this.cliente && this.cliente.rol_id === 2;
  },
};

$(function () {
  App.init();
});

export default App;