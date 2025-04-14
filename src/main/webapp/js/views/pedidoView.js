const PedidoView = {
    getPedidosView(pedidos) {
        return `
            <div class="container mt-4">
                <h2 class="mb-4 text-center" data-i18n="pedidos.title">Meus Pedidos</h2>
                ${pedidos.length > 0 ? `
                    <div class="row">
                        ${pedidos.map((pedido) => `
                            <div class="col-md-6 mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Pedido #${pedido.id}</h5>
                                        <p class="card-text">
                                            <strong data-i18n="pedidos.dateFrom">Data:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}<br>
                                            <strong data-i18n="pedidos.status">Estado:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}<br>
                                            <strong data-i18n="pedidos.total">Total:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €<br>
                                            <strong data-i18n="pedidos.items">Itens:</strong> ${pedido.lineas ? pedido.lineas.length : '0'}
                                        </p>
                                        <div class="text-center">
                                            <button class="btn btn-primary btn-sm btn-ver-detalle" data-pedido-id="${pedido.id}" data-i18n="pedidos.viewDetails">Ver Detalhes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="alert alert-info">
                        <span data-i18n="pedidos.noOrders">Nenhum pedido encontrado. Comece a comprar agora!</span>
                        <a href="#produtos" class="btn btn-success btn-sm ms-2" data-i18n="pedidos.viewProducts">Ver Produtos</a>
                    </div>
                `}
            </div>
        `;
    },

    getSearchPedidosLayout() {
        return `
            <div class="container mt-4">
                <h2 class="mb-4 text-center" data-i18n="pedidos.title">Buscar Pedidos</h2>
                <div class="row">
                    <!-- Aside para el formulario de búsqueda -->
                    <aside class="col-md-4 mb-4">
                        <div class="card p-4 shadow-sm sticky-top" id="search-form-aside">
                            <form id="search-pedidos-form">
                                <div class="mb-3">
                                    <label for="pedido-id" class="form-label" data-i18n="pedidos.orderId">ID do Pedido</label>
                                    <input type="number" class="form-control" id="pedido-id" placeholder="Digite o ID do pedido">
                                </div>
                                <div class="mb-3">
                                    <label for="fecha-desde" class="form-label" data-i18n="pedidos.dateFrom">Data Desde</label>
                                    <input type="date" class="form-control" id="fecha-desde">
                                </div>
                                <div class="mb-3">
                                    <label for="fecha-hasta" class="form-label" data-i18n="pedidos.dateTo">Data Até</label>
                                    <input type="date" class="form-control" id="fecha-hasta">
                                </div>
                                <div class="mb-3">
                                    <label for="precio-desde" class="form-label" data-i18n="pedidos.priceFrom">Preço Desde (€)</label>
                                    <input type="number" step="0.01" class="form-control" id="precio-desde" placeholder="0.00">
                                </div>
                                <div class="mb-3">
                                    <label for="precio-hasta" class="form-label" data-i18n="pedidos.priceTo">Preço Até (€)</label>
                                    <input type="number" step="0.01" class="form-control" id="precio-hasta" placeholder="0.00">
                                </div>
                                <div class="mb-3">
                                    <label for="cliente-id" class="form-label" data-i18n="pedidos.clientId">ID do Cliente</label>
                                    <input type="number" class="form-control" id="cliente-id" placeholder="Digite o ID do cliente">
                                </div>
                                <div class="mb-3">
                                    <label for="tipo-estado-pedido-id" class="form-label" data-i18n="pedidos.orderStatus">Estado do Pedido</label>
                                    <select class="form-select" id="tipo-estado-pedido-id">
                                        <option value="" data-i18n="pedidos.all">Todos</option>
                                        <option value="1" data-i18n="pedidos.pending">Pendente</option>
                                        <option value="2" data-i18n="pedidos.processing">Processando</option>
                                        <option value="3" data-i18n="pedidos.shipped">Enviado</option>
                                        <option value="4" data-i18n="pedidos.delivered">Entregue</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="producto-id" class="form-label" data-i18n="pedidos.productId">ID do Produto</label>
                                    <input type="number" class="form-control" id="producto-id" placeholder="Digite o ID do produto">
                                </div>
                                <div class="mb-3">
                                    <label for="descripcion" class="form-label" data-i18n="pedidos.description">Descrição do Produto</label>
                                    <input type="text" class="form-control" id="descripcion" placeholder="Digite a descrição">
                                </div>
                                <div class="d-flex justify-content-between gap-2">
                                    <button type="button" id="clear-search-form" class="btn btn-secondary" data-i18n="pedidos.clear">Limpar</button>
                                    <button type="submit" class="btn btn-primary" data-i18n="pedidos.search">Buscar</button>
                                </div>
                            </form>
                        </div>
                    </aside>
                    <!-- Contenido principal para los resultados -->
                    <div class="col-md-8">
                        <div id="search-results" class="mt-4">
                            <!-- Resultados se renderizarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getProductImageSrc(productId) {
        if (!productId) {
            return './img/placeholder.png';
        }
        return `./img/${productId}.jpg`; // Ajusta esta lógica según cómo almacenes las imágenes
    },

    getPedidoDetalheView(pedido) {
        return `
            <div class="container mt-4">
                <h2 class="mb-4 text-center" data-i18n="pedidos.orderDetail">Detalhes do Pedido #${pedido.id}</h2>
                <div class="card">
                    <div class="card-body">
                        <p><strong data-i18n="pedidos.dateFrom">Data:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}</p>
                        <p><strong data-i18n="pedidos.status">Estado:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}</p>
                        <p><strong data-i18n="pedidos.total">Total:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €</p>
                        <h5 data-i18n="pedidos.items">Itens do Pedido</h5>
                        <ul class="list-unstyled">
                            ${pedido.lineas && pedido.lineas.length > 0 ? pedido.lineas.map(item => `
                                <li class="media mb-3">
                                    <img src="${this.getProductImageSrc(item.productoId)}" alt="Imagen de ${item.nombreProducto || 'N/A'}" class="mr-3" style="width: 80px; height: 80px; object-fit: contain;" onerror="this.onerror=null; this.src='./img/placeholder.png';">
                                    <div class="media-body">
                                        <h6 class="mt-0 mb-1">
                                            <a href="#" class="producto-link" data-producto-id="${item.productoId}">${item.nombreProducto || 'N/A'}</a>
                                        </h6>
                                        <p>${item.unidades || 0} x ${item.precio != null ? item.precio.toFixed(2) : '0.00'} €</p>
                                    </div>
                                </li>
                            `).join('') : '<li data-i18n="pedidos.noOrders">Nenhum item encontrado.</li>'}
                        </ul>
                        <div class="text-center mt-3">
                            <a href="#buscar-pedidos" class="btn btn-secondary" data-i18n="pedidos.backToSearch">Voltar à Busca</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getPaginationControls(currentPage, totalPages, totalItems, itemsPerPage) {
        if (totalPages <= 1) {
            return '';
        }

        let paginationHTML = `
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <small>Mostrando ${Math.min(itemsPerPage, totalItems)} de ${totalItems} resultados</small>
                </div>
                <nav aria-label="Navegação de páginas">
                    <ul class="pagination pagination-sm justify-content-center mb-0">
        `;

        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Anterior">
                    <span aria-hidden="true">«</span>
                </a>
            </li>
        `;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Siguiente">
                    <span aria-hidden="true">»</span>
                </a>
            </li>
        `;

        paginationHTML += `
                    </ul>
                </nav>
                <div>
                    <small>Página ${currentPage} de ${totalPages}</small>
                </div>
            </div>
        `;

        return paginationHTML;
    },

    renderSearchResultsWithPagination(containerId, pedidos, currentPage, itemsPerPage, totalItems) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (pedidos.length > 0) {
            container.innerHTML = `
                <h3 class="mb-3" data-i18n="pedidos.search">Resultados da Busca</h3>
                <div class="row">
                    ${pedidos.map((pedido) => `
                        <div class="col-md-6 mb-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Pedido #${pedido.id}</h5>
                                    <p class="card-text">
                                        <strong data-i18n="pedidos.dateFrom">Data:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}<br>
                                        <strong data-i18n="pedidos.status">Estado:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}<br>
                                        <strong data-i18n="pedidos.total">Total:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €<br>
                                        <strong data-i18n="pedidos.items">Itens:</strong> ${pedido.lineas ? pedido.lineas.length : '0'}
                                    </p>
                                    <div class="text-center">
                                        <button class="btn btn-primary btn-sm btn-ver-detalle" data-pedido-id="${pedido.id}" data-i18n="pedidos.viewDetails">Ver Detalhes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${this.getPaginationControls(currentPage, totalPages, totalItems, itemsPerPage)}
            `;
        } else {
            container.innerHTML = `
                <div class="alert alert-info mt-4" data-i18n="pedidos.noOrders">
                    Nenhum pedido encontrado com os critérios fornecidos.
                </div>
            `;
        }
    },

    renderPedidos(containerId, pedidos) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML = this.getPedidosView(pedidos);
    },

    renderSearchForm(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML = this.getSearchPedidosLayout();
    },

    renderSearchResults(containerId, pedidos, currentPage = 1, itemsPerPage = 10, totalItems = 0) {
        this.renderSearchResultsWithPagination(containerId, pedidos, currentPage, itemsPerPage, totalItems);
    },

    renderPedidoDetalhe(containerId, pedido) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML = this.getPedidoDetalheView(pedido);
    },

    renderError(message) {
        const container = document.getElementById("pro-inventario");
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `;
        }
    },
};

export default PedidoView;