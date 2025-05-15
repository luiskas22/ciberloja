import ProductoView from "../views/productoView.js";
import ProductoService from "../services/productoService.js";
import FileService from "../services/fileService.js"; // Added for image handling
import App from "../app.js";
import Translations from '../resources/translations.js';

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
    currentLang: 'pt', // Idioma por defecto

    init(action, lang = 'pt') {
        console.log(`ProductoController.init(${action}, ${lang})...`);
        this.currentLang = lang;
        this.currentAction = action;

        if (action === "search") {
            this.loadProductoSearchForm();
        } else if (action === "create") {
            if (App.isEmpleado()) {
                this.loadProductoAddForm();
            } else {
                alert(Translations[lang].alerts.employeeOnlyCreate);
                this.loadProductoSearchForm();
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

        const updateForm = document.getElementById("updateProductoForm");
        if (updateForm && !updateForm.hasListener && App.isEmpleado()) {
            updateForm.addEventListener("submit", (event) => this.handleUpdateProducto(event));
            updateForm.hasListener = true;
        }

        const clearButton = document.getElementById("clearSearchForm");
        if (clearButton && !clearButton.hasListener) {
            clearButton.addEventListener("click", () => this.clearSearchForm());
            clearButton.hasListener = true;
        }

        const searchForm = document.getElementById("searchProductosForm");
        if (searchForm && !searchForm.hasListener) {
            searchForm.addEventListener("submit", (event) => {
                event.preventDefault();
                this.handleSearch();
            });
            searchForm.hasListener = true;
        }
    },

    clearSearchForm() {
        console.log("ProductoController.clearSearchForm()...");
        const form = document.getElementById("searchProductosForm");
        if (form) {
            form.reset();
            this.handleSearch();
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
        console.log("ProductoController.setupSearchInputs()...");
        const inputs = [
            "nombreCriteria",
            "precioMinCriteria",
            "precioMaxCriteria",
            "stockMinCriteria",
            "stockMaxCriteria",
            "empresaCriteria",
            "utilizadorCriteria",
            "passwordCriteria"
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
            ProductoView.render("pro-inventario", "search", this.currentLang);
            const inputs = [
                "nombreCriteria",
                "precioMinCriteria",
                "precioMaxCriteria",
                "stockMinCriteria",
                "stockMaxCriteria",
                "empresaCriteria",
                "utilizadorCriteria",
                "passwordCriteria"
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
            ProductoView.renderResults(this.previousResults, "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems, this.currentLang);
        } else {
            this.handleSearch();
        }
    },

    loadProductoSearchForm() {
        console.log("Cargando formulario de búsqueda de productos...");
        ProductoView.render("pro-inventario", "search", this.currentLang);
        this.setupEvents();
        this.handleSearch();
    },

    loadProductoAddForm() {
        console.log("Cargando formulario de creación de productos...");
        ProductoView.render("pro-inventario", "create", this.currentLang);
        this.setupEvents();
    },

    async handleSearch(page = 1) {
        console.log(`ProductoController.handleSearch(page: ${page})...`);
        this.currentPage = page;

        const filters = {
            nombre: document.getElementById("nombreCriteria")?.value || "",
            precioMin: parseFloat(document.getElementById("precioMinCriteria")?.value) || null,
            precioMax: parseFloat(document.getElementById("precioMaxCriteria")?.value) || null,
            stockMin: parseInt(document.getElementById("stockMinCriteria")?.value) || null,
            stockMax: parseInt(document.getElementById("stockMaxCriteria")?.value) || null
        };

        const credentials = {
            empresa: document.getElementById("empresaCriteria")?.value || "ciberloja",
            utilizador: document.getElementById("utilizadorCriteria")?.value || "website",
            password: document.getElementById("passwordCriteria")?.value || "Website2025*"
        };

        // Basic client-side validation
        if (filters.precioMin && filters.precioMax && filters.precioMin > filters.precioMax) {
            alert(Translations[this.currentLang].alerts.invalidPriceRange);
            return;
        }
        if (filters.stockMin && filters.stockMax && filters.stockMin > filters.stockMax) {
            alert(Translations[this.currentLang].alerts.invalidStockRange);
            return;
        }

        try {
            const response = await ProductoService.findByProductosSOAP(credentials, filters);
            console.log("Respuesta del servicio SOAP:", response);

            if (response && Array.isArray(response.page)) {
                this.previousResults = response.page;
                this.totalItems = response.total || response.page.length;
                this.totalPages = response.totalPages || Math.ceil(this.totalItems / this.itemsPerPage);

                // Fetch images for each product
                for (let producto of this.previousResults) {
                    try {
                        const images = await FileService.getImagesByProductoId(producto.id);
                        producto.images = images || [];
                    } catch (imageError) {
                        console.warn(`No se pudieron cargar las imágenes para el producto ${producto.id}:`, imageError);
                        producto.images = [];
                    }
                }

                ProductoView.renderResults(this.previousResults, "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems, this.currentLang);
            } else {
                this.previousResults = [];
                this.totalItems = 0;
                this.totalPages = 0;
                ProductoView.renderResults([], "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems, this.currentLang);
            }
        } catch (error) {
            console.error("Error al buscar productos SOAP:", error);
            this.previousResults = [];
            this.totalItems = 0;
            this.totalPages = 0;
            ProductoView.renderResults([], "pro-inventario", this.currentPage, this.itemsPerPage, this.totalItems, this.currentLang);
            alert(Translations[this.currentLang].alerts.loadProductError + (error.message || ""));
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
            alert(Translations[this.currentLang].alerts.employeeOnlyCreate);
            return;
        }
        console.log("ProductoController.handleAddProducto()...");

        try {
            const form = event.target;
            const formData = new FormData(form);

            const nombre = formData.get("createNombre") || "";
            const precio = parseFloat(formData.get("createPrecio")) || 0;
            const stockDisponible = parseInt(formData.get("createStockDisponible")) || 0;
            const familia = formData.get("createFamilia") || "";
            const productImage = formData.get("createProductImage");

            console.log("Form values:", {
                nombre,
                precio,
                stockDisponible,
                familia,
                productImage: productImage ? productImage.name : "No file"
            });

            if (!nombre || precio <= 0 || stockDisponible <= 0 || !familia) {
                throw new Error(Translations[this.currentLang].alerts.invalidFields);
            }

            // Create product data without the image
            const productoData = {
                nombre,
                precio,
                stockDisponible,
                familia
            };

            // Create product via SOAP service
            const response = await ProductoService.createProducto(productoData);

            // Upload image if provided
            if (productImage && productImage.size > 0) {
                await FileService.uploadImageToProducto(response.id, productImage);
            }

            const message = Translations[this.currentLang].alerts.productAdded;
            ProductoView.renderCompraSuccess(message, this.currentLang);
            form.reset();
            this.loadProductoSearchForm();
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            ProductoView.renderCompraError(error.message || Translations[this.currentLang].alerts.addProductError, this.currentLang);
        }
    },

	async handleUpdateProducto(event) {
	    event.preventDefault();
	    if (!App.isEmpleado()) {
	        alert(Translations[this.currentLang].alerts.employeeOnlyUpdate);
	        return;
	    }
	    console.log("ProductoController.handleUpdateProducto()...");

	    try {
	        const form = event.target;
	        const formData = new FormData(form);

	        const id = formData.get("updateId") || "";
	        const productImage = formData.get("productImage");

	        console.log("Form values:", {
	            id,
	            productImage: productImage ? productImage.name : "No file"
	        });

	        if (!id) {
	            throw new Error(Translations[this.currentLang].alerts.invalidFields);
	        }

	        // Upload image if provided
	        if (productImage && productImage.size > 0) {
	            await FileService.uploadImageToProducto(id, productImage);
	        } else {
	            throw new Error(Translations[this.currentLang].alerts.noImageProvided || "Nenhuma imagem fornecida");
	        }

	        // Refresh product details to show the new image
	        await this.fetchProductoInfo(id);
	        alert(Translations[this.currentLang].alerts.productUpdated);
	    } catch (error) {
	        console.error("Error al actualizar el producto:", error);
	        alert(Translations[this.currentLang].alerts.updateProductError + (error.message || ""));
	    }
	},

    async fetchProductoInfo(productId) {
        const credentials = {
            empresa: document.getElementById("empresaCriteria")?.value || "ciberloja",
            utilizador: document.getElementById("utilizadorCriteria")?.value || "website",
            password: document.getElementById("passwordCriteria")?.value || "Website2025*"
        };

        try {
            const producto = await ProductoService.findByIdSOAP(credentials, productId);
            if (!producto) {
                throw new Error(Translations[this.currentLang].alerts.productNotFound);
            }

            // Fetch images for the product
            try {
                const images = await FileService.getImagesByProductoId(productId);
                producto.images = images || [];
            } catch (imageError) {
                console.warn(`No se pudieron cargar las imágenes para el producto ${productId}:`, imageError);
                producto.images = [];
            }

            ProductoView.renderProductoDetails(producto, "pro-inventario", App.isEmpleado(), this.currentLang);

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
            alert(Translations[this.currentLang].alerts.loadProductError);
            this.showPreviousResults();
        }
    },

    async handleDeleteProduct(productId) {
        if (!App.isEmpleado()) {
            alert(Translations[this.currentLang].alerts.employeeOnlyDelete);
            return;
        }
        if (confirm(Translations[this.currentLang].alerts.confirmDelete)) {
            try {
                await ProductoService.deleteProducto(productId);
                alert(Translations[this.currentLang].alerts.productDeleted);
                await this.handleSearch(this.currentPage);
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert(Translations[this.currentLang].alerts.deleteProductError);
            }
        }
    }
};

export default ProductoController;