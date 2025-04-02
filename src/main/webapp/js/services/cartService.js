// services/cartService.js
const CartService = {
	async getCart(clienteId) {
		try {
			const cart = localStorage.getItem(`cart_${clienteId}`);
			return cart ? JSON.parse(cart) : { items: [], total: 0 };
		} catch (error) {
			console.error("Error retrieving cart:", error);
			return { items: [], total: 0 };
		}
	},

	async addToCart(clienteId, product, quantity = 1) {
		try {
			const cart = await this.getCart(clienteId);
			const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);

			if (existingItemIndex > -1) {
				cart.items[existingItemIndex].quantity += quantity;
			} else {
				cart.items.push({ product, quantity });
			}

			cart.total = cart.items.reduce((sum, item) => sum + (item.product.precio * item.quantity), 0);
			localStorage.setItem(`cart_${clienteId}`, JSON.stringify(cart));
			return cart;
		} catch (error) {
			console.error("Error adding to cart:", error);
			throw error;
		}
	},

	async removeFromCart(clienteId, productId) {
		try {
			const cart = await this.getCart(clienteId);
			cart.items = cart.items.filter(item => item.product.id !== productId);
			cart.total = cart.items.reduce((sum, item) => sum + (item.product.precio * item.quantity), 0);
			localStorage.setItem(`cart_${clienteId}`, JSON.stringify(cart));
			return cart;
		} catch (error) {
			console.error("Error removing from cart:", error);
			throw error;
		}
	},

	async clearCart(clienteId) {
		try {
			localStorage.removeItem(`cart_${clienteId}`);
			return { items: [], total: 0 };
		} catch (error) {
			console.error("Error clearing cart:", error);
			throw error;
		}
	},

	async updateQuantity(clienteId, productId, quantity) {
		try {
			const cart = await this.getCart(clienteId);
			const itemIndex = cart.items.findIndex(item => item.product.id === productId);

			if (itemIndex > -1) {
				if (quantity <= 0) {
					cart.items.splice(itemIndex, 1);
				} else {
					cart.items[itemIndex].quantity = quantity;
				}
				cart.total = cart.items.reduce((sum, item) => sum + (item.product.precio * item.quantity), 0);
				localStorage.setItem(`cart_${clienteId}`, JSON.stringify(cart));
			}
			return cart;
		} catch (error) {
			console.error("Error updating quantity:", error);
			throw error;
		}
	}
};

export default CartService;