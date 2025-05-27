import ProductoController from './controllers/productoController.js';
import SesionController from './controllers/sessionController.js';
import ClienteController from './controllers/clienteController.js';
import PedidoController from './controllers/pedidoController.js';
import CartController from './controllers/cartController.js';
import DireccionController from './controllers/direccionController.js';
import FooterController from './controllers/footerController.js';
import LanguageManager from './resources/languageManager.js';


const Router = {
  init() {
    console.log("Router.init()...");
    // Configurar el evento hashchange para detectar cambios en la URL
    window.addEventListener('hashchange', this.handleRouteChange.bind(this));

    // Comprobar la ruta inicial al cargar la página
    this.handleRouteChange();
  },

  handleRouteChange() {
    const hash = window.location.hash;
    console.log('Hash changed:', hash);

    // Extraer la ruta del hash (p.ej., #/login -> login)
    let route = '';
    if (hash.startsWith('#/')) {
      route = hash.substring(2).split('?')[0]; // Eliminar parámetros de consulta
      console.log('Detected route with prefix:', route);

      // Rutas específicas con prefijo #/
      switch (route) {
        case 'login':
          SesionController.init('login', App.languageManager.currentLang);
          App.hideHomeContent();
          return;
        case 'register':
          SesionController.init('register', App.languageManager.currentLang);
          App.hideHomeContent();
          return;
        case 'forgot_password':
          SesionController.init('forgot_password', App.languageManager.currentLang);
          App.hideHomeContent();
          return;
        case 'reset-password':
          SesionController.init('change_password', App.languageManager.currentLang);
          App.hideHomeContent();
          return;
      }
    }

    // Para las rutas sin prefijo #/ (formato antiguo #reset-password)
    // o rutas no reconocidas con prefijo, procesamos el hash sin el #
    route = hash.substring(1);
    console.log('Processing standard route:', route);

    switch (route) {
      case 'cart':
        if (App.cliente && App.isCliente()) {
          CartController.init(App.languageManager.currentLang);
          App.hideHomeContent();
        } else {
          SesionController.init('login', App.languageManager.currentLang);
          App.hideHomeContent();
        }
        break;
      case 'buscar-produtos':
        ProductoController.init("search", App.languageManager.currentLang);
        App.hideHomeContent();
        break;
      case 'crear-productos':
        if (App.isEmpleado()) {
          ProductoController.init("create", App.languageManager.currentLang);
          App.hideHomeContent();
        } else {
          App.showHomeContent();
        }
        break;
      case 'buscar-pedidos':
        if (App.cliente && App.isEmpleado()) {
          PedidoController.init("search", App.languageManager.currentLang);
          App.hideHomeContent();
        } else {
          App.showHomeContent();
        }
        break;
      case 'mis-pedidos':
        if (App.cliente) {
          PedidoController.init("pedidos", App.languageManager.currentLang);
          App.hideHomeContent();
        } else {
          SesionController.init('login', App.languageManager.currentLang);
          App.hideHomeContent();
        }
        break;
      case 'mi-perfil':
        if (App.cliente) {
          ClienteController.init("perfil", App.languageManager.currentLang);
          App.hideHomeContent();
        } else {
          SesionController.init('login', App.languageManager.currentLang);
          App.hideHomeContent();
        }
        break;
      case 'mis-direcciones':
        if (App.cliente) {
          DireccionController.init(App.languageManager.currentLang);
          App.hideHomeContent();
        } else {
          SesionController.init('login', App.languageManager.currentLang);
          App.hideHomeContent();
        }
        break;
      case 'contact':
        App.showContactContent();
        break;
      case '':
        App.showHomeContent();
        break;
      default:
        // Si no se reconoce la ruta, mostramos la página principal
        App.showHomeContent();
        break;
    }
  }
};

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

    // Manejar rutas específicas al iniciar la aplicación
    if (hash.startsWith('#/reset-password')) { // Cambiar de === a startsWith para incluir parámetros
      SesionController.init('change_password', this.languageManager.currentLang);
      this.hideHomeContent();
    } else if (hash === "#cart" && this.cliente && this.isCliente()) {
      await CartController.init(this.languageManager.currentLang);
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
      ClienteController.init("perfil", this.languageManager.currentLang);
      this.hideHomeContent();
    } else if (hash === "#mis-direcciones") {
      DireccionController.init(this.languageManager.currentLang);
      this.hideHomeContent();
    } else if (hash === "#contact") {
      this.showContactContent();
    } else {
      // Caso por defecto: mostrar la página principal
      this.showHomeContent();
    }

    this.updateUIForSession();
    FooterController.init(this.languageManager.currentLang);

    // Inicializar el router después de manejar la ruta inicial
    Router.init();
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
        SesionController.init("login", this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (e.target.classList.contains("home-register-btn")) {
        e.preventDefault();
        SesionController.init("register", this.languageManager.currentLang);
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
        ClienteController.init("perfil", this.languageManager.currentLang);
        this.hideHomeContent();
      });
    }

    const btnDirecciones = document.querySelector('a[href="#mis-direcciones"]');
    if (btnDirecciones) {
      btnDirecciones.addEventListener("click", (e) => {
        e.preventDefault();
        DireccionController.init(this.languageManager.currentLang);
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
            CartController.init(this.languageManager.currentLang);
            this.hideHomeContent();
          } else {
            alert(this.languageManager.getTranslation('alerts.clientOnlyCart'));
          }
        } else {
          alert(this.languageManager.getTranslation('alerts.loginCart'));
        }
      });
    }

    // New event listeners for Contact and Services
    const btnContact = document.querySelector('a[href="#contact"]');
    if (btnContact) {
      btnContact.addEventListener("click", (e) => {
        e.preventDefault();
        FooterController.showContactPage();
        this.hideHomeContent();
      });
    }

    const btnServices = document.querySelector('a[href="#services"]');
    if (btnServices) {
      btnServices.addEventListener("click", (e) => {
        e.preventDefault();
        FooterController.showServicesPage();
        this.hideHomeContent();
      });
    }

    document.addEventListener('languageChange', (e) => {
      const { lang, currentHash } = e.detail;
      console.log(`Actualizando UI para idioma: ${lang}, hash: ${currentHash}`);

      if (currentHash === "#cart" && CartController.updateTranslations) {
        CartController.updateTranslations(lang);
      } else if (currentHash === "#buscar-produtos") {
        ProductoController.updateTranslations(lang);
      } else if (currentHash === "#crear-productos" && this.isEmpleado()) {
        ProductoController.updateTranslations(lang);
      } else if (currentHash === "#buscar-pedidos" && this.isEmpleado()) {
        PedidoController.updateTranslations(lang);
      } else if (currentHash === "#mis-pedidos") {
        PedidoController.updateTranslations(lang);
      } else if (currentHash === "#mi-perfil") {
        ClienteController.updateTranslations(lang);
      } else if (currentHash === "#mis-direcciones") {
        DireccionController.updateTranslations(lang);
      } else if (currentHash === "#contact") {
        this.showContactContent();
      } else if (currentHash === "#services") {
        this.showServicesContent();
      } else {
        this.updateUIForSession();
      }

      FooterController.init(lang);
    });
  },

  setupNavigation() {
    window.addEventListener("hashchange", () => {
      if (document.activeElement?.hasAttribute('data-lang')) {
        console.log("Cambio de hash ignorado: proviene de cambio de idioma");
        return;
      }

      const hash = window.location.hash;
      console.log("Hash cambiado:", hash);

      if (hash === "" || hash === "#") {
        this.showHomeContent();
      } else if (hash === "#cart" && this.cliente && this.isCliente()) {
        CartController.init(this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (hash === "#buscar-pedidos" && this.cliente && this.isEmpleado()) {
        PedidoController.init("search", this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (hash === "#mis-pedidos" && this.cliente) {
        PedidoController.init("pedidos", this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (hash === "#buscar-produtos") {
        ProductoController.init("search", this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (hash === "#crear-productos" && this.isEmpleado()) {
        ProductoController.init("create", this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (hash === "#mi-perfil") {
        ClienteController.init("perfil", this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (hash === "#mis-direcciones") {
        DireccionController.init(this.languageManager.currentLang);
        this.hideHomeContent();
      } else if (hash === "#contact") {
        this.showContactContent();
      } else if (hash === "#services") {
        this.showServicesContent();
      } else {
        this.showHomeContent();
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
    return this.cliente && (this.cliente.rol_id === 1 || !this.cliente.hasOwnProperty('rol_id'));
  },

  isEmpleado() {
    return this.cliente && this.cliente.rol_id === 2;
  },
};

$(function () {
  App.init();
});

export default App;