import App from "../app.js";
import Translations  from '../resources/translations.js';
const ProductoView = {
	getSearchForm(lang = 'pt') {
    const t = Translations[lang].productos.search;
    const isEmpleado = App.isEmpleado(); // Verificamos si el usuario es empleado
    
    return `
      <div class="main-content">
        <div class="productos-container">
          <div class="row">
            <!-- Barra lateral con el formulario -->
            <aside class="col-lg-3 col-md-4 sidebar">
              <div class="sidebar-sticky">
                <div class="product-search-header">
                  <h2 data-i18n="productos.search.title">${t.title}</h2>
                  <form id="searchProductosForm">
                    <div class="search-form-grid">
                      ${isEmpleado ? `
                      <div class="form-group">
                        <label for="id" class="form-label" data-i18n="productos.search.id">${t.id}</label>
                        <input type="text" id="idCriteria" class="form-control" placeholder="${t.idPlaceholder}">
                      </div>
                      ` : ''}
                      <div class="form-group">
                        <label for="nombre" class="form-label" data-i18n="productos.search.name">${t.name}</label>
                        <input type="text" id="nombreCriteria" class="form-control" placeholder="${t.namePlaceholder}">
                      </div>
                      <div class="form-group">
                        <label for="descripcion" class="form-label" data-i18n="productos.search.description">${t.description}</label>
                        <input type="text" id="descripcionCriteria" class="form-control" placeholder="${t.descriptionPlaceholder}">
                      </div>
                      <div class="form-group">
                        <label for="precioMin" class="form-label" data-i18n="productos.search.priceMin">${t.priceMin}</label>
                        <div class="input-group">
                          <span class="input-group-text">€</span>
                          <input type="number" step="0.01" id="precioMinCriteria" class="form-control" placeholder="${t.priceMinPlaceholder}">
                        </div>
                      </div>
                      <div class="form-group">
                        <label for="precioMax" class="form-label" data-i18n="productos.search.priceMax">${t.priceMax}</label>
                        <div class="input-group">
                          <span class="input-group-text">€</span>
                          <input type="number" step="0.01" id="precioMaxCriteria" class="form-control" placeholder="${t.priceMaxPlaceholder}">
                        </div>
                      </div>
                      ${isEmpleado ? `
                      <div class="form-group">
                        <label for="stockMin" class="form-label" data-i18n="productos.search.stockMin">${t.stockMin}</label>
                        <input type="number" id="stockMinCriteria" class="form-control" placeholder="${t.stockMinPlaceholder}">
                      </div>
                      <div class="form-group">
                        <label for="stockMax" class="form-label" data-i18n="productos.search.stockMax">${t.stockMax}</label>
                        <input type="number" id="stockMaxCriteria" class="form-control" placeholder="${t.stockMaxPlaceholder}">
                      </div>
                      ` : ''}
                      <div class="form-group">
                        <label for="nombreCategoria" class="form-label" data-i18n="productos.search.category">${t.category}</label>
                        <select id="nombreCategoriaCriteria" class="form-control">
                          <option value="" selected data-i18n="productos.search.allCategories">${t.allCategories}</option>
                          <option value="Electrónica">Electrónica</option>
                          <option value="Ropa">Ropa</option>
                          <option value="Accesorios">Accesorios</option>
                          <option value="Hogar">Hogar</option>
                          <option value="Deportes">Deportes</option>
                          <option value="Juguetes">Juguetes</option>
                          <option value="Alimentación">Alimentación</option>
                          <option value="Belleza">Belleza</option>
                          <option value="Libros">Libros</option>
                          <option value="Muebles">Muebles</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="nombreMarca" class="form-label" data-i18n="productos.search.brand">${t.brand}</label>
                        <select id="nombreMarcaCriteria" class="form-control">
                          <option value="" selected data-i18n="productos.search.allBrands">${t.allBrands}</option>
                          <option value="Samsung">Samsung</option>
                          <option value="Nike">Nike</option>
                          <option value="Ray-Ban">Ray-Ban</option>
                          <option value="Apple">Apple</option>
                          <option value="Sony">Sony</option>
                          <option value="Adidas">Adidas</option>
                          <option value="Puma">Puma</option>
                          <option value="LG">LG</option>
                          <option value="Xiaomi">Xiaomi</option>
                          <option value="HP">HP</option>
                          <option value="Dell">Dell</option>
                          <option value="Canon">Canon</option>
                          <option value="Nestlé">Nestlé</option>
                          <option value="L'Oréal">L'Oréal</option>
                          <option value="IKEA">IKEA</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="nombreUnidadMedida" class="form-label" data-i18n="productos.search.unit">${t.unit}</label>
                        <select id="nombreUnidadMedidaCriteria" class="form-control">
                          <option value="" selected data-i18n="productos.search.allUnits">${t.allUnits}</option>
                          <option value="Unidad">Unidad</option>
                          <option value="Kilogramos">Kilogramos</option>
                          <option value="Litros">Litros</option>
                          <option value="Gramos">Gramos</option>
                          <option value="Mililitros">Mililitros</option>
                          <option value="Metros">Metros</option>
                          <option value="Centímetros">Centímetros</option>
                          <option value="Paquete">Paquete</option>
                          <option value="Caja">Caja</option>
                          <option value="Docena">Docena</option>
                        </select>
                      </div>
                    </div>
                    <div class="text-center mt-3">
                      <button type="submit" class="btn btn-primary px-4" data-i18n="productos.search.searchBtn">
                        <i class="bi bi-search me-2"></i>${t.searchBtn}
                      </button>
                      <button type="button" id="clearSearchForm" class="btn btn-secondary px-4 mt-2" data-i18n="productos.search.clearBtn">
                        <i class="bi bi-x-circle me-2"></i>${t.clearBtn}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </aside>
            <!-- Contenido principal (resultados de búsqueda) -->
            <main class="col-lg-9 col-md-8">
              <div id="searchResults" class="mt-4">
                <p data-i18n="productos.search.resultsPlaceholder">${t.resultsPlaceholder}</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    `;
  },
  
	getCreateForm(lang = 'pt') {
    const t = Translations[lang].productos.create;
    return `
      <div class="productos-container">
        <div class="product-form-container shadow-lg">
          <h2 class="product-form-title" data-i18n="productos.create.title">
            <i class="fas fa-box-open me-2"></i>${t.title}
          </h2>
          <form id="createProductoForm" novalidate>
            <div class="form-section mb-4">
              <h3 class="form-section-title" data-i18n="productos.create.basicInfo">
                <i class="fas fa-info-circle me-1"></i>${t.basicInfo}
              </h3>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="createNombre" class="form-label" data-i18n="productos.create.name">${t.name}</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-tag"></i></span>
                    <input type="text" id="createNombre" name="createNombre" class="form-control" placeholder="${t.namePlaceholder}" required>
                    <div class="invalid-feedback">${t.nameRequired || 'Nome é obrigatório'}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="createDescripcion" class="form-label" data-i18n="productos.create.description">${t.description}</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-align-left"></i></span>
                    <textarea id="createDescripcion" name="createDescripcion" class="form-control" placeholder="${t.descriptionPlaceholder}" rows="3"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-section mb-4">
              <h3 class="form-section-title" data-i18n="productos.create.priceInventory">
                <i class="fas fa-euro-sign me-1"></i>${t.priceInventory}
              </h3>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="createPrecio" class="form-label" data-i18n="productos.create.price">${t.price}</label>
                  <div class="input-group">
                    <span class="input-group-text">€</span>
                    <input type="number" step="0.01" min="0" id="createPrecio" name="createPrecio" class="form-control" placeholder="${t.pricePlaceholder}" required>
                    <div class="invalid-feedback">${t.priceRequired || 'Preço é obrigatório'}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="createStockDisponible" class="form-label" data-i18n="productos.create.stock">${t.stock}</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-warehouse"></i></span>
                    <input type="number" min="0" id="createStockDisponible" name="createStockDisponible" class="form-control" placeholder="${t.stockPlaceholder}" required>
                    <div class="invalid-feedback">${t.stockRequired || 'Estoque é obrigatório'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-section mb-4">
              <h3 class="form-section-title" data-i18n="productos.create.classification">
                <i class="fas fa-sitemap me-1"></i>${t.classification}
              </h3>
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="createIdCategoria" class="form-label" data-i18n="productos.create.category">${t.category}</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-folder"></i></span>
                    <select id="createIdCategoria" name="createIdCategoria" class="form-select" required>
                      <option value="" disabled selected data-i18n="productos.create.selectCategory">${t.selectCategory}</option>
                      <option value="Electrónica">Electrónica</option>
                      <option value="Ropa">Ropa</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Hogar">Hogar</option>
                      <option value="Deportes">Deportes</option>
                      <option value="Juguetes">Juguetes</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Belleza">Belleza</option>
                      <option value="Libros">Libros</option>
                      <option value="Muebles">Muebles</option>
                    </select>
                    <div class="invalid-feedback">${t.categoryRequired || 'Categoria é obrigatória'}</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="createIdMarca" class="form-label" data-i18n="productos.create.brand">${t.brand}</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-copyright"></i></span>
                    <select id="createIdMarca" name="createIdMarca" class="form-select" required>
                      <option value="" disabled selected data-i18n="productos.create.selectBrand">${t.selectBrand}</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Nike">Nike</option>
                      <option value="Ray-Ban">Ray-Ban</option>
                      <option value="Apple">Apple</option>
                      <option value="Sony">Sony</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Puma">Puma</option>
                      <option value="LG">LG</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="HP">HP</option>
                      <option value="Dell">Dell</option>
                      <option value="Canon">Canon</option>
                      <option value="Nestlé">Nestlé</option>
                      <option value="L'Oréal">L'Oréal</option>
                      <option value="IKEA">IKEA</option>
                    </select>
                    <div class="invalid-feedback">${t.brandRequired || 'Marca é obrigatória'}</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="createIdUnidadMedida" class="form-label" data-i18n="productos.create.unit">${t.unit}</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-ruler"></i></span>
                    <select id="createIdUnidadMedida" name="createIdUnidadMedida" class="form-select" required>
                      <option value="" disabled selected data-i18n="productos.create.selectUnit">${t.selectUnit}</option>
                      <option value="Unidad">Unidad</option>
                      <option value="Kilogramos">Kilogramos</option>
                      <option value="Litros">Litros</option>
                      <option value="Gramos">Gramos</option>
                      <option value="Mililitros">Mililitros</option>
                      <option value="Metros">Metros</option>
                      <option value="Centímetros">Centímetros</option>
                      <option value="Paquete">Paquete</option>
                      <option value="Caja">Caja</option>
                      <option value="Docena">Docena</option>
                    </select>
                    <div class="invalid-feedback">${t.unitRequired || 'Unidade é obrigatória'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-section mb-4">
              <h3 class="form-section-title" data-i18n="productos.create.images">
                <i class="fas fa-image me-1"></i>${t.images}
              </h3>
              <div class="mb-3">
                <label for="productImage" class="form-label" data-i18n="productos.create.uploadImage">${t.uploadImage}</label>
                <input class="form-control" type="file" id="productImage" name="productImage" accept="image/*">
                <div class="form-text" data-i18n="productos.create.imageFormats">${t.imageFormats}</div>
                <div id="imagePreview" class="mt-3 d-none">
                  <img src="" alt="Pré-visualização da imagem" class="img-fluid rounded" style="max-height: 150px;">
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button type="submit" class="btn btn-success px-5 py-2" data-i18n="productos.create.saveBtn">
                <i class="fas fa-check-circle me-2"></i>${t.saveBtn}
                <span class="spinner-border spinner-border-sm ms-2 d-none" role="status" aria-hidden="true"></span>
              </button>
            </div>
          </form>
          <div id="createResults" class="mt-4"></div>
        </div>
      </div>
    `;
},

	render(containerId, type, lang = 'pt') {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			return;
		}
		container.innerHTML = '';
		if (type === "search") {
			container.innerHTML = this.getSearchForm(lang);
		} else if (type === "create") {
			container.innerHTML = this.getCreateForm(lang);
		}
	},

	renderProductoDetails(producto, containerId = "pro-inventario", isEmpleado = false, lang = 'pt') {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			returT;
		}

		const t = Translations[lang].productos.details;
		container.innerHTML = '';
		const isLoggedIn = App.cliente !== null;
		const stockStatus = producto.stockDisponible > 10 ? 'stock-available' :
			producto.stockDisponible > 0 ? 'stock-low' : 'stock-unavailable';
		const stockText = producto.stockDisponible > 10 ? t.stockAvailable :
			producto.stockDisponible > 0 ? t.stockLow : t.stockOut;

		const nombre = producto.nombre || 'N/A';
		const nombreCategoria = producto.nombreCategoria || t.noCategory;
		const nombreMarca = producto.nombreMarca || t.noBrand;
		const descripcion = producto.descripcion || t.noDescription;
		const precio = producto.precio ? Number(producto.precio).toFixed(2) + ' €' : 'N/A';
		const stockDisponible = producto.stockDisponible || 0;

		let productoDetails = `
      <div class="product-detail-container">
        <div class="product-detail-card">
          <div class="row g-0">
            <div class="col-md-6">
              <div class="product-detail-image-container">
                ${producto.images && producto.images.length > 0 ? `
                  <img src="http://192.168.99.40:8080${producto.images[0].url}" 
                       alt="${nombre}" 
                       class="product-detail-image"
                       onerror="this.onerror=null; this.src='./img/placeholder.png'; console.error('Error loading image: ${producto.images[0].url}');">
                ` : `
                  <img src="./img/placeholder.png" 
                       alt="${nombre}" 
                       class="product-detail-image">
                `}
              </div>
            </div>
            <div class="col-md-6">
              <div class="product-detail-info">
                <h1 class="product-detail-title">${nombre}</h1>
                <div class="product-detail-meta">
                  <span class="product-detail-category">${nombreCategoria}</span>
                  <span class="product-detail-brand">${nombreMarca}</span>
                </div>
                ${isLoggedIn ? `
                  <div class="product-detail-price">${precio}</div>
                  <div class="product-detail-stock ${stockStatus}" data-i18n="productos.details.stockText">
                    <i class="bi bi-box-seam me-2"></i>${stockText} | ${stockDisponible} ${t.inStock}
                  </div>
                ` : `
                  <div class="product-detail-price text-muted" data-i18n="productos.details.loginPrice">${t.loginPrice}</div>
                  <div class="product-detail-stock text-muted" data-i18n="productos.details.loginStock">${t.loginStock}</div>
                `}
                <p class="product-detail-description">${descripcion}</p>
    `;

		if (isEmpleado) {
			productoDetails += `
        <form id="updateProductoForm" enctype="multipart/form-data">
          <input type="hidden" id="updateId" name="updateId" value="${producto.id || ''}">
          <div class="form-section">
            <h3 class="form-section-title" data-i18n="productos.details.editTitle">${t.editTitle}</h3>
            <div class="row g-3">
              <div class="col-md-6">
                <label for="updateNombre" class="form-label" data-i18n="productos.details.name">${t.name}</label>
                <input type="text" id="updateNombre" name="updateNombre" class="form-control" value="${nombre}" required>
              </div>
              <div class="col-md-6">
                <label for="updateDescripcion" class="form-label" data-i18n="productos.details.description">${t.description}</label>
                <input type="text" id="updateDescripcion" name="updateDescripcion" class="form-control" value="${descripcion}">
              </div>
              <div class="col-md-6">
                <label for="updatePrecio" class="form-label" data-i18n="productos.details.price">${t.price}</label>
                <div class="input-group">
                  <span class="input-group-text">€</span>
                  <input type="number" step="0.01" id="updatePrecio" name="updatePrecio" class="form-control" value="${producto.precio || 0}" required>
                </div>
              </div>
              <div class="col-md-6">
                <label for="updateStockDisponible" class="form-label" data-i18n="productos.details.stock">${t.stock}</label>
                <input type="number" id="updateStockDisponible" name="updateStockDisponible" class="form-control" value="${stockDisponible}" required>
              </div>
              <div class="col-md-4">
                <label for="updateIdCategoria" class="form-label" data-i18n="productos.details.category">${t.category}</label>
                <select id="updateIdCategoria" name="updateIdCategoria" class="form-control" required>
                  <option value="${nombreCategoria}" selected>${nombreCategoria}</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Juguetes">Juguetes</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Belleza">Belleza</option>
                  <option value="Libros">Libros</option>
                  <option value="Muebles">Muebles</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="updateIdMarca" class="form-label" data-i18n="productos.details.brand">${t.brand}</label>
                <select id="updateIdMarca" name="updateIdMarca" class="form-control" required>
                  <option value="${nombreMarca}" selected>${nombreMarca}</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Nike">Nike</option>
                  <option value="Ray-Ban">Ray-Ban</option>
                  <option value="Apple">Apple</option>
                  <option value="Sony">Sony</option>
                  <option value="Adidas">Adidas</option>
                  <option value="Puma">Puma</option>
                  <option value="LG">LG</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="HP">HP</option>
                  <option value="Dell">Dell</option>
                  <option value="Canon">Canon</option>
                  <option value="Nestlé">Nestlé</option>
                  <option value="L'Oréal">L'Oréal</option>
                  <option value="IKEA">IKEA</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="updateIdUnidadMedida" class="form-label" data-i18n="productos.details.unit">${t.unit}</label>
                <select id="updateIdUnidadMedida" name="updateIdUnidadMedida" class="form-control" required>
                  <option value="${producto.nombreUnidadMedida || 'Unidad'}" selected>${producto.nombreUnidadMedida || 'Unidad'}</option>
                  <option value="Unidad">Unidad</option>
                  <option value="Kilogramos">Kilogramos</option>
                  <option value="Litros">Litros</option>
                  <option value="Gramos">Gramos</option>
                  <option value="Mililitros">Mililitros</option>
                  <option value="Metros">Metros</option>
                  <option value="Centímetros">Centímetros</option>
                  <option value="Paquete">Paquete</option>
                  <option value="Caja">Caja</option>
                  <option value="Docena">Docena</option>
                </select>
              </div>
              <div class="col-md-12">
                <label for="productImage" class="form-label" data-i18n="productos.details.updateImage">${t.updateImage}</label>
                <input class="form-control" type="file" id="productImage" name="productImage" accept="image/*">
                <div class="form-text" data-i18n="productos.details.imageFormats">${t.imageFormats}</div>
              </div>
            </div>
          </div>
          <div class="product-detail-actions">
            <button type="button" id="backToResultsBtn" class="btn btn-outline-secondary" data-i18n="productos.details.backBtn">
              <i class="bi bi-arrow-left me-2"></i>${t.backBtn}
            </button>
            <button type="submit" class="btn btn-primary" data-i18n="productos.details.saveBtn">
              <i class="bi bi-save me-2"></i>${t.saveBtn}
            </button>
            <button type="button" id="deleteProduct" class="btn btn-danger" data-id="${producto.id || ''}" data-i18n="productos.details.deleteBtn">
              <i class="bi bi-trash me-2"></i>${t.deleteBtn}
            </button>
          </div>
        </form>
      `;
		} else {
			productoDetails += `
        <div class="product-detail-actions">
          <button type="button" id="backToResultsBtn" class="btn btn-outline-secondary" data-i18n="productos.details.backBtn">
            <i class="bi bi-arrow-left me-2"></i>${t.backBtn}
          </button>
          ${isLoggedIn ? `
            <button type="button" id="addToCartBtn" class="btn btn-success" 
                    data-id="${producto.id || ''}" 
                    data-nombre="${nombre}" 
                    data-precio="${producto.precio || 0}"
                    ${stockDisponible <= 0 ? 'disabled' : ''} 
                    data-i18n="productos.details.addToCartBtn">
              <i class="bi bi-cart-plus me-2"></i>${t.addToCartBtn}
            </button>
          ` : ''}
        </div>
      `;
		}

		productoDetails += `
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

		container.innerHTML = productoDetails;
	},

	renderResults(productos, containerId = "pro-inventario", currentPage = 1, itemsPerPage = 10, totalItems = 0, lang = 'pt') {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			returT;
		}

		const t = Translations[lang].productos.results;
		if (!document.getElementById('searchResults')) {
			container.innerHTML = this.getSearchForm(lang);
		}

		const resultsContainer = document.getElementById('searchResults');
		if (!resultsContainer) {
			console.error("No se encontró el contenedor de resultados con ID: searchResults");
			return;
		}

		resultsContainer.innerHTML = '';

		if (!Array.isArray(productos) || productos.length === 0) {
			resultsContainer.innerHTML = `
        <div class="alert alert-info text-center" data-i18n="productos.results.noResults">
          <i class="bi bi-info-circle me-2"></i>${t.noResults}
        </div>
      `;
			return;
		}

		const isLoggedIn = App.cliente !== null;
		let resultsHtml = '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">';

		productos.forEach(producto => {
			const stockStatus = producto.stockDisponible > 10 ? 'in-stock' :
				producto.stockDisponible > 0 ? 'low-stock' : 'out-of-stock';
			const nombre = producto.nombre || 'N/A';
			const nombreCategoria = producto.nombreCategoria || t.noCategory;
			const precio = producto.precio ? Number(producto.precio).toFixed(2) + ' €' : 'N/A';
			const stockDisponible = producto.stockDisponible || 0;

			resultsHtml += `
        <div class="col">
          <div class="product-card h-100">
            <div class="product-image-container">
              ${producto.images && producto.images.length > 0 ? `
                <img src="http://192.168.99.40:8080${producto.images[0].url}" 
                     alt="${nombre}" 
                     class="product-image"
                     onerror="this.onerror=null; this.src='./img/placeholder.png'; console.error('Error loading image: ${producto.images[0].url}');">
              ` : `
                <img src="./img/placeholder.png" 
                     alt="${nombre}" 
                     class="product-image">
              `}
              ${stockDisponible <= 0 && isLoggedIn ? `<span class="product-badge" data-i18n="productos.results.outOfStock">${t.outOfStock}</span>` : ''}
            </div>
            <div class="product-info">
              <h3 class="product-title">${nombre}</h3>
              <p class="product-category mb-1">
                <i class="bi bi-tag me-1"></i>${nombreCategoria}
              </p>
              ${isLoggedIn ? `
                <div class="product-price">${precio}</div>
                <p class="product-stock ${stockStatus}">
                  <i class="bi bi-box-seam me-1"></i>${stockDisponible} ${t.available}
                </p>
              ` : `
                <div class="product-price text-muted" data-i18n="productos.results.loginPrice">${t.loginPrice}</div>
                <p class="product-stock text-muted" data-i18n="productos.results.loginStock">${t.loginStock}</p>
              `}
              <div class="product-actions">
                <button class="btn btn-view-details product-link" data-id="${producto.id || ''}" data-i18n="productos.results.viewDetailsBtn">
                  <i class="bi bi-eye me-1"></i>${t.viewDetailsBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
		});

		resultsHtml += '</div>';

		const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
		if (totalItems > 0) {
			resultsHtml += this.getPaginationHtml(currentPage, totalPages, totalItems, lang);
		}

		resultsContainer.innerHTML = resultsHtml;
	},

	getPaginationHtml(currentPage, totalPages, totalItems, lang = 'pt') {
		const t = Translations[lang].productos.pagination;
		if (totalPages <= 1) return '';

		let paginationHtml = `
      <nav aria-label="${t.ariaLabel}" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item ${currentPage <= 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="${t.previous}">
              <span aria-hidden="true">«</span> ${t.previous}
            </a>
          </li>`;

		const maxPagesToShow = 5;
		let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		if (endPage - startPage + 1 < maxPagesToShow) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		if (startPage > 1) {
			paginationHtml += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="1">1</a>
        </li>`;
			if (startPage > 2) {
				paginationHtml += `
          <li class="page-item disabled">
            <span class="page-link">...</span>
          </li>`;
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			paginationHtml += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				paginationHtml += `
          <li class="page-item disabled">
            <span class="page-link">...</span>
          </li>`;
			}
			paginationHtml += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
        </li>`;
		}

		paginationHtml += `
          <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="${t.next}">
              ${t.next} <span aria-hidden="true">»</span>
            </a>
          </li>
        </ul>`;

		const firstItem = Math.min(totalItems, (currentPage - 1) * 10 + 1);
		const lastItem = Math.min(totalItems, currentPage * 10);

		paginationHtml += `
        <p class="text-center mt-2" data-i18n="productos.pagination.showing">
          ${t.showing.replace('{first}', firstItem).replace('{last}', lastItem).replace('{total}', totalItems)}
        </p>
      </nav>`;

		return paginationHtml;
	},

	getProductImageSrc(productId) {
		if (!productId) {
			return './img/placeholder.png';
		}
		return `./img/${productId}.jpg`;
	},

	renderCompraSuccess(message, lang = 'pt') {
		const resultsContainer = document.getElementById("createResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
        <div class="alert alert-success" role="alert">
          ${message}
        </div>
      `;
		}
	},

	renderCompraError(message, lang = 'pt') {
		const resultsContainer = document.getElementById("createResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${message}
        </div>
      `;
		}
	},
};

export default ProductoView;