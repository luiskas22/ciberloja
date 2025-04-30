import Translations from '../resources/translations.js';
import FileService from '../services/fileService.js'; // Add this import if keeping getProductImageSrc
const PedidoView = {
    getPedidosView(pedidos, lang = 'pt') {
        let t = {};
        try {
            t = Translations[lang]?.pedidos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        return `
            <div class="container order-container mt-5">
                <h2 class="order-title mb-4 text-center" data-i18n="pedidos.title">${t.title || 'Meus Pedidos'}</h2>
                ${pedidos.length > 0 ? `
                    <div class="row g-4">
                        ${pedidos.map((pedido) => `
                            <div class="col-md-6 col-lg-4">
                                <div class="card order-card h-100">
                                    <div class="card-body p-4">
                                        <h5 class="card-title order-card-title mb-3">Pedido #${pedido.id}</h5>
                                        <div class="order-details">
                                            <p class="order-item"><i class="fas fa-calendar-alt me-2"></i><strong data-i18n="pedidos.dateFrom">${t.dateFrom || 'Data'}:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}</p>
                                            <p class="order-item"><i class="fas fa-info-circle me-2"></i><strong data-i18n="pedidos.status">${t.status || 'Estado'}:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}</p>
                                            <p class="order-item"><i class="fas fa-euro-sign me-2"></i><strong data-i18n="pedidos.total">${t.total || 'Total'}:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €</p>
                                            <p class="order-item"><i class="fas fa-shopping-cart me-2"></i><strong data-i18n="pedidos.items">${t.items || 'Itens'}:</strong> ${pedido.lineas ? pedido.lineas.length : '0'}</p>
                                        </div>
                                        <div class="order-actions mt-4 text-center">
                                            <button class="btn btn-primary btn-sm btn-ver-detalle" data-pedido-id="${pedido.id}" data-i18n="pedidos.viewDetails">${t.viewDetails || 'Ver Detalhes'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="alert alert-info text-center py-4">
                        <i class="fas fa-info-circle me-2"></i>
                        <span data-i18n="pedidos.noOrders">${t.noOrders || 'Nenhum pedido encontrado. Comece a comprar agora!'}</span>
                        <div class="mt-3">
                            <a href="#produtos" class="btn btn-success btn-view-products" data-i18n="pedidos.viewProducts">${t.viewProducts || 'Ver Produtos'}</a>
                        </div>
                    </div>
                `}
            </div>
        `;
    },

    getSearchPedidosLayout(lang = 'pt') {
        let t = {};
        try {
            t = Translations[lang]?.pedidos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        return `
            <div class="container search-container mt-5">
                <h2 class="search-title mb-4 text-center" data-i18n="pedidos.title">${t.title || 'Buscar Pedidos'}</h2>
                <div class="row">
                    <aside class="col-md-4 mb-4">
                        <div class="card search-form-card p-4 shadow-sm sticky-top" id="search-form-aside">
                            <form id="search-pedidos-form">
                                <div class="mb-3">
                                    <label for="pedido-id" class="form-label" data-i18n="pedidos.orderId">${t.orderId || 'ID do Pedido'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                                        <input type="number" class="form-control" id="pedido-id" placeholder="${t.orderIdPlaceholder || 'Digite o ID do pedido'}">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="fecha-desde" class="form-label" data-i18n="pedidos.dateFrom">${t.dateFrom || 'Data Desde'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                                        <input type="date" class="form-control" id="fecha-desde">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="fecha-hasta" class="form-label" data-i18n="pedidos.dateTo">${t.dateTo || 'Data Até'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                                        <input type="date" class="form-control" id="fecha-hasta">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="precio-desde" class="form-label" data-i18n="pedidos.priceFrom">${t.priceFrom || 'Preço Desde (€)'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-euro-sign"></i></span>
                                        <input type="number" step="0.01" class="form-control" id="precio-desde" placeholder="0.00">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="precio-hasta" class="form-label" data-i18n="pedidos.priceTo">${t.priceTo || 'Preço Até (€)'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-euro-sign"></i></span>
                                        <input type="number" step="0.01" class="form-control" id="precio-hasta" placeholder="0.00">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="cliente-id" class="form-label" data-i18n="pedidos.clientId">${t.clientId || 'ID do Cliente'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-user"></i></span>
                                        <input type="number" class="form-control" id="cliente-id" placeholder="${t.clientIdPlaceholder || 'Digite o ID do cliente'}">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="tipo-estado-pedido-id" class="form-label" data-i18n="pedidos.orderStatus">${t.orderStatus || 'Estado do Pedido'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-info-circle"></i></span>
                                        <select class="form-select" id="tipo-estado-pedido-id">
                                            <option value="" data-i18n="pedidos.all">${t.all || 'Todos'}</option>
                                            <option value="1" data-i18n="pedidos.pending">${t.pending || 'Pendente'}</option>
                                            <option value="2" data-i18n="pedidos.processing">${t.processing || 'Processando'}</option>
                                            <option value="3" data-i18n="pedidos.shipped">${t.shipped || 'Enviado'}</option>
                                            <option value="4" data-i18n="pedidos.delivered">${t.delivered || 'Entregue'}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="producto-id" class="form-label" data-i18n="pedidos.productId">${t.productId || 'ID do Produto'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-box"></i></span>
                                        <input type="number" class="form-control" id="producto-id" placeholder="${t.productIdPlaceholder || 'Digite o ID do produto'}">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="descripcion" class="form-label" data-i18n="pedidos.description">${t.description || 'Descrição do Produto'}</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-align-left"></i></span>
                                        <input type="text" class="form-control" id="descripcion" placeholder="${t.descriptionPlaceholder || 'Digite a descrição'}">
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between gap-2">
                                    <button type="button" id="clear-search-form" class="btn btn-outline-secondary" data-i18n="pedidos.clear">${t.clear || 'Limpar'}</button>
                                    <button type="submit" class="btn btn-primary" data-i18n="pedidos.search">${t.search || 'Buscar'}</button>
                                </div>
                            </form>
                        </div>
                    </aside>
                    <div class="col-md-8">
                        <div id="search-results" class="mt-4">
                            <!-- Resultados se renderizarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Keep getProductImageSrc if needed elsewhere, otherwise comment out or remove
    async getProductImageSrc(productId) {
        if (!productId) {
            return './img/placeholder.png';
        }
        try {
            const images = await FileService.getImagesByProductoId(productId);
            if (images && images.length > 0) {
                return `http://192.168.99.40:8080${images[0].url}`;
            }
            return './img/placeholder.png';
        } catch (error) {
            console.warn(`No se pudieron cargar las imágenes para el producto ${productId}:`, error);
            return './img/placeholder.png';
        }
    },

    getPedidoDetalheView(pedido, lang = 'pt') {
        let t = {};
        try {
            t = Translations[lang]?.pedidos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        let isEmpleado = false;
        if (window.App && window.App.isEmpleado) {
            isEmpleado = window.App.isEmpleado();
            console.log("Verificación de empleado en getPedidoDetalheView:", {
                isEmpleado,
                cliente: window.App.cliente,
                rol_id: window.App.cliente ? window.App.cliente.rol_id : null
            });
        } else {
            console.warn("App o App.isEmpleado no está disponible. Verificando sessionStorage como respaldo.");
            const clienteData = sessionStorage.getItem("cliente");
            if (clienteData) {
                const cliente = JSON.parse(clienteData);
                isEmpleado = cliente && cliente.rol_id === 2;
                console.log("Resultado del respaldo sessionStorage:", { isEmpleado, cliente });
            }
        }

        return `
            <div class="container order-detail-container mt-5">
                <h2 class="order-detail-title mb-4 text-center" data-i18n="pedidos.orderDetail">${t.orderDetail || 'Detalhes do Pedido'} #${pedido.id}</h2>
                <div class="card order-detail-card">
                    <div class="card-body p-4">
                        <div class="order-detail-info">
                            <p class="order-item"><i class="fas fa-calendar-alt me-2"></i><strong data-i18n="pedidos.dateFrom">${t.dateFrom || 'Data'}:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}</p>
                            <p class="order-item"><i class="fas fa-info-circle me-2"></i><strong data-i18n="pedidos.status">${t.status || 'Estado'}:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}</p>
                            <p class="order-item"><i class="fas fa-euro-sign me-2"></i><strong data-i18n="pedidos.total">${t.total || 'Total'}:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €</p>
                        </div>
                        ${isEmpleado ? `
                            <div class="mb-4">
                                <label for="tipo-estado-pedido-id" class="form-label" data-i18n="pedidos.orderStatus">${t.orderStatus || 'Alterar Estado do Pedido'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-info-circle"></i></span>
                                    <select class="form-select" id="tipo-estado-pedido-id" data-pedido-id="${pedido.id}">
                                        <option value="1" ${pedido.tipoEstadoPedidoId === 1 ? 'selected' : ''} data-i18n="pedidos.pending">${t.pending || 'Pendente'}</option>
                                        <option value="2" ${pedido.tipoEstadoPedidoId === 2 ? 'selected' : ''} data-i18n="pedidos.processing">${t.processing || 'Processando'}</option>
                                        <option value="3" ${pedido.tipoEstadoPedidoId === 3 ? 'selected' : ''} data-i18n="pedidos.shipped">${t.shipped || 'Enviado'}</option>
                                        <option value="4" ${pedido.tipoEstadoPedidoId === 4 ? 'selected' : ''} data-i18n="pedidos.delivered">${t.delivered || 'Entregue'}</option>
                                    </select>
                                </div>
                                <button class="btn btn-primary btn-sm mt-2 btn-cambiar-estado" data-pedido-id="${pedido.id}" data-i18n="pedidos.updateStatus">${t.updateStatus || 'Atualizar Estado'}</button>
                            </div>
                        ` : ''}
                        <h5 class="order-items-title mt-4" data-i18n="pedidos.items">${t.items || 'Itens do Pedido'}</h5>
                        <div class="order-items-list">
                            ${pedido.lineas && pedido.lineas.length > 0 ? pedido.lineas.map(item => `
                                <div class="order-item-card card mb-3">
                                    <div class="card-body d-flex align-items-center">
                                        <img src="${item.imageSrc || './img/placeholder.png'}" alt="Imagen de ${item.nombreProducto || 'N/A'}" class="order-item-image me-3" onerror="this.onerror=null; this.src='./img/placeholder.png';">
                                        <div class="order-item-details">
                                            <h6 class="order-item-title mb-1">
                                                <a href="#" class="producto-link" data-producto-id="${item.productoId}">${item.nombreProducto || 'N/A'}</a>
                                            </h6>
                                            <p class="order-item-info mb-0">${item.unidades || 0} x ${item.precio != null ? item.precio.toFixed(2) : '0.00'} €</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : `<div class="alert alert-info" data-i18n="pedidos.noOrders">${t.noOrders || 'Nenhum item encontrado.'}</div>`}
                        </div>
                        <div class="text-center mt-4">
                            <a href="#buscar-pedidos" class="btn btn-outline-secondary btn-back" data-i18n="pedidos.backToSearch">${t.backToSearch || 'Voltar à Busca'}</a>
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
            <div class="pagination-controls d-flex justify-content-between align-items-center mt-4">
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

    renderSearchResultsWithPagination(containerId, pedidos, currentPage, itemsPerPage, totalItems, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }

        let t = {};
        try {
            t = Translations[lang]?.pedidos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (pedidos.length > 0) {
            container.innerHTML = `
                <h3 class="search-results-title mb-3" data-i18n="pedidos.search">${t.search || 'Resultados da Busca'}</h3>
                <div class="row g-4">
                    ${pedidos.map((pedido) => `
                        <div class="col-md-6 col-lg-4">
                            <div class="card order-card h-100">
                                <div class="card-body p-4">
                                    <h5 class="card-title order-card-title mb-3">Pedido #${pedido.id}</h5>
                                    <div class="order-details">
                                        <p class="order-item"><i class="fas fa-calendar-alt me-2"></i><strong data-i18n="pedidos.dateFrom">${t.dateFrom || 'Data'}:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}</p>
                                        <p class="order-item"><i class="fas fa-info-circle me-2"></i><strong data-i18n="pedidos.status">${t.status || 'Estado'}:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}</p>
                                        <p class="order-item"><i class="fas fa-euro-sign me-2"></i><strong data-i18n="pedidos.total">${t.total || 'Total'}:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €</p>
                                        <p class="order-item"><i class="fas fa-shopping-cart me-2"></i><strong data-i18n="pedidos.items">${t.items || 'Itens'}:</strong> ${pedido.lineas ? pedido.lineas.length : '0'}</p>
                                    </div>
                                    <div class="order-actions mt-4 text-center">
                                        <button class="btn btn-primary btn-sm btn-ver-detalle" data-pedido-id="${pedido.id}" data-i18n="pedidos.viewDetails">${t.viewDetails || 'Ver Detalhes'}</button>
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
                <div class="alert alert-info mt-4" data-i18n="pedidos.noOrders">${t.noOrders || 'Nenhum pedido encontrado com os critérios fornecidos.'}</div>
            `;
        }
    },

    renderPedidos(containerId, pedidos, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML = this.getPedidosView(pedidos, lang);
    },

    renderSearchForm(containerId, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML = this.getSearchPedidosLayout(lang);
    },

    renderSearchResults(containerId, pedidos, currentPage = 1, itemsPerPage = 10, totalItems = 0, lang = 'pt') {
        this.renderSearchResultsWithPagination(containerId, pedidos, currentPage, itemsPerPage, totalItems, lang);
    },

    renderPedidoDetalhe(containerId, pedido, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado con ID: ${containerId}`);
            return;
        }
        container.innerHTML = this.getPedidoDetalheView(pedido, lang);
    },

    renderError(containerId, message, lang = 'pt') {
        const container = document.getElementById(containerId || "pro-inventario");
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId || "pro-inventario"}`);
            return;
        }

        let t = {};
        try {
            t = Translations[lang]?.pedidos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        container.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" data-i18n="pedidos.error">
                ${message || t.error || 'Ocurrió un error. Por favor, intenta de nuevo.'}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
};

export default PedidoView;