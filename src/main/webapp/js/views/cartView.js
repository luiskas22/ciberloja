// views/cartView.js
const CartView = {
	renderCart(containerId, cart) {
		const container = document.getElementById(containerId);
		if (!container) return;

		container.innerHTML = `
            <h2>Your Shopping Cart</h2>
            ${cart.items.length === 0 ? '<p>Your cart is empty.</p>' : this.renderCartItems(cart)}
            ${cart.items.length > 0 ? `
                <div class="cart-actions">
                    <button id="clear-cart-btn" class="btn btn-danger">Clear Cart</button>
                    <button id="checkout-btn" class="btn btn-success">Checkout</button>
                </div>
            ` : ''}
        `;
	},

	renderCartItems(cart) {
		return `
	        <table class="table">
	            <thead>
	                <tr>
	                    <th>Product</th>
	                    <th>Price</th>
	                    <th>Quantity</th>
	                    <th>Total</th>
	                    <th>Actions</th>
	                </tr>
	            </thead>
	            <tbody>
	                ${cart.items.map(item => `
	                    <tr>
	                        <td>
	                            <div class="d-flex align-items-center">
	                                <img src="${this.getProductImageSrc(item.product.id)}" 
	                                     alt="${item.product.nombre}" 
	                                     class="me-3" 
	                                     style="width: 60px; height: 60px; object-fit: contain;"
	                                     onerror="this.onerror=null; this.src='./img/placeholder.png';">
	                                <div>${item.product.nombre}</div>
	                            </div>
	                        </td>
	                        <td>$${item.product.precio.toFixed(2)}</td>
	                        <td>
	                            <input type="number" id="cart_quantity_${item.product.id}" 
	                                value="${item.quantity}" min="1" max="${item.product.stockDisponible}" 
	                                class="form-control" style="width: 80px;">
	                            <button class="update-quantity-btn btn btn-primary btn-sm" 
	                                data-product-id="${item.product.id}">Update</button>
	                        </td>
	                        <td>$${(item.product.precio * item.quantity).toFixed(2)}</td>
	                        <td>
	                            <button class="remove-from-cart-btn btn btn-danger btn-sm" 
	                                data-product-id="${item.product.id}">Remove</button>
	                        </td>
	                    </tr>
	                `).join('')}
	            </tbody>
	            <tfoot>
	                <tr>
	                    <td colspan="3"><strong>Total</strong></td>
	                    <td colspan="2"><strong>$${cart.total.toFixed(2)}</strong></td>
	                </tr>
	            </tfoot>
	        </table>
	    `;
	},

	// Añade esta función para obtener la ruta de la imagen del producto
	getProductImageSrc(productId) {
		// Aquí puedes implementar la lógica para obtener la imagen del producto
		// Por ejemplo:
		return `./img/${productId}.jpg`; // o la ruta que uses en tu aplicación
	},
	renderError(message) {
		const container = document.getElementById("pro-inventario");
		if (!container) return;

		container.innerHTML = `
            <div class="alert alert-danger">${message}</div>
        `;
	},

	renderCheckoutSuccess(containerId, pedido) {
		const container = document.getElementById(containerId);
		if (!container) return;

		container.innerHTML = `
            <div class="alert alert-success">
                <h3>Order Placed Successfully!</h3>
                <p>Order ID: ${pedido.id}</p>
                <p>Total: $${pedido.total.toFixed(2)}</p>
                <p>Thank you for your purchase!</p>
            </div>
        `;
	}
};

export default CartView;