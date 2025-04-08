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
					  <input type="text" id="createNombre" name="createNombre" class="form-control" placeholder="Ej: Smartphone X Pro" required>
					</div>
					<div class="col-md-6">
					  <label for="createDescripcion" class="form-label">Descripción</label>
					  <input type="text" id="createDescripcion" name="createDescripcion" class="form-control" placeholder="Breve descripción del producto">
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
						<input type="number" step="0.01" id="createPrecio" name="createPrecio" class="form-control" placeholder="0.00" required>
					  </div>
					</div>
					<div class="col-md-6">
					  <label for="createStockDisponible" class="form-label">Stock Disponible</label>
					  <input type="number" id="createStockDisponible" name="createStockDisponible" class="form-control" placeholder="Cantidad en inventario" required>
					</div>
				  </div>
				</div>
				
				<div class="form-section">
				  <h3 class="form-section-title">Clasificación</h3>
				  <div class="row g-3">
					<div class="col-md-4">
					  <label for="createIdCategoria" class="form-label">Categoría</label>
					  <select id="createIdCategoria" name="createIdCategoria" class="form-control" required>
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
					  <select id="createIdMarca" name="createIdMarca" class="form-control" required>
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
					  <select id="createIdUnidadMedida" name="createIdUnidadMedida" class="form-control" required>
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
					<input class="form-control" type="file" id="productImage" name="productImage" accept="image/*">
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
		const isLoggedIn = App.cliente !== null;
		const stockStatus = producto.stockDisponible > 10 ? 'stock-available' :
			producto.stockDisponible > 0 ? 'stock-low' : 'stock-unavailable';
		const stockText = producto.stockDisponible > 10 ? 'Disponible' :
			producto.stockDisponible > 0 ? 'Últimas unidades' : 'Agotado';

		const nombre = producto.nombre || 'N/A';
		const nombreCategoria = producto.nombreCategoria || 'Sin categoría';
		const nombreMarca = producto.nombreMarca || 'Sin marca';
		const descripcion = producto.descripcion || 'No hay descripción disponible.';
		const precio = producto.precio ? Number(producto.precio).toFixed(2) + ' €' : 'N/A';
		const stockDisponible = producto.stockDisponible || 0;

		let productoDetails = `
            <div class="product-detail-container">
                <div class="product-detail-card">
                    <div class="row g-0">
                        <div class="col-md-6">
                            <div class="product-detail-image-container">
                                ${producto.images && producto.images.length > 0 ? `
                                    <img src="http://localhost:8080${producto.images[0].url}" 
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
                                    <div class="product-detail-stock ${stockStatus}">
                                        <i class="bi bi-box-seam me-2"></i>
                                        ${stockText} | ${stockDisponible} en stock
                                    </div>
                                ` : `
                                    <div class="product-detail-price text-muted">Inicia sesión para ver el precio</div>
                                    <div class="product-detail-stock text-muted">Inicia sesión para ver el stock</div>
                                `}
                                <p class="product-detail-description">${descripcion}</p>
        `;

		if (isEmpleado) {
			productoDetails += `
				<form id="updateProductoForm" enctype="multipart/form-data">
					<input type="hidden" id="updateId" name="updateId" value="${producto.id || ''}">
					<div class="form-section">
						<h3 class="form-section-title">Editar Producto</h3>
						<div class="row g-3">
							<div class="col-md-6">
								<label for="updateNombre" class="form-label">Nombre del Producto</label>
								<input type="text" id="updateNombre" name="updateNombre" class="form-control" value="${nombre}" required>
							</div>
							<div class="col-md-6">
								<label for="updateDescripcion" class="form-label">Descripción</label>
								<input type="text" id="updateDescripcion" name="updateDescripcion" class="form-control" value="${descripcion}">
							</div>
							<div class="col-md-6">
								<label for="updatePrecio" class="form-label">Precio</label>
								<div class="input-group">
									<span class="input-group-text">€</span>
									<input type="number" step="0.01" id="updatePrecio" name="updatePrecio" class="form-control" value="${producto.precio || 0}" required>
								</div>
							</div>
							<div class="col-md-6">
								<label for="updateStockDisponible" class="form-label">Stock Disponible</label>
								<input type="number" id="updateStockDisponible" name="updateStockDisponible" class="form-control" value="${stockDisponible}" required>
							</div>
							<div class="col-md-4">
								<label for="updateIdCategoria" class="form-label">Categoría</label>
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
								<label for="updateIdMarca" class="form-label">Marca</label>
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
								<label for="updateIdUnidadMedida" class="form-label">Unidad de Medida</label>
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
								<label for="productImage" class="form-label">Actualizar Imagen</label>
								<input class="form-control" type="file" id="productImage" name="productImage" accept="image/*">
								<div class="form-text">Formatos soportados: JPG, PNG. Tamaño máximo: 5MB</div>
							</div>
						</div>
					</div>
					<div class="product-detail-actions">
						<button type="button" id="backToResultsBtn" class="btn btn-outline-secondary">
							<i class="bi bi-arrow-left me-2"></i>Volver
						</button>
						<button type="submit" class="btn btn-primary">
							<i class="bi bi-save me-2"></i>Guardar Cambios
						</button>
						<button type="button" id="deleteProduct" class="btn btn-danger" data-id="${producto.id || ''}">
							<i class="bi bi-trash me-2"></i>Eliminar
						</button>
					</div>
				</form>
			`;
		} else {
			productoDetails += `
				<div class="product-detail-actions">
					<button type="button" id="backToResultsBtn" class="btn btn-outline-secondary">
						<i class="bi bi-arrow-left me-2"></i>Volver
					</button>
					${isLoggedIn ? `
						<button type="button" id="addToCartBtn" class="btn btn-success" 
								data-id="${producto.id || ''}" 
								data-nombre="${nombre}" 
								data-precio="${producto.precio || 0}"
								${stockDisponible <= 0 ? 'disabled' : ''}>
							<i class="bi bi-cart-plus me-2"></i>Añadir al carrito
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

	renderResults(productos, containerId = "pro-inventario", currentPage = 1, itemsPerPage = 10, totalItems = 0) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			return;
		}

		if (!document.getElementById('searchResults')) {
			container.innerHTML = this.getSearchForm();
		}

		const resultsContainer = document.getElementById('searchResults');
		if (!resultsContainer) {
			console.error("No se encontró el contenedor de resultados con ID: searchResults");
			return;
		}

		resultsContainer.innerHTML = '';

		if (!Array.isArray(productos) || productos.length === 0) {
			resultsContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle me-2"></i>No se encontraron productos con los criterios de búsqueda.
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
			const nombreCategoria = producto.nombreCategoria || 'Sin categoría';
			const precio = producto.precio ? Number(producto.precio).toFixed(2) + ' €' : 'N/A';
			const stockDisponible = producto.stockDisponible || 0;

			resultsHtml += `
                <div class="col">
                    <div class="product-card h-100">
                        <div class="product-image-container">
                            ${producto.images && producto.images.length > 0 ? `
                                <img src="http://localhost:8080${producto.images[0].url}" 
                                     alt="${nombre}" 
                                     class="product-image"
                                     onerror="this.onerror=null; this.src='./img/placeholder.png'; console.error('Error loading image: ${producto.images[0].url}');">
                            ` : `
                                <img src="./img/placeholder.png" 
                                     alt="${nombre}" 
                                     class="product-image">
                            `}
                            ${stockDisponible <= 0 && isLoggedIn ? '<span class="product-badge">AGOTADO</span>' : ''}
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${nombre}</h3>
                            <p class="product-category mb-1">
                                <i class="bi bi-tag me-1"></i>${nombreCategoria}
                            </p>
                            ${isLoggedIn ? `
                                <div class="product-price">${precio}</div>
                                <p class="product-stock ${stockStatus}">
                                    <i class="bi bi-box-seam me-1"></i>
                                    ${stockDisponible} disponibles
                                </p>
                            ` : `
                                <div class="product-price text-muted">Inicia sesión para ver el precio</div>
                                <p class="product-stock text-muted">Inicia sesión para ver el stock</p>
                            `}
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

		const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
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