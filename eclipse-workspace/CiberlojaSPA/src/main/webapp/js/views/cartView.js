import Translations from '../resources/translations.js'; // Adjust path as needed

const CartView = {
    renderCart(containerId, cart, lang = 'pt') {
        console.log('Rendering cart:', cart);
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor não encontrado com ID: ${containerId}`);
            return;
        }

        // Ensure cart.items is an array
        const items = Array.isArray(cart.items) ? cart.items : [];
        // Access translations safely
        let t = {};
        try {
            t = Translations[lang]?.cart || Translations[lang]?.productos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        container.innerHTML = `
            <div class="container cart-container mt-5">
                <h2 class="cart-title mb-4 text-center" data-i18n="cart.title">${t.title || 'O Seu Carrinho de Compras'}</h2>
                ${items.length === 0 ? `
                    <div class="alert alert-info text-center py-4" data-i18n="cart.empty">
                        <i class="fas fa-info-circle me-2"></i>
                        ${t.empty || 'O seu carrinho está vazio.'}
                        <div class="mt-3">
                            <a href="#produtos" class="btn btn-success btn-view-products" data-i18n="cart.viewProducts">${t.viewProducts || 'Ver Produtos'}</a>
                        </div>
                    </div>
                ` : `
                    ${this.renderCartItems(cart, lang)}
                    <div class="cart-actions text-center mt-4">
                        <button id="clear-cart-btn" class="btn btn-outline-danger me-2" data-i18n="cart.clear">${t.clear || 'Limpar Carrinho'}</button>
                        <button id="checkout-btn" class="btn btn-success" data-i18n="cart.checkout">${t.checkout || 'Finalizar Compra'}</button>
                    </div>
                `}
            </div>
        `;
    },

    renderCartItems(cart, lang = 'pt') {
        // Access translations safely
        let t = {};
        try {
            t = Translations[lang]?.cart || Translations[lang]?.productos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        return `
            <div class="cart-table-wrapper">
                <table class="table cart-table">
                    <thead>
                        <tr>
                            <th data-i18n="cart.product">${t.product || 'Produto'}</th>
                            <th data-i18n="cart.price">${t.price || 'Preço'}</th>
                            <th data-i18n="cart.quantity">${t.quantity || 'Quantidade'}</th>
                            <th data-i18n="cart.total">${t.total || 'Total'}</th>
                            <th data-i18n="cart.actions">${t.actions || 'Ações'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.items.map(item => {
                            const nombre = item.product.nombre || 'N/A';
                            const imageSrc = item.product.images && item.product.images.length > 0
                                ? `http://192.168.99.40:8080${item.product.images[0].url}`
                                : './img/placeholder.png';
                            return `
                                <tr class="cart-item">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="${imageSrc}" 
                                                 alt="${nombre}" 
                                                 class="cart-item-image me-3"
                                                 onerror="this.onerror=null; this.src='./img/placeholder.png'; console.error('Error loading image: ${imageSrc}');">
                                            <div class="cart-item-name">${nombre}</div>
                                        </div>
                                    </td>
                                    <td>€${item.product.precio.toFixed(2)}</td>
                                    <td>
                                        <div class="quantity-control">
                                            <input type="number" id="cart_quantity_${item.product.id}" 
                                                   value="${item.quantity}" min="1" max="${item.product.stockDisponible}" 
                                                   class="form-control quantity-input">
                                            <button class="update-quantity-btn btn btn-primary btn-sm mt-1" 
                                                    data-product-id="${item.product.id}" 
                                                    data-i18n="cart.update">${t.update || 'Atualizar'}</button>
                                        </div>
                                    </td>
                                    <td>€${(item.product.precio * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button class="remove-from-cart-btn btn btn-outline-danger btn-sm" 
                                                data-product-id="${item.product.id}" 
                                                data-i18n="cart.remove">${t.remove || 'Remover'}</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3"><strong data-i18n="cart.total">${t.total || 'Total'}</strong></td>
                            <td colspan="2"><strong>€${cart.total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    },

    getProductImageSrc(productId) {
        return `./img/${productId}.jpg`; // Kept for compatibility, but not used
    },

    renderError(containerId, message, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor '${containerId}' não encontrado`);
            return;
        }

        // Use a default message if translations are not available
        const defaultMessage = 'Ocorreu um erro. Por favor, tente novamente.';
        let localizedMessage = message;

        // Access translations safely
        let t = {};
        try {
            t = Translations[lang]?.alerts || Translations[lang]?.cart || {};
            if (!message) {
                localizedMessage = t.error_message || defaultMessage;
            }
        } catch (e) {
            console.warn('Translation not available, using default message');
            localizedMessage = message || defaultMessage;
        }

        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" data-i18n="alerts.error_message">
                ${localizedMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    },

    renderCheckoutSuccess(containerId, pedido, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor '${containerId}' não encontrado`);
            return;
        }

        // Access translations safely
        let t = {};
        try {
            t = Translations[lang]?.cart || Translations[lang]?.pedidos || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        container.innerHTML = `
            <div class="container checkout-success-container mt-5">
                <div class="alert alert-success checkout-success-alert">
                    <h3 class="checkout-success-title" data-i18n="cart.checkout_success">${t.checkout_success || 'Pedido Realizado com Sucesso!'}</h3>
                    <p data-i18n="cart.order_id" data-i18n-values='{ "id": "${pedido.id}" }'>${t.order_id?.replace('{id}', pedido.id) || `ID do Pedido: ${pedido.id}`}</p>
                    <p data-i18n="cart.total">${t.total || 'Total'}: €${pedido.precio.toFixed(2)}</p>
                    <p data-i18n="cart.thank_you">${t.thank_you || 'Obrigado pela sua compra!'}</p>
                    <div class="mt-3">
                        <a href="#pedidos" class="btn btn-primary btn-view-orders" data-i18n="cart.viewOrders">${t.viewOrders || 'Ver Pedidos'}</a>
                    </div>
                </div>
            </div>
        `;
    }
};

export default CartView;