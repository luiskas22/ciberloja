const ProductoView = {
	getSearchForm() {
		return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center">Buscar Productos</h2>
            <form id="searchProductosForm" class="bg-light p-4 rounded shadow-sm">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="id" class="form-label">ID:</label>
                        <input type="text" id="idCriteria" class="form-control" placeholder="Ingrese ID">
                    </div>
                    <div class="col-md-6">
                        <label for="nombre" class="form-label">Nombre:</label>
                        <input type="text" id="nombreCriteria" class="form-control" placeholder="Ingrese nombre">
                    </div>
                    <div class="col-md-6">
                        <label for="descripcion" class="form-label">Descripción:</label>
                        <input type="text" id="descripcionCriteria" class="form-control" placeholder="Ingrese descripción">
                    </div>
                    <div class="col-md-6">
                        <label for="precioMin" class="form-label">Precio Mínimo:</label>
                        <input type="number" step="0.01" id="precioMinCriteria" class="form-control" placeholder="Mínimo">
                    </div>
                    <div class="col-md-6">
                        <label for="precioMax" class="form-label">Precio Máximo:</label>
                        <input type="number" step="0.01" id="precioMaxCriteria" class="form-control" placeholder="Máximo">
                    </div>
                    <div class="col-md-6">
                        <label for="stockMin" class="form-label">Stock Mínimo:</label>
                        <input type="number" id="stockMinCriteria" class="form-control" placeholder="Mínimo">
                    </div>
                    <div class="col-md-6">
                        <label for="stockMax" class="form-label">Stock Máximo:</label>
                        <input type="number" id="stockMaxCriteria" class="form-control" placeholder="Máximo">
                    </div>
                    <div class="col-md-6">
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
                    <div class="col-md-6">
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
                    <div class="col-md-6">
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
            </form>
            <div id="searchResults" class="mt-4"></div>
        </div>
        `;
	},

	getCreateForm() {
		return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center">Crear Nuevo Producto</h2>
            <form id="createProductoForm" class="bg-light p-4 rounded shadow-sm">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="nombre" class="form-label">Nombre:</label>
                        <input type="text" id="createNombre" class="form-control" placeholder="Ingrese nombre" required>
                    </div>
                    <div class="col-md-6">
                        <label for="descripcion" class="form-label">Descripción:</label>
                        <input type="text" id="createDescripcion" class="form-control" placeholder="Ingrese descripción">
                    </div>
                    <div class="col-md-6">
                        <label for="precio" class="form-label">Precio:</label>
                        <input type="number" step="0.01" id="createPrecio" class="form-control" placeholder="Ingrese precio" required>
                    </div>
                    <div class="col-md-6">
                        <label for="stockDisponible" class="form-label">Stock Disponible:</label>
                        <input type="number" id="createStockDisponible" class="form-control" placeholder="Ingrese stock" required>
                    </div>
                    <div class="col-md-6">
                        <label for="idCategoria" class="form-label">Categoría:</label>
                        <select id="createIdCategoria" class="form-control" required>
                            <option value="" disabled selected>Seleccione una categoría</option>
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
                    <div class="col-md-6">
                        <label for="idMarca" class="form-label">Marca:</label>
                        <select id="createIdMarca" class="form-control" required>
                            <option value="" disabled selected>Seleccione una marca</option>
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
                    <div class="col-md-6">
                        <label for="idUnidadMedida" class="form-label">Unidad de Medida:</label>
                        <select id="createIdUnidadMedida" class="form-control" required>
                            <option value="" disabled selected>Seleccione una unidad</option>
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
                <div class="mt-4 text-center">
                    <button type="submit" class="btn btn-success">Crear Producto</button>
                </div>
            </form>
            <div id="createResults" class="mt-4"></div>
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

	renderProductoDetails(producto, containerId = "pro-inventario") {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			return;
		}

		container.innerHTML = '';

		const imageSrc = this.getProductImageSrc(producto.id);

		const productoDetails = `
            <div class="producto-details card shadow-sm p-4">
                <div class="col-md-4 mb-3 text-center">
                    <img src="${imageSrc}" alt="Imagen de ${producto.nombre}" class="img-fluid rounded" style="max-height: 250px; object-fit: contain;">
                </div>
                <h3 class="card-title text-center mb-4">Detalles del Producto</h3>
                <form id="updateProductoForm" class="card-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="updateId" class="form-label"><strong>ID:</strong></label>
                            <input type="text" id="updateId" class="form-control" value="${producto.id || 'N/A'}" readonly>
                        </div>
                        <div class="col-md-6">
                            <label for="updateNombre" class="form-label"><strong>Nombre:</strong></label>
                            <input type="text" id="updateNombre" class="form-control" value="${producto.nombre || ''}" required>
                        </div>
                        <div class="col-md-6">
                            <label for="updateDescripcion" class="form-label"><strong>Descripción:</strong></label>
                            <input type="text" id="updateDescripcion" class="form-control" value="${producto.descripcion || ''}">
                        </div>
                        <div class="col-md-6">
                            <label for="updatePrecio" class="form-label"><strong>Precio:</strong></label>
                            <input type="number" step="0.01" id="updatePrecio" class="form-control" value="${producto.precio || 0}" required>
                        </div>
                        <div class="col-md-6">
                            <label for="updateStockDisponible" class="form-label"><strong>Stock:</strong></label>
                            <input type="number" id="updateStockDisponible" class="form-control" value="${producto.stockDisponible || 0}" required>
                        </div>
                        <div class="col-md-6">
                            <label for="updateIdCategoria" class="form-label"><strong>Categoría:</strong></label>
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
                        <div class="col-md-6">
                            <label for="updateIdMarca" class="form-label"><strong>Marca:</strong></label>
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
                                <option value="L'Oréal" ${producto.nombreMarca === 'L\'Oréal' ? 'selected' : ''}>L'Oréal</option>
                                <option value="IKEA" ${producto.nombreMarca === 'IKEA' ? 'selected' : ''}>IKEA</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="updateIdUnidadMedida" class="form-label"><strong>Unidad de Medida:</strong></label>
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
                    <div class="mt-4 text-center">
                        <button type="button" id="backToResultsBtn" class="btn btn-secondary me-2">Volver a los resultados</button>
                        <button type="submit" id="updateProduct" class="btn btn-primary me-2" data-id="${producto.id || ''}">Actualizar Producto</button>
                        <button type="button" id="deleteProduct" class="btn btn-danger" data-id="${producto.id || ''}">Eliminar Producto</button>
                    </div>
                </form>
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
			resultsContainer.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
			return;
		}

		// Renderizar los productos
		let resultsHtml = '<div class="productos-list">';
		productos.forEach(producto => {
			const imageSrc = this.getProductImageSrc(producto.id);
			resultsHtml += `
                <div class="card mb-3 shadow-sm">
                    <div class="row g-0">
                        <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
                            <img src="${imageSrc}" alt="Imagen de ${producto.nombre}" class="img-fluid rounded" 
                                 style="max-height: 150px; object-fit: contain;"
                                 onerror="this.onerror=null; this.src='./img/placeholder.png';">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre || 'N/A'}</h5>
                                <p class="card-text">ID: ${producto.id || 'N/A'} | Precio: ${producto.precio ? producto.precio.toFixed(2) + ' €' : 'N/A'} | Stock: ${producto.stockDisponible || 'N/A'}</p>
                                <button class="btn btn-primary product-link" data-id="${producto.id || ''}">Ver Detalles</button>
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
                            <span aria-hidden="true">&laquo;</span> Anterior
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
                        Siguiente <span aria-hidden="true">&raquo;</span>
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