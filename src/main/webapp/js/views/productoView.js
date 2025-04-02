import App from "../app.js"; // Importar App para acceder al estado de sesión

const ProductoView = {
	getSearchForm() {
		return `
	    <div class="main-content">
	      <div class="productos-container">
	        <div class="row">
	          <!-- Barra lateral con el formulario -->
	          <aside class="col-lg-3 col-md-4 sidebar">
	            <div class="sidebar-sticky">
	              <div class="product-search-header">
	                <h2>Filtrar Productos</h2>
	                <form id="searchProductosForm">
	                  <div class="search-form-grid">
	                    <div class="form-group">
	                      <label for="id" class="form-label">ID:</label>
	                      <input type="text" id="idCriteria" class="form-control" placeholder="ID del producto">
	                    </div>
	                    <div class="form-group">
	                      <label for="nombre" class="form-label">Nombre:</label>
	                      <input type="text" id="nombreCriteria" class="form-control" placeholder="Nombre del producto">
	                    </div>
	                    <div class="form-group">
	                      <label for="descripcion" class="form-label">Descripción:</label>
	                      <input type="text" id="descripcionCriteria" class="form-control" placeholder="Palabras clave">
	                    </div>
	                    <div class="form-group">
	                      <label for="precioMin" class="form-label">Precio Mínimo:</label>
	                      <div class="input-group">
	                        <span class="input-group-text">€</span>
	                        <input type="number" step="0.01" id="precioMinCriteria" class="form-control" placeholder="Mínimo">
	                      </div>
	                    </div>
	                    <div class="form-group">
	                      <label for="precioMax" class="form-label">Precio Máximo:</label>
	                      <div class="input-group">
	                        <span class="input-group-text">€</span>
	                        <input type="number" step="0.01" id="precioMaxCriteria" class="form-control" placeholder="Máximo">
	                      </div>
	                    </div>
	                    <div class="form-group">
	                      <label for="stockMin" class="form-label">Stock Mínimo:</label>
	                      <input type="number" id="stockMinCriteria" class="form-control" placeholder="Mínimo">
	                    </div>
	                    <div class="form-group">
	                      <label for="stockMax" class="form-label">Stock Máximo:</label>
	                      <input type="number" id="stockMaxCriteria" class="form-control" placeholder="Máximo">
	                    </div>
	                    <div class="form-group">
	                      <label for="nombreCategoria" class="form-label">Categoría:</label>
	                      <select id="nombreCategoriaCriteria" class="form-control">
	                        <option value="" selected>Todas las categorías</option>
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
	                      <label for="nombreMarca" class="form-label">Marca:</label>
	                      <select id="nombreMarcaCriteria" class="form-control">
	                        <option value="" selected>Todas las marcas</option>
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
	                      <label for="nombreUnidadMedida" class="form-label">Unidad de Medida:</label>
	                      <select id="nombreUnidadMedidaCriteria" class="form-control">
	                        <option value="" selected>Todas las unidades</option>
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
	                    <button type="submit" class="btn btn-primary px-4">
	                      <i class="bi bi-search me-2"></i>Buscar
	                    </button>
	                    <button type="button" id="clearSearchForm" class="btn btn-secondary px-4 mt-2">
	                      <i class="bi bi-x-circle me-2"></i>Limpiar
	                    </button>
	                  </div>
	                </form>
	              </div>
	            </div>
	          </aside>

	          <!-- Contenido principal (resultados de búsqueda) -->
	          <main class="col-lg-9 col-md-8">
	            <div id="searchResults" class="mt-4">
	              <!-- Aquí irían los resultados de la búsqueda -->
	              <p>Resultados de la búsqueda aparecerán aquí...</p>
	            </div>
	          </main>
	        </div>
	      </div>
	    </div>
	    `;
	},

	getCreateForm() {
		return `
      <div class="productos-container">
        <div class="product-form-container">
          <h2 class="product-form-title">Añadir Nuevo Producto</h2>
          <form id="createProductoForm">
            <div class="form-section">
              <h3 class="form-section-title">Información Básica</h3>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="createNombre" class="form-label">Nombre del Producto</label>
                  <input type="text" id="createNombre" class="form-control" placeholder="Ej: Smartphone X Pro" required>
                </div>
                <div class="col-md-6">
                  <label for="createDescripcion" class="form-label">Descripción</label>
                  <input type="text" id="createDescripcion" class="form-control" placeholder="Breve descripción del producto">
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3 class="form-section-title">Precio e Inventario</h3>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="createPrecio" class="form-label">Precio</label>
                  <div class="input-group">
                    <span class="input-group-text">€</span>
                    <input type="number" step="0.01" id="createPrecio" class="form-control" placeholder="0.00" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="createStockDisponible" class="form-label">Stock Disponible</label>
                  <input type="number" id="createStockDisponible" class="form-control" placeholder="Cantidad en inventario" required>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3 class="form-section-title">Clasificación</h3>
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="createIdCategoria" class="form-label">Categoría</label>
                  <select id="createIdCategoria" class="form-control" required>
                    <option value="" disabled selected>Seleccione categoría</option>
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
                  <label for="createIdMarca" class="form-label">Marca</label>
                  <select id="createIdMarca" class="form-control" required>
                    <option value="" disabled selected>Seleccione marca</option>
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
                  <label for="createIdUnidadMedida" class="form-label">Unidad de Medida</label>
                  <select id="createIdUnidadMedida" class="form-control" required>
                    <option value="" disabled selected>Seleccione unidad</option>
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
            </div>
            
            <div class="form-section">
              <h3 class="form-section-title">Imágenes del Producto</h3>
              <div class="mb-3">
                <label for="productImage" class="form-label">Subir Imagen</label>
                <input class="form-control" type="file" id="productImage">
                <div class="form-text">Formatos soportados: JPG, PNG. Tamaño máximo: 5MB</div>
              </div>
            </div>
            
            <div class="text-center mt-4">
              <button type="submit" class="btn btn-success px-4 py-2">
                <i class="bi bi-check-circle me-2"></i>Guardar Producto
              </button>
            </div>
          </form>
          <div id="createResults" class="mt-4"></div>
        </div>
      </div>
    `;
	},

	render(containerId, type) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			return;
		}
		container.innerHTML = '';
		if (type === "search") {
			container.innerHTML = this.getSearchForm();
		} else if (type === "create") {
			container.innerHTML = this.getCreateForm();
		}
	},

	renderProductoDetails(producto, containerId = "pro-inventario", isEmpleado = false) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			return;
		}

		container.innerHTML = '';

		const imageSrc = this.getProductImageSrc(producto.id);
		const stockStatus = producto.stockDisponible > 10 ? 'stock-available' :
			producto.stockDisponible > 0 ? 'stock-low' : 'stock-unavailable';
		const stockText = producto.stockDisponible > 10 ? 'Disponible' :
			producto.stockDisponible > 0 ? 'Últimas unidades' : 'Agotado';
		const isLoggedIn = App.cliente !== null; // Verificar si hay sesión activa

		let productoDetails = `
            <div class="product-detail-container">
                <div class="product-detail-card">
                    <div class="row g-0">
                        <div class="col-md-6">
                            <div class="product-detail-image-container">
                                <img src="${imageSrc}" alt="${producto.nombre}" class="product-detail-image" 
                                     onerror="this.onerror=null; this.src='./img/placeholder.png';">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="product-detail-info">
                                <h1 class="product-detail-title">${producto.nombre || 'N/A'}</h1>
                                <div class="product-detail-meta">
                                    <span class="product-detail-category">${producto.nombreCategoria || 'Sin categoría'}</span>
                                    <span class="product-detail-brand">${producto.nombreMarca || 'Sin marca'}</span>
                                </div>
        `;

		// Mostrar precio y stock solo si hay sesión activa
		if (isLoggedIn) {
			productoDetails += `
                                <div class="product-detail-price">${producto.precio ? producto.precio.toFixed(2) + ' €' : 'N/A'}</div>
                                <div class="product-detail-stock ${stockStatus}">
                                    <i class="bi bi-box-seam me-2"></i>
                                    ${stockText} | ${producto.stockDisponible || 0} en stock
                                </div>
            `;
		} else {
			productoDetails += `
                                <div class="product-detail-price text-muted">Inicia sesión para ver el precio</div>
                                <div class="product-detail-stock text-muted">Inicia sesión para ver el stock</div>
            `;
		}

		productoDetails += `
                                <p class="product-detail-description">${producto.descripcion || 'No hay descripción disponible para este producto.'}</p>
        `;

		// Contenido condicional según el tipo de usuario
		if (isEmpleado) {
			// Formulario de edición para empleados
			productoDetails += `
                                <form id="updateProductoForm">
                                    <input type="hidden" id="updateId" value="${producto.id || ''}">
                                    
                                    <div class="form-section">
                                        <h3 class="form-section-title">Editar Producto</h3>
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <label for="updateNombre" class="form-label">Nombre</label>
                                                <input type="text" id="updateNombre" class="form-control" value="${producto.nombre || ''}" required>
                                            </div>
                                            <div class="col-md-6">
                                                <label for="updateDescripcion" class="form-label">Descripción</label>
                                                <input type="text" id="updateDescripcion" class="form-control" value="${producto.descripcion || ''}">
                                            </div>
                                            <div class="col-md-6">
                                                <label for="updatePrecio" class="form-label">Precio</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">€</span>
                                                    <input type="number" step="0.01" id="updatePrecio" class="form-control" 
                                                           value="${producto.precio || 0}" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label for="updateStockDisponible" class="form-label">Stock</label>
                                                <input type="number" id="updateStockDisponible" class="form-control" 
                                                       value="${producto.stockDisponible || 0}" required>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="updateIdCategoria" class="form-label">Categoría</label>
                                                <select id="updateIdCategoria" class="form-control" required>
                                                    <option value="Electrónica" ${producto.nombreCategoria === 'Electrónica' ? 'selected' : ''}>Electrónica</option>
                                                    <option value="Ropa" ${producto.nombreCategoria === 'Ropa' ? 'selected' : ''}>Ropa</option>
                                                    <option value="Accesorios" ${producto.nombreCategoria === 'Accesorios' ? 'selected' : ''}>Accesorios</option>
                                                    <option value="Hogar" ${producto.nombreCategoria === 'Hogar' ? 'selected' : ''}>Hogar</option>
                                                    <option value="Deportes" ${producto.nombreCategoria === 'Deportes' ? 'selected' : ''}>Deportes</option>
                                                    <option value="Juguetes" ${producto.nombreCategoria === 'Juguetes' ? 'selected' : ''}>Juguetes</option>
                                                    <option value="Alimentación" ${producto.nombreCategoria === 'Alimentación' ? 'selected' : ''}>Alimentación</option>
                                                    <option value="Belleza" ${producto.nombreCategoria === 'Belleza' ? 'selected' : ''}>Belleza</option>
                                                    <option value="Libros" ${producto.nombreCategoria === 'Libros' ? 'selected' : ''}>Libros</option>
                                                    <option value="Muebles" ${producto.nombreCategoria === 'Muebles' ? 'selected' : ''}>Muebles</option>
                                                </select>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="updateIdMarca" class="form-label">Marca</label>
                                                <select id="updateIdMarca" class="form-control" required>
                                                    <option value="Samsung" ${producto.nombreMarca === 'Samsung' ? 'selected' : ''}>Samsung</option>
                                                    <option value="Nike" ${producto.nombreMarca === 'Nike' ? 'selected' : ''}>Nike</option>
                                                    <option value="Ray-Ban" ${producto.nombreMarca === 'Ray-Ban' ? 'selected' : ''}>Ray-Ban</option>
                                                    <option value="Apple" ${producto.nombreMarca === 'Apple' ? 'selected' : ''}>Apple</option>
                                                    <option value="Sony" ${producto.nombreMarca === 'Sony' ? 'selected' : ''}>Sony</option>
                                                    <option value="Adidas" ${producto.nombreMarca === 'Adidas' ? 'selected' : ''}>Adidas</option>
                                                    <option value="Puma" ${producto.nombreMarca === 'Puma' ? 'selected' : ''}>Puma</option>
                                                    <option value="LG" ${producto.nombreMarca === 'LG' ? 'selected' : ''}>LG</option>
                                                    <option value="Xiaomi" ${producto.nombreMarca === 'Xiaomi' ? 'selected' : ''}>Xiaomi</option>
                                                    <option value="HP" ${producto.nombreMarca === 'HP' ? 'selected' : ''}>HP</option>
                                                    <option value="Dell" ${producto.nombreMarca === 'Dell' ? 'selected' : ''}>Dell</option>
                                                    <option value="Canon" ${producto.nombreMarca === 'Canon' ? 'selected' : ''}>Canon</option>
                                                    <option value="Nestlé" ${producto.nombreMarca === 'Nestlé' ? 'selected' : ''}>Nestlé</option>
                                                    <option value="L'Oréal" ${producto.nombreMarca === "L'Oréal" ? 'selected' : ''}>L'Oréal</option>
                                                    <option value="IKEA" ${producto.nombreMarca === 'IKEA' ? 'selected' : ''}>IKEA</option>
                                                </select>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="updateIdUnidadMedida" class="form-label">Unidad</label>
                                                <select id="updateIdUnidadMedida" class="form-control" required>
                                                    <option value="Unidad" ${producto.nombreUnidadMedida === 'Unidad' ? 'selected' : ''}>Unidad</option>
                                                    <option value="Kilogramos" ${producto.nombreUnidadMedida === 'Kilogramos' ? 'selected' : ''}>Kilogramos</option>
                                                    <option value="Litros" ${producto.nombreUnidadMedida === 'Litros' ? 'selected' : ''}>Litros</option>
                                                    <option value="Gramos" ${producto.nombreUnidadMedida === 'Gramos' ? 'selected' : ''}>Gramos</option>
                                                    <option value="Mililitros" ${producto.nombreUnidadMedida === 'Mililitros' ? 'selected' : ''}>Mililitros</option>
                                                    <option value="Metros" ${producto.nombreUnidadMedida === 'Metros' ? 'selected' : ''}>Metros</option>
                                                    <option value="Centímetros" ${producto.nombreUnidadMedida === 'Centímetros' ? 'selected' : ''}>Centímetros</option>
                                                    <option value="Paquete" ${producto.nombreUnidadMedida === 'Paquete' ? 'selected' : ''}>Paquete</option>
                                                    <option value="Caja" ${producto.nombreUnidadMedida === 'Caja' ? 'selected' : ''}>Caja</option>
                                                    <option value="Docena" ${producto.nombreUnidadMedida === 'Docena' ? 'selected' : ''}>Docena</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="form-section">
                                        <h3 class="form-section-title">Actualizar Imagen</h3>
                                        <div class="mb-3">
                                            <label for="updateProductImage" class="form-label">Nueva Imagen</label>
                                            <input class="form-control" type="file" id="updateProductImage">
                                        </div>
                                    </div>
                                    
                                    <div class="product-detail-actions">
                                        <button type="button" id="backToResultsBtn" class="btn btn-outline-secondary">
                                            <i class="bi bi-arrow-left me-2"></i>Volver
                                        </button>
                                        <button type="submit" id="updateProduct" class="btn btn-primary" data-id="${producto.id || ''}">
                                            <i class="bi bi-save me-2"></i>Guardar Cambios
                                        </button>
                                        <button type="button" id="deleteProduct" class="btn btn-danger" data-id="${producto.id || ''}">
                                            <i class="bi bi-trash me-2"></i>Eliminar
                                        </button>
            `;
		} else {
			// Botón de añadir al carrito solo para usuarios logueados (clientes)
			productoDetails += `
                                    <div class="product-detail-actions">
                                        <button type="button" id="backToResultsBtn" class="btn btn-outline-secondary">
                                            <i class="bi bi-arrow-left me-2"></i>Volver
                                        </button>
            `;
			if (isLoggedIn) {
				productoDetails += `
                                        <button type="button" id="addToCartBtn" class="btn btn-success" 
                                                data-id="${producto.id}" 
                                                data-nombre="${producto.nombre}" 
                                                data-precio="${producto.precio}"
                                                ${producto.stockDisponible <= 0 ? 'disabled' : ''}>
                                            <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
                                        </button>
                `;
			}
		}

		productoDetails += `
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

		container.innerHTML = productoDetails;
	},

	renderResults(productos, containerId = "pro-inventario", currentPage = 1, itemsPerPage = 10, totalItems = 0) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			return;
		}

		// Si no existe el formulario de búsqueda, lo renderizamos primero
		if (!document.getElementById('searchResults')) {
			container.innerHTML = this.getSearchForm();
		}

		const resultsContainer = document.getElementById('searchResults');
		if (!resultsContainer) {
			console.error('No se encontró el contenedor de resultados');
			return;
		}

		resultsContainer.innerHTML = '';

		if (productos.length === 0) {
			resultsContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle me-2"></i>No se encontraron productos con los criterios de búsqueda.
                </div>
            `;
			return;
		}

		const isLoggedIn = App.cliente !== null; // Verificar si hay sesión activa

		// Renderizar los productos
		let resultsHtml = '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">';

		productos.forEach(producto => {
			const imageSrc = this.getProductImageSrc(producto.id);
			const stockStatus = producto.stockDisponible > 10 ? 'in-stock' :
				producto.stockDisponible > 0 ? 'low-stock' : 'out-of-stock';

			resultsHtml += `
                <div class="col">
                    <div class="product-card h-100">
                        <div class="product-image-container">
                            <img src="${imageSrc}" alt="${producto.nombre}" class="product-image" 
                                 onerror="this.onerror=null; this.src='./img/placeholder.png';">
                            ${producto.stockDisponible <= 0 && isLoggedIn ? '<span class="product-badge">AGOTADO</span>' : ''}
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${producto.nombre || 'N/A'}</h3>
                            <p class="product-category mb-1">
                                <i class="bi bi-tag me-1"></i>${producto.nombreCategoria || 'Sin categoría'}
                            </p>
            `;

			// Mostrar precio y stock solo si hay sesión activa
			if (isLoggedIn) {
				resultsHtml += `
                            <div class="product-price">${producto.precio ? producto.precio.toFixed(2) + ' €' : 'N/A'}</div>
                            <p class="product-stock ${stockStatus}">
                                <i class="bi bi-box-seam me-1"></i>
                                ${producto.stockDisponible || 0} disponibles
                            </p>
                `;
			} else {
				resultsHtml += `
                            <div class="product-price text-muted">Inicia sesión para ver el precio</div>
                            <p class="product-stock text-muted">Inicia sesión para ver el stock</p>
                `;
			}

			resultsHtml += `
                            <div class="product-actions">
                                <button class="btn btn-view-details product-link" data-id="${producto.id || ''}">
                                    <i class="bi bi-eye me-1"></i>Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
		});

		resultsHtml += '</div>';

		// Calcular total de páginas
		const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

		// Añadir la paginación
		if (totalItems > 0) {
			resultsHtml += this.getPaginationHtml(currentPage, totalPages, totalItems);
		}

		resultsContainer.innerHTML = resultsHtml;
	},

	getPaginationHtml(currentPage, totalPages, totalItems) {
		// Si solo hay una página, no mostramos la paginación
		if (totalPages <= 1) return '';

		let paginationHtml = `
            <nav aria-label="Paginación de productos" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${currentPage <= 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Anterior">
                            <span aria-hidden="true">«</span> Anterior
                        </a>
                    </li>`;

		// Determinar qué páginas mostrar
		const maxPagesToShow = 5; // Mostrar máximo 5 páginas numeradas
		let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		// Ajustar si estamos cerca del final
		if (endPage - startPage + 1 < maxPagesToShow) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		// Añadir primera página y elipsis si es necesario
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

		// Añadir páginas numeradas
		for (let i = startPage; i <= endPage; i++) {
			paginationHtml += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`;
		}

		// Añadir última página y elipsis si es necesario
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

		// Añadir botón Siguiente
		paginationHtml += `
                <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Siguiente">
                        Siguiente <span aria-hidden="true">»</span>
                    </a>
                </li>
            </ul>`;

		// Añadir información sobre registros mostrados
		const firstItem = Math.min(totalItems, (currentPage - 1) * 10 + 1);
		const lastItem = Math.min(totalItems, currentPage * 10);

		paginationHtml += `
            <p class="text-center mt-2">
                Mostrando ${firstItem} - ${lastItem} de ${totalItems} productos
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

	renderCompraSuccess(message) {
		const resultsContainer = document.getElementById("createResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${message}
                </div>
            `;
		}
	},

	renderCompraError(message) {
		const resultsContainer = document.getElementById("createResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `;
		}
	}
};

export default ProductoView;