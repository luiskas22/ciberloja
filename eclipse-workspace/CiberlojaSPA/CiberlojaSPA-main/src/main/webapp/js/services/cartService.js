// services/cartService.js
const CartService = {
	async getCart(clienteId) {
        try {
            const cartData = localStorage.getItem(`cart_${clienteId}`);
            if (!cartData) {
                return { items: [], total: 0 };
            }
            
            const cart = JSON.parse(cartData);
            
            // Validar estructura del carrito
            if (!cart.items || !Array.isArray(cart.items)) {
                console.warn("Estructura de carrito inválida, creando uno nuevo");
                return { items: [], total: 0 };
            }
            
            // Calcular total si no existe o es incorrecto
            if (typeof cart.total !== 'number') {
                cart.total = cart.items.reduce((sum, item) => {
                    return sum + (item.product?.precio || 0) * (item.quantity || 0);
                }, 0);
            }
            
            return cart;
        } catch (error) {
            console.error("Error recuperando carrito:", error);
            return { items: [], total: 0 };
        }
    },

	async addToCart(clienteId, product, quantity = 1) {
		try {
			console.log(`CartService: Añadiendo producto al carrito:`, product);
			
			if (!clienteId) {
				throw new Error("ID de cliente no proporcionado");
			}
			
			if (!product || !product.id || !product.nombre || typeof product.precio !== 'number') {
				console.error("Datos de producto inválidos:", product);
				throw new Error("Datos de producto incompletos o inválidos");
			}
			
			const cart = await this.getCart(clienteId);
			const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
	
			if (existingItemIndex > -1) {
				cart.items[existingItemIndex].quantity += quantity;
			} else {
				cart.items.push({ product, quantity });
			}
	
			cart.total = cart.items.reduce((sum, item) => sum + (item.product.precio * item.quantity), 0);
			
			const cartString = JSON.stringify(cart);
			console.log(`Guardando carrito en localStorage: ${cartString}`);
			localStorage.setItem(`cart_${clienteId}`, cartString);
			
			return cart;
		} catch (error) {
			console.error("Error añadiendo al carrito:", error);
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