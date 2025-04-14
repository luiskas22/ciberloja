// controllers/cartController.js
import CartService from "../services/cartService.js";
import CartView from "../views/cartView.js";
import ProductoService from "../services/productoService.js";
import PedidoService from "../services/pedidoService.js"; // Para crear el pedido al finalizar

const CartController = {
	init() {
		console.log("CartController.init()...");

		// Elimina esta verificación o modifícala para que funcione con tus URLs
		// const hash = window.location.hash;
		// if (hash !== "#cart") {
		//     console.log("No está en la página del carrito, omitiendo inicialización.");
		//     return;
		// }

		this.loadCart();
		this.setupEvents();
		// Flag to prevent multiple checkout submissions
		this.isProcessingCheckout = false;
	},

	setupEvents() {
		console.log("CartController.setupEvents()...");

		// Usamos un solo manejador de eventos para evitar duplicados
		const handleCartEvents = async (event) => {
			const target = event.target;

			// Añadir al carrito desde cualquier página
			if (target.id === "addToCartBtn" || target.classList.contains("add-to-cart-btn")) {
				console.log("Botón de 'Añadir al carrito' pulsado");
				event.preventDefault();

				const productId = target.dataset.id;
				const productName = target.dataset.nombre;
				const productPrice = target.dataset.precio;

				console.log(`Datos del producto: ID=${productId}, Nombre=${productName}, Precio=${productPrice}`);

				if (!productId || !productName || !productPrice) {
					console.error("Datos del producto faltantes en el botón:", target);
					alert("Error: Datos del producto incompletos");
					return;
				}

				const product = {
					id: productId,
					nombre: productName,
					precio: parseFloat(productPrice),
					stockDisponible: 100 // Ajustar según necesidad
				};

				await this.addToCart(productId, 1, product);
			}

			// Eliminar producto del carrito
			if (target.classList.contains("remove-from-cart-btn")) {
				event.preventDefault();
				const productId = target.dataset.productId;
				await this.removeFromCart(productId);
			}

			// Actualizar cantidad en el carrito
			if (target.classList.contains("update-quantity-btn")) {
				event.preventDefault();
				const productId = target.dataset.productId;
				const quantity = parseInt(document.getElementById(`cart_quantity_${productId}`).value) || 1;
				await this.updateQuantity(productId, quantity);
			}

			// Vaciar carrito
			if (target.id === "clear-cart-btn") {
				event.preventDefault();
				await this.clearCart();
			}

			// Finalizar compra con lógica de debounce
			if (target.id === "checkout-btn") {
				event.preventDefault();
				if (this.isProcessingCheckout) {
					console.log("Checkout already in progress, ignoring click");
					return;
				}

				target.disabled = true;
				target.innerHTML = "Processing...";
				this.isProcessingCheckout = true;

				try {
					await this.checkout();
				} finally {
					this.isProcessingCheckout = false;
					if (document.getElementById("checkout-btn")) {
						document.getElementById("checkout-btn").disabled = false;
						document.getElementById("checkout-btn").innerHTML = "Checkout";
					}
				}
			}
		};

		// Remover manejadores previos para evitar duplicados
		document.removeEventListener("click", this.handleCartEvents);
		this.handleCartEvents = handleCartEvents; // Guardamos referencia
		document.addEventListener("click", handleCartEvents);
	},

	async loadCart() {
		console.log("Loading cart...");
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("User not identified. Please log in.");
			}
			const cart = await CartService.getCart(clienteData.id);
			CartView.renderCart("pro-inventario", cart);
		} catch (error) {
			console.error("Error loading cart:", error);
			CartView.renderError("Error loading cart. Please try again.");
		}
	},

	async addToCart(productId, quantity, product = null) {
		console.log(`Adding product ${productId} to cart with quantity ${quantity}...`);
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Please log in to add items to cart.");
			}

			// Si no nos pasan el producto, lo buscamos
			if (!product) {
				product = await ProductoService.findById(productId);
				if (!product) {
					throw new Error("Product not found.");
				}
			}

			if (product.stockDisponible < quantity) {
				throw new Error("Insufficient stock available.");
			}

			const cart = await CartService.addToCart(clienteData.id, product, quantity);
			CartView.renderCart("pro-inventario", cart);
			alert(`✅ Added ${quantity} x ${product.nombre} to cart!`);
		} catch (error) {
			console.error("Error adding to cart:", error);
			CartView.renderError(error.message || "Error adding to cart.");
		}
	},

	async removeFromCart(productId) {
		console.log(`Removing product ${productId} from cart...`);
		try {
			const clienteData = this.getStoredClienteData();
			const cart = await CartService.removeFromCart(clienteData.id, productId);
			CartView.renderCart("pro-inventario", cart);
			alert("✅ Item removed from cart!");
		} catch (error) {
			console.error("Error removing from cart:", error);
			CartView.renderError("Error removing item from cart.");
		}
	},

	async updateQuantity(productId, quantity) {
		console.log(`Updating quantity for product ${productId} to ${quantity}...`);
		try {
			const clienteData = this.getStoredClienteData();
			const cart = await CartService.updateQuantity(clienteData.id, productId, quantity);
			CartView.renderCart("pro-inventario", cart);
		} catch (error) {
			console.error("Error updating quantity:", error);
			CartView.renderError("Error updating cart quantity.");
		}
	},

	async clearCart() {
		console.log("Clearing cart...");
		try {
			const clienteData = this.getStoredClienteData();
			await CartService.clearCart(clienteData.id);
			CartView.renderCart("pro-inventario", { items: [], total: 0 });
			alert("✅ Cart cleared!");
		} catch (error) {
			console.error("Error clearing cart:", error);
			CartView.renderError("Error clearing cart.");
		}
	},

	async checkout() {
		console.log("Processing checkout...");
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Please log in to complete your purchase.");
			}
			const cart = await CartService.getCart(clienteData.id);
			if (!cart || cart.items.length === 0) {
				throw new Error("Cart is empty. Add items before checking out.");
			}

			const pedidoData = {
				clienteId: clienteData.id,
				lineas: cart.items.map(item => ({
					productoId: item.product.id,
					nombreProducto: item.product.nombre, // Añadir esta línea
					unidades: item.quantity,
					precio: item.product.precio
				})),
				precio: cart.total,
				fechaRealizacion: new Date().toISOString(),
				tipoEstadoPedidoId: 1,
				tipoEstadoPedidoNombre: "Pendiente"
			};

			console.log("Datos enviados al backend:", JSON.stringify(pedidoData, null, 2));
			const pedido = await PedidoService.createPedido(pedidoData);
			await CartService.clearCart(clienteData.id);
			CartView.renderCheckoutSuccess("pro-inventario", pedido);
			alert("✅ Order placed successfully! Order ID: " + pedido.id);
		} catch (error) {
			console.error("Error during checkout:", error);
			CartView.renderError(error.message || "Error processing checkout.");
		}
	},

	getStoredClienteData() {
		const clienteData = sessionStorage.getItem("cliente");
		return clienteData ? JSON.parse(clienteData) : null;
	}
};

export default CartController;