const PedidoView = {
    getPedidosView(pedidos) {
        return `
            <div class="container mt-4">
                <h2 class="mb-4 text-center">Meus Pedidos</h2>
                ${pedidos.length > 0 ? `
                    <div class="row">
                        ${pedidos.map((pedido) => `
                            <div class="col-md-6 mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Pedido #${pedido.id}</h5>
                                        <p class="card-text">
                                            <strong>Data:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}<br>
                                            <strong>Estado:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}<br>
                                            <strong>Total:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €<br>
                                            <strong>Itens:</strong> ${pedido.lineas ? pedido.lineas.length : '0'}
                                        </p>
                                        <div class="text-center">
                                            <button class="btn btn-primary btn-sm btn-ver-detalle" data-pedido-id="${pedido.id}">Ver Detalhes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="alert alert-info">
                        Nenhum pedido encontrado. Comece a comprar agora!
                        <a href="#produtos" class="btn btn-success btn-sm ms-2">Ver Produtos</a>
                    </div>
                `}
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
                <h2 class="mb-4 text-center">Detalhes do Pedido #${pedido.id}</h2>
                <div class="card">
                    <div class="card-body">
                        <p><strong>Data:</strong> ${pedido.fechaRealizacion ? new Date(pedido.fechaRealizacion).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Estado:</strong> ${pedido.tipoEstadoPedidoNombre || 'N/A'}</p>
                        <p><strong>Total:</strong> ${pedido.precio != null ? pedido.precio.toFixed(2) : '0.00'} €</p>
                        <h5>Itens do Pedido</h5>
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
                            `).join('') : '<li>Nenhum item encontrado.</li>'}
                        </ul>
                        <div class="text-center mt-3">
                            <a href="#pedidos" class="btn btn-secondary">Voltar aos Pedidos</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderPedidos(containerId, pedidos) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML = this.getPedidosView(pedidos);
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