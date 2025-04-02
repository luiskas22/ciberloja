import ProductoView from "../views/productoView.js";
import ProductoService from "../services/productoService.js";
import App from "../app.js"; // Importar App para acceder al estado del usuario

function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

const ProductoController = {
    previousResults: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,

    init(action) {
        console.log(`ProductoController.init(${action})...`);
        if (action === "search") {
            this.loadProductoSearchForm();
        } else if (action === "create") {
            if (App.isEmpleado()) {
                this.loadProductoAddForm();
            } else {
                alert("Solo los empleados pueden crear productos.");
                this.loadProductoSearchForm(); // Redirigir a búsqueda
            }
        }
    },

    setupEvents() {
        console.log("ProductoController.setupEvents()...");
        this.setupSearchInputs();

        document.removeEventListener("click", this.handleDocumentClick);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        document.addEventListener("click", this.handleDocumentClick);

        const createForm = document.getElementById("createProductoForm");
        if (createForm && !createForm.hasListener && App.isEmpleado()) {
            createForm.addEventListener("submit", (event) => this.handleAddProducto(event));
            createForm.hasListener = true;
        }

        // Evento para el botón Limpiar
        const clearButton = document.getElementById("clearSearchForm");
        if (clearButton && !clearButton.hasListener) {
            clearButton.addEventListener("click", () => this.clearSearchForm());
            clearButton.hasListener = true;
        }
    },

    clearSearchForm() {
        console.log("ProductoController.clearSearchForm()...");
        const form = document.getElementById("searchProductosForm");
        if (form) {
            form.reset(); // Resetea todos los campos del formulario
            this.handleSearch(); // Realiza una nueva búsqueda con los campos vacíos
        }
    },

    handleDocumentClick(event) {
        const target = event.target;

        if (target.classList.contains("product-link")) {
            const productId = target.getAttribute("data-id");
            const inputs = document.querySelectorAll('#searchProductosForm input, #searchProductosForm select');
            inputs.forEach(input => {
                input.dataset.previousValue = input.value;
            });
            this.fetchProductoInfo(productId);
        }

        if (target.id === "backToResultsBtn") {
            event.preventDefault();
            this.showPreviousResults();
        }

        if (target.id === "deleteProduct" && App.isEmpleado()) {
            const productId = target.getAttribute("data-id");
            this.handleDeleteProduct(productId);
        }

        if (target.classList.contains("page-link") || target.parentElement.classList.contains("page-link")) {
            event.preventDefault();
            const pageElement = target.classList.contains("page-link") ? target : target.parentElement;
            const page = parseInt(pageElement.dataset.page);
            console.log("Navegando a página:", page);
            if (!isNaN(page)) {
                this.goToPage(page);
            }
        }
    },

    setupSearchInputs() {
        const inputs = [
            "idCriteria", "nombreCriteria", "descripcionCriteria",
            "precioMinCriteria", "precioMaxCriteria", "stockMinCriteria",
            "stockMaxCriteria", "nombreCategoriaCriteria", "nombreMarcaCriteria",
            "nombreUnidadMedidaCriteria"
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

    showPreviousResults() {
        const container = document.getElementById("pro-inventario");
        if (!container) return;

        if (!document.getElementById('searchResults')) {
            ProductoView.render("pro-inventario", "search");
            const inputs = [
                "idCriteria", "nombreCriteria", "descripcionCriteria",
                "precioMinCriteria", "precioMaxCriteria", "stockMinCriteria",
                "stockMaxCriteria", "nombreCategoriaCriteria",
                "nombreMarcaCriteria", "nombreUnidadMedidaCriteria"
            ];
            inputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input && input.dataset.previousValue) {
                    input.value = input.dataset.previousValue;
                }
            });
            this.setupEvents();
        }

        if (this.previousResults && this.previousResults.length > 0) {
            ProductoView.renderResults(this.previousResults, "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems);
        } else {
            this.handleSearch();
        }
    },

    loadProductoSearchForm() {
        console.log("Cargando formulario de búsqueda de productos...");
        ProductoView.render("pro-inventario", "search");
        this.setupEvents();
        this.handleSearch();
    },

    loadProductoAddForm() {
        console.log("Cargando formulario de creación de productos...");
        ProductoView.render("pro-inventario", "create");
        this.setupEvents();
    },

    async handleSearch(page = 1) {
        console.log(`ProductoController.handleSearch(page: ${page})...`);
        this.currentPage = page;

        const criteria = {
            id: document.getElementById("idCriteria")?.value ? Number(document.getElementById("idCriteria").value) : null,
            nombre: document.getElementById("nombreCriteria")?.value || "",
            descripcion: document.getElementById("descripcionCriteria")?.value || "",
            precioMin: document.getElementById("precioMinCriteria")?.value ? Number(document.getElementById("precioMinCriteria").value) : null,
            precioMax: document.getElementById("precioMaxCriteria")?.value ? Number(document.getElementById("precioMaxCriteria").value) : null,
            stockMin: document.getElementById("stockMinCriteria")?.value ? Number(document.getElementById("stockMinCriteria").value) : null,
            stockMax: document.getElementById("stockMaxCriteria")?.value ? Number(document.getElementById("stockMaxCriteria").value) : null,
            nombreCategoria: document.getElementById("nombreCategoriaCriteria")?.value || "",
            nombreMarca: document.getElementById("nombreMarcaCriteria")?.value || "",
            nombreUnidadMedida: document.getElementById("nombreUnidadMedidaCriteria")?.value || "",
            page: this.currentPage - 1,
            size: this.itemsPerPage
        };

        try {
            const response = await ProductoService.findByProductosCriteria(criteria);
            console.log("Respuesta del servicio:", response);

            if (response && Array.isArray(response.page)) {
                this.previousResults = response.page;
                this.totalItems = response.totalElements || response.page.length;
                this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

                const startIndex = (this.currentPage - 1) * this.itemsPerPage;
                const endIndex = startIndex + this.itemsPerPage;
                const paginatedResults = this.previousResults.slice(startIndex, endIndex);

                ProductoView.renderResults(paginatedResults, "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems);
            } else {
                this.previousResults = [];
                this.totalItems = 0;
                this.totalPages = 0;
                ProductoView.renderResults([], "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems);
            }
        } catch (error) {
            console.error("Error al buscar productos:", error);
            this.previousResults = [];
            this.totalItems = 0;
            this.totalPages = 0;
            ProductoView.renderResults([], "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems);
        }
    },

    goToPage(page) {
        console.log(`ProductoController.goToPage(${page}) - Total páginas: ${this.totalPages}`);
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.handleSearch(page);
        }
    },

    async handleAddProducto(event) {
        event.preventDefault();
        if (!App.isEmpleado()) {
            alert("Solo los empleados pueden agregar productos.");
            return;
        }
        console.log("ProductoController.handleAddProducto()...");

        try {
            const nombre = document.getElementById("createNombre")?.value || "";
            const descripcion = document.getElementById("createDescripcion")?.value || "";
            const precio = parseFloat(document.getElementById("createPrecio")?.value) || 0;
            const stockDisponible = parseInt(document.getElementById("createStockDisponible")?.value) || 0;
            const nombreCategoria = document.getElementById("createIdCategoria")?.value || "";
            const nombreMarca = document.getElementById("createIdMarca")?.value || "";
            const nombreUnidadMedida = document.getElementById("createIdUnidadMedida")?.value || "";

            const categoriaMap = { "Electrónica": 1, "Ropa": 2, "Accesorios": 3, "Hogar": 4, "Deportes": 5, "Juguetes": 6, "Alimentación": 7, "Belleza": 8, "Libros": 9, "Muebles": 10 };
            const marcaMap = { "Samsung": 1, "Nike": 2, "Ray-Ban": 3, "Apple": 4, "Sony": 5, "Adidas": 6, "Puma": 7, "LG": 8, "Xiaomi": 9, "HP": 10, "Dell": 11, "Canon": 12, "Nestlé": 13, "L'Oréal": 14, "IKEA": 15 };
            const unidadMedidaMap = { "Unidad": 1, "Kilogramos": 2, "Litros": 3, "Gramos": 4, "Mililitros": 5, "Metros": 6, "Centímetros": 7, "Paquete": 8, "Caja": 9, "Docena": 10 };

            const idCategoria = categoriaMap[nombreCategoria];
            const idMarca = marcaMap[nombreMarca];
            const idUnidadMedida = unidadMedidaMap[nombreUnidadMedida];

            if (!nombre || precio <= 0 || stockDisponible <= 0 || !idCategoria || !idMarca || !idUnidadMedida) {
                throw new Error("Todos los campos son obligatorios y los valores numéricos deben ser mayores a 0.");
            }

            const productoData = { nombre, descripcion, precio, stockDisponible, idCategoria, idMarca, idUnidadMedida };
            console.log("Datos a enviar:", productoData);

            const response = await ProductoService.createProducto(productoData);
            console.log("Respuesta del servidor:", response);

            const message = "Producto agregado correctamente.";
            ProductoView.renderCompraSuccess(message);
            document.getElementById("createProductoForm").reset();
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            ProductoView.renderCompraError(error.message || "Error al agregar el producto.");
        }
    },

    async handleUpdateProducto(event) {
        event.preventDefault();
        if (!App.isEmpleado()) {
            alert("Solo los empleados pueden actualizar productos.");
            return;
        }
        console.log("ProductoController.handleUpdateProducto()...");

        try {
            const id = document.getElementById("updateId")?.value || "";
            const nombre = document.getElementById("updateNombre")?.value || "";
            const descripcion = document.getElementById("updateDescripcion")?.value || "";
            const precio = parseFloat(document.getElementById("updatePrecio")?.value) || 0;
            const stockDisponible = parseInt(document.getElementById("updateStockDisponible")?.value) || 0;
            const nombreCategoria = document.getElementById("updateIdCategoria")?.value || "";
            const nombreMarca = document.getElementById("updateIdMarca")?.value || "";
            const nombreUnidadMedida = document.getElementById("updateIdUnidadMedida")?.value || "";

            const categoriaMap = { "Electrónica": 1, "Ropa": 2, "Accesorios": 3, "Hogar": 4, "Deportes": 5, "Juguetes": 6, "Alimentación": 7, "Belleza": 8, "Libros": 9, "Muebles": 10 };
            const marcaMap = { "Samsung": 1, "Nike": 2, "Ray-Ban": 3, "Apple": 4, "Sony": 5, "Adidas": 6, "Puma": 7, "LG": 8, "Xiaomi": 9, "HP": 10, "Dell": 11, "Canon": 12, "Nestlé": 13, "L'Oréal": 14, "IKEA": 15 };
            const unidadMedidaMap = { "Unidad": 1, "Kilogramos": 2, "Litros": 3, "Gramos": 4, "Mililitros": 5, "Metros": 6, "Centímetros": 7, "Paquete": 8, "Caja": 9, "Docena": 10 };

            const idCategoria = categoriaMap[nombreCategoria];
            const idMarca = marcaMap[nombreMarca];
            const idUnidadMedida = unidadMedidaMap[nombreUnidadMedida];

            if (!nombre || precio <= 0 || stockDisponible <= 0 || !idCategoria || !idMarca || !idUnidadMedida) {
                throw new Error("Todos los campos son obligatorios y los valores numéricos deben ser mayores a 0.");
            }

            const productoData = { id, nombre, descripcion, precio, stockDisponible, idCategoria, idMarca, idUnidadMedida };
            console.log("Datos a actualizar:", productoData);

            const response = await ProductoService.updateProducto(productoData);
            console.log("Respuesta del servidor:", response);

            alert("✅ Producto actualizado exitosamente!");
            ProductoView.render("pro-inventario", "search");
            await this.handleSearch();
            this.setupEvents();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            alert("❌ Error al actualizar el producto: " + (error.message || "Inténtalo de nuevo."));
        }
    },

    async fetchProductoInfo(productId) {
        try {
            const producto = await ProductoService.findById(productId);
            if (!producto) {
                throw new Error("Producto no encontrado");
            }

            // Renderizar detalles, pero solo mostrar formulario de actualización para empleados
            ProductoView.renderProductoDetails(producto, "pro-inventario", App.isEmpleado());

            const updateForm = document.getElementById("updateProductoForm");
            if (updateForm && !updateForm.hasListener && App.isEmpleado()) {
                updateForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    this.handleUpdateProducto(event);
                });
                updateForm.hasListener = true;
            }
        } catch (error) {
            console.error("Error al obtener la información del producto:", error);
            alert("❌ Error al cargar los detalles del producto.");
            this.showPreviousResults();
        }
    },

    async handleDeleteProduct(productId) {
        if (!App.isEmpleado()) {
            alert("Solo los empleados pueden eliminar productos.");
            return;
        }
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            try {
                await ProductoService.deleteProducto(productId);
                alert("✅ Producto eliminado exitosamente!");
                await this.handleSearch(this.currentPage);
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("❌ Error al eliminar el producto. Inténtalo de nuevo.");
            }
        }
    }
};

export default ProductoController;