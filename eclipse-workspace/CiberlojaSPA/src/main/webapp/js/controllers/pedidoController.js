import PedidoView from "../views/pedidoView.js";
import PedidoService from "../services/pedidoService.js";
import ProductoView from "../views/productoView.js";
import ProductoService from "../services/productoService.js";
import FileService from "../services/fileService.js";

function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

const PedidoController = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    previousResults: [],
    lastCriteria: null, // Add storage for last search criteria
    imageCache: new Map(), // Add image cache

    async getProductImages(productId) {
        if (this.imageCache.has(productId)) {
            return this.imageCache.get(productId);
        }
        try {
            const images = await FileService.getImagesByProductoId(productId);
            this.imageCache.set(productId, images || []);
            return images || [];
        } catch (error) {
            console.warn(`No se pudieron cargar las imágenes para el producto ${productId}:`, error);
            this.imageCache.set(productId, []);
            return [];
        }
    },

    init(action) {
        console.log(`PedidoController.init(${action})...`);
        if (action === "pedidos") {
            this.loadPedidos();
        } else if (action === "search") {
            this.loadSearchForm();
        }
        this.setupEvents();
    },

    setupEvents() {
        console.log("PedidoController.setupEvents()...");
        document.removeEventListener("click", this.handleDocumentClick);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        document.addEventListener("click", this.handleDocumentClick);
        this.setupSearchInputs();
        const clearButton = document.getElementById("clear-search-form");
        if (clearButton && !clearButton.hasListener) {
            clearButton.addEventListener("click", () => this.clearSearchForm());
            clearButton.hasListener = true;
        }
    },

    // En pedidoController.js - Método handleDocumentClick

    handleDocumentClick(event) {
        const detalleTarget = event.target.closest(".btn-ver-detalle");
        if (detalleTarget) {
            event.preventDefault();
            const pedidoId = detalleTarget.dataset.pedidoId;
            if (pedidoId) {
                this.loadPedidoDetalle(pedidoId);
            }
            return;
        }

        const productoTarget = event.target.closest(".producto-link");
        if (productoTarget) {
            event.preventDefault();
            const productoId = productoTarget.dataset.productoId;
            if (productoId) {
                this.loadProductoDetalle(productoId);
            }
            return;
        }

        const cambiarEstadoTarget = event.target.closest(".btn-cambiar-estado");
        if (cambiarEstadoTarget) {
            event.preventDefault();
            const pedidoId = cambiarEstadoTarget.dataset.pedidoId;
            console.log("Botón de cambio de estado detectado para pedido:", pedidoId);
            if (pedidoId) {
                this.handleChangeStatus(pedidoId);
            }
            return;
        }

        const backTarget = event.target.closest(".btn-back");
        if (backTarget) {
            event.preventDefault();
            const backType = backTarget.dataset.backType;
            console.log("Botón de volver detectado, tipo:", backType);

            if (backType === 'search') {
                // Para empleados: volver a la búsqueda
                this.loadSearchForm();
            } else {
                // Para clientes: volver a la lista de pedidos
                this.loadPedidos();
            }
            return;
        }

        if (event.target.classList.contains("page-link") || event.target.parentElement.classList.contains("page-link")) {
            event.preventDefault();
            const pageElement = event.target.classList.contains("page-link") ? event.target : event.target.parentElement;
            const page = parseInt(pageElement.dataset.page);
            console.log("Navegando a página:", page);
            if (!isNaN(page)) {
                this.goToPage(page);
            }
        }
    },

    // También agregar un método helper para verificar el rol
    isEmpleado() {
        if (window.App && window.App.isEmpleado) {
            return window.App.isEmpleado();
        } else {
            const clienteData = sessionStorage.getItem("cliente");
            if (clienteData) {
                const cliente = JSON.parse(clienteData);
                return cliente && cliente.rol_id === 2;
            }
        }
        return false;
    },

    async handleChangeStatus(pedidoId) {
        console.log(`Cambiando estado del pedido ${pedidoId}...`);
        try {
            const selectElement = document.getElementById("tipo-estado-pedido-id");
            if (!selectElement) {
                throw new Error("Elemento de selección de estado no encontrado.");
            }
            const newStatusId = parseInt(selectElement.value);
            if (!newStatusId) {
                throw new Error("Estado inválido seleccionado.");
            }

            const pedido = await PedidoService.findById(pedidoId);
            if (!pedido) {
                throw new Error("Pedido no encontrado");
            }

            const updatedPedido = {
                ...pedido,
                tipoEstadoPedidoId: newStatusId,
                tipoEstadoPedidoNombre: selectElement.options[selectElement.selectedIndex].text
            };

            const result = await PedidoService.updatePedido(updatedPedido);
            console.log("Estado actualizado con éxito:", result);

            const container = document.getElementById("pro-inventario");
            if (container) {
                container.insertAdjacentHTML('afterbegin', `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Estado do pedido atualizado com sucesso!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }

            PedidoView.renderPedidoDetalhe("pro-inventario", result);
        } catch (error) {
            console.error("Error al cambiar el estado del pedido:", error);
            PedidoView.renderError("pro-inventario", "Error al actualizar el estado del pedido. Por favor, intente novamente.");
        }
    },

    setupSearchInputs() {
        const inputs = [
            "pedido-id", "fecha-desde", "fecha-hasta",
            "precio-desde", "precio-hasta", "cliente-id",
            "tipo-estado-pedido-id", "producto-id", "descripcion"
        ];
        const debouncedSearch = debounce(() => this.handleSearch(), 300);

        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                if (input.hasListener) {
                    input.removeEventListener("input", input.listener);
                }
                const listener = () => debouncedSearch();
                input.addEventListener("input", listener);
                input.hasListener = true;
                input.listener = listener;
            }
        });
    },

    clearSearchForm() {
        console.log("PedidoController.clearSearchForm()...");
        const form = document.getElementById("search-pedidos-form");
        if (form) {
            form.reset();
            this.handleSearch();
        }
    },

    loadSearchForm(preserveState = false) {
        console.log("Cargando formulario de búsqueda de pedidos...");
        PedidoView.renderSearchForm("pro-inventario");
        setTimeout(() => {
            this.setupEvents();
            if (preserveState && this.previousResults.length > 0) {
                // Restore previous search criteria
                const criteria = {
                    id: document.getElementById("pedido-id"),
                    fechaDesde: document.getElementById("fecha-desde"),
                    fechaHasta: document.getElementById("fecha-hasta"),
                    precioDesde: document.getElementById("precio-desde"),
                    precioHasta: document.getElementById("precio-hasta"),
                    clienteId: document.getElementById("cliente-id"),
                    tipoEstadoPedidoId: document.getElementById("tipo-estado-pedido-id"),
                    productoId: document.getElementById("producto-id"),
                    descripcion: document.getElementById("descripcion")
                };

                // Example: Restore values if they exist in the last search criteria
                if (this.lastCriteria) {
                    if (criteria.id) criteria.id.value = this.lastCriteria.id || "";
                    if (criteria.fechaDesde) criteria.fechaDesde.value = this.lastCriteria.fechaDesde || "";
                    if (criteria.fechaHasta) criteria.fechaHasta.value = this.lastCriteria.fechaHasta || "";
                    if (criteria.precioDesde) criteria.precioDesde.value = this.lastCriteria.precioDesde || "";
                    if (criteria.precioHasta) criteria.precioHasta.value = this.lastCriteria.precioHasta || "";
                    if (criteria.clienteId) criteria.clienteId.value = this.lastCriteria.clienteId || "";
                    if (criteria.tipoEstadoPedidoId) criteria.tipoEstadoPedidoId.value = this.lastCriteria.tipoEstadoPedidoId || "";
                    if (criteria.productoId) criteria.productoId.value = this.lastCriteria.productoId || "";
                    if (criteria.descripcion) criteria.descripcion.value = this.lastCriteria.descripcion || "";
                }

                // Re-render previous results
                PedidoView.renderSearchResults(
                    "search-results",
                    this.previousResults,
                    this.currentPage,
                    this.itemsPerPage,
                    this.totalItems
                );
            } else {
                // Reset form and trigger a fresh search
                this.clearSearchForm();
            }
        }, 100);
    },
    async handleSearch(page = 1) {
        console.log(`Procesando búsqueda de pedidos (página ${page})...`);
        this.currentPage = page;

        try {
            const criteria = {
                id: document.getElementById("pedido-id")?.value || null,
                fechaDesde: document.getElementById("fecha-desde")?.value || null,
                fechaHasta: document.getElementById("fecha-hasta")?.value || null,
                precioDesde: document.getElementById("precio-desde")?.value || null,
                precioHasta: document.getElementById("precio-hasta")?.value || null,
                clienteId: document.getElementById("cliente-id")?.value || null,
                tipoEstadoPedidoId: document.getElementById("tipo-estado-pedido-id")?.value || null,
                productoId: document.getElementById("producto-id")?.value || null,
                descripcion: document.getElementById("descripcion")?.value || null,
                page: this.currentPage - 1,
                size: this.itemsPerPage
            };

            // Store criteria for restoration
            this.lastCriteria = { ...criteria };

            const pedidoCriteria = {
                id: criteria.id ? parseInt(criteria.id) : null,
                fechaDesde: criteria.fechaDesde || null,
                fechaHasta: criteria.fechaHasta || null,
                precioDesde: criteria.precioDesde ? parseFloat(criteria.precioDesde) : null,
                precioHasta: criteria.precioHasta ? parseFloat(criteria.precioHasta) : null,
                clienteId: criteria.clienteId ? parseInt(criteria.clienteId) : null,
                tipoEstadoPedidoId: criteria.tipoEstadoPedidoId ? parseInt(criteria.tipoEstadoPedidoId) : null,
                productoId: criteria.productoId ? parseInt(criteria.productoId) : null,
                descripcion: criteria.descripcion || null,
                page: criteria.page,
                size: criteria.size
            };

            const response = await PedidoService.findByCriteria(pedidoCriteria);
            console.log("Respuesta del servicio:", response);

            if (response && Array.isArray(response.page)) {
                this.previousResults = response.page;
                this.totalItems = response.totalElements || response.page.length;
                this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

                PedidoView.renderSearchResults(
                    "search-results",
                    this.previousResults,
                    this.currentPage,
                    this.itemsPerPage,
                    this.totalItems
                );
            } else if (Array.isArray(response)) {
                this.previousResults = response;
                this.totalItems = response.length;
                this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

                const startIndex = (this.currentPage - 1) * this.itemsPerPage;
                const endIndex = startIndex + this.itemsPerPage;
                const paginatedResults = this.previousResults.slice(startIndex, endIndex);

                PedidoView.renderSearchResults(
                    "search-results",
                    paginatedResults,
                    this.currentPage,
                    this.itemsPerPage,
                    this.totalItems
                );
            } else {
                this.previousResults = [];
                this.totalItems = 0;
                this.totalPages = 0;
                PedidoView.renderSearchResults("search-results", [], 1, this.itemsPerPage, 0);
            }
        } catch (error) {
            console.error("Error al buscar pedidos:", error);
            this.previousResults = [];
            this.totalItems = 0;
            this.totalPages = 0;
            PedidoView.renderError("search-results", "Error al buscar pedidos. Por favor, intente nuevamente.");
        }
    },

    goToPage(page) {
        console.log(`PedidoController.goToPage(${page}) - Total páginas: ${this.totalPages}`);
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.handleSearch(page);
        }
    },

    async loadPedidos() {
        console.log("Cargando pedidos del usuario...");
        try {
            const clienteData = this.getStoredClienteData();
            if (!clienteData || !clienteData.id) {
                throw new Error("Usuario no identificado. Por favor, inicie sesión.");
            }

            const pedidos = await PedidoService.findPedidosByClienteId(clienteData.id);

            if (pedidos && pedidos.length > 0) {
                PedidoView.renderPedidos("pro-inventario", pedidos);
            } else {
                PedidoView.renderError("pro-inventario", "No se encontraron pedidos para este usuario.");
            }
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            PedidoView.renderError("pro-inventario", "Error al cargar pedidos. Por favor, intente nuevamente.");
        }
    },

    async loadPedidoDetalle(pedidoId) {
        console.log(`Cargando detalles del pedido ${pedidoId}...`);
        try {
            const pedido = await PedidoService.findById(pedidoId);
            if (!pedido) {
                throw new Error("Pedido no encontrado");
            }

            // Pre-cargar imágenes para cada producto en las líneas del pedido
            if (pedido.lineas && pedido.lineas.length > 0) {
                for (let linea of pedido.lineas) {
                    try {
                        const images = await this.getProductImages(linea.productoId);
                        linea.imageSrc = images && images.length > 0
                            ? `http://192.168.99.40:8080${images[0].url}`
                            : './img/placeholder.png';
                    } catch (imageError) {
                        console.warn(`No se pudieron cargar las imágenes para el producto ${linea.productoId}:`, imageError);
                        linea.imageSrc = './img/placeholder.png';
                    }
                }
            }

            PedidoView.renderPedidoDetalhe("pro-inventario", pedido);
            this.setupEvents();
        } catch (error) {
            console.error("Error al cargar detalles del pedido:", error);
            PedidoView.renderError("pro-inventario", "Error al cargar detalles del pedido.");
        }
    },

    async loadProductoDetalle(productoId) {
        console.log(`Cargando detalles del producto ${productoId}...`);
        try {
            const producto = await ProductoService.findById(productoId);
            if (!producto) {
                throw new Error("Producto no encontrado");
            }
            // Pre-cargar imágenes para el producto
            producto.images = await this.getProductImages(productoId);
            ProductoView.renderProductoDetails(producto, "pro-inventario");
        } catch (error) {
            console.error("Error al cargar detalles del producto:", error);
            PedidoView.renderError("pro-inventario", "Error al cargar detalles del producto.");
        }
    },

    getStoredClienteData() {
        const clienteData = sessionStorage.getItem("cliente");
        return clienteData ? JSON.parse(clienteData) : null;
    },
};

export default PedidoController;