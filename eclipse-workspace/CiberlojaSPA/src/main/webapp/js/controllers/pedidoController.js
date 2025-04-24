// PedidoController.js
import PedidoView from "../views/pedidoView.js";
import PedidoService from "../services/pedidoService.js";
import ProductoView from "../views/productoView.js";
import ProductoService from "../services/productoService.js";

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
        
        // Remove previous event listeners to avoid duplicates
        document.removeEventListener("click", this.handleDocumentClick);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        document.addEventListener("click", this.handleDocumentClick);

        // Set up search inputs with debounce
        this.setupSearchInputs();

        // Clear button functionality
        const clearButton = document.getElementById("clear-search-form");
        if (clearButton && !clearButton.hasListener) {
            clearButton.addEventListener("click", () => this.clearSearchForm());
            clearButton.hasListener = true;
        }
    },

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

        // Handle change status button
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

        // Pagination handling
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

            // Obtener el pedido actual para mantener los otros campos
            const pedido = await PedidoService.findById(pedidoId);
            if (!pedido) {
                throw new Error("Pedido no encontrado");
            }

            // Crear el objeto actualizado
            const updatedPedido = {
                ...pedido,
                tipoEstadoPedidoId: newStatusId,
                // Actualizar el nombre del estado para la UI
                tipoEstadoPedidoNombre: selectElement.options[selectElement.selectedIndex].text
            };

            // Llamar al servicio para actualizar el pedido
            const result = await PedidoService.updatePedido(updatedPedido);
            console.log("Estado actualizado con éxito:", result);

            // Mostrar mensaje de éxito
            const container = document.getElementById("pro-inventario");
            if (container) {
                container.insertAdjacentHTML('afterbegin', `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Estado do pedido atualizado com sucesso!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }

            // Volver a renderizar la vista con el pedido actualizado
            PedidoView.renderPedidoDetalhe("pro-inventario", result);
        } catch (error) {
            console.error("Error al cambiar el estado del pedido:", error);
            PedidoView.renderError("Error al actualizar el estado del pedido. Por favor, intente novamente.");
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

    loadSearchForm() {
        console.log("Cargando formulario de búsqueda de pedidos...");
        PedidoView.renderSearchForm("pro-inventario");
        
        // Una vez renderizado el formulario, configuramos los eventos
        setTimeout(() => {
            this.setupEvents();
            // Cargar todos los pedidos por defecto al inicio
            this.handleSearch();
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

            // Convertir valores a los tipos esperados por el backend
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

            // Use findByCriteria with pagination
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
                // Por si el backend no implementa paginación
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
            PedidoView.renderError("Error al buscar pedidos. Por favor, intente nuevamente.");
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
                PedidoView.renderError("No se encontraron pedidos para este usuario.");
            }
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            PedidoView.renderError("Error al cargar pedidos. Por favor, intente nuevamente.");
        }
    },

    async loadPedidoDetalle(pedidoId) {
        console.log(`Cargando detalles del pedido ${pedidoId}...`);
        try {
            const pedido = await PedidoService.findById(pedidoId);
            if (!pedido) {
                throw new Error("Pedido no encontrado");
            }
            PedidoView.renderPedidoDetalhe("pro-inventario", pedido);
            // Reconfigurar eventos después de renderizar la vista
            this.setupEvents();
        } catch (error) {
            console.error("Error al cargar detalles del pedido:", error);
            PedidoView.renderError("Error al cargar detalles del pedido.");
        }
    },

    async loadProductoDetalle(productoId) {
        console.log(`Cargando detalles del producto ${productoId}...`);
        try {
            const producto = await ProductoService.findById(productoId);
            if (!producto) {
                throw new Error("Producto no encontrado");
            }
            ProductoView.renderProductoDetails(producto, "pro-inventario");
        } catch (error) {
            console.error("Error al cargar detalles del producto:", error);
            PedidoView.renderError("Error al cargar detalles del producto.");
        }
    },

    getStoredClienteData() {
        const clienteData = sessionStorage.getItem("cliente");
        return clienteData ? JSON.parse(clienteData) : null;
    },
};

export default PedidoController;