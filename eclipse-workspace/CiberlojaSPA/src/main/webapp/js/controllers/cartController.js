import CartService from "../services/cartService.js";
import CartView from "../views/cartView.js";
import ProductoService from "../services/productoService.js";
import PedidoService from "../services/pedidoService.js";
import FileService from "../services/fileService.js"; // Import FileService
import Translations from '../resources/translations.js';

const CartController = {
    init(lang = 'pt') {
        console.log("CartController.init()...");
        this.currentLang = lang;
        this.loadCart();
        this.setupEvents();
        this.isProcessingCheckout = false;

        // Listen for language changes
        document.addEventListener('languageChange', (e) => {
            this.currentLang = e.detail.lang;
            if (window.location.hash === '#cart') {
                this.loadCart();
            }
        });
    },

    setupEvents() {
        console.log("CartController.setupEvents()...");

        // Use a single event handler to avoid duplicates
        const handleCartEvents = async (event) => {
            const target = event.target;

            // Add to cart from any page
            if (target.id === "addToCartBtn" || target.classList.contains("add-to-cart-btn")) {
                console.log("Botão de 'Adicionar ao carrinho' clicado");
                event.preventDefault();

                const productId = target.dataset.id;
                const productName = target.dataset.nombre;
                const productPrice = target.dataset.precio;

                console.log(`Dados do produto: ID=${productId}, Nome=${productName}, Preço=${productPrice}`);

                if (!productId || !productName || !productPrice) {
                    console.error("Dados do produto faltantes no botão:", target);
                    alert("Erro: Dados do produto incompletos");
                    return;
                }

                const product = {
                    id: productId,
                    nombre: productName,
                    precio: parseFloat(productPrice),
                    stockDisponible: 100 // Adjust as needed
                };

                await this.addToCart(productId, 1, product);
            }

            // Remove product from cart
            if (target.classList.contains("remove-from-cart-btn")) {
                event.preventDefault();
                const productId = target.dataset.productId;
                await this.removeFromCart(productId);
            }

            // Update quantity in cart
            if (target.classList.contains("update-quantity-btn")) {
                event.preventDefault();
                const productId = target.dataset.productId;
                const quantity = parseInt(document.getElementById(`cart_quantity_${productId}`).value) || 1;
                await this.updateQuantity(productId, quantity);
            }

            // Clear cart
            if (target.id === "clear-cart-btn") {
                event.preventDefault();
                await this.clearCart();
            }

            // Checkout with debounce logic
            if (target.id === "checkout-btn") {
                event.preventDefault();
                if (this.isProcessingCheckout) {
                    console.log("Checkout already in progress, ignoring click");
                    return;
                }

                target.disabled = true;
                target.innerHTML = "Processando...";
                this.isProcessingCheckout = true;

                try {
                    await this.checkout();
                } finally {
                    this.isProcessingCheckout = false;
                    if (document.getElementById("checkout-btn")) {
                        document.getElementById("checkout-btn").disabled = false;
                        document.getElementById("checkout-btn").innerHTML = Translations[this.currentLang].cart.checkout || "Finalizar Compra";
                    }
                }
            }
        };

        // Remove previous handlers to avoid duplicates
        document.removeEventListener("click", this.handleCartEvents);
        this.handleCartEvents = handleCartEvents; // Store reference
        document.addEventListener("click", handleCartEvents);
    },

    async loadCart() {
        console.log("Loading cart...");
        try {
            const clienteData = this.getStoredClienteData();
            if (!clienteData || !clienteData.id) {
                throw new Error(Translations[this.currentLang].alerts.error_user_not_identified || "User not identified. Please log in.");
            }
            const cart = await CartService.getCart(clienteData.id);

            // Fetch images for all products in the cart
            for (let item of cart.items) {
                try {
                    const images = await FileService.getImagesByProductoId(item.product.id);
                    item.product.images = images || [];
                } catch (imageError) {
                    console.warn(`Não foi possível carregar as imagens para o produto ${item.product.id}:`, imageError);
                    item.product.images = [];
                }
            }

            await CartView.renderCart("pro-inventario", cart, this.currentLang);
        } catch (error) {
            console.error("Error loading cart:", error);
            CartView.renderError("pro-inventario", error.message || Translations[this.currentLang].alerts.error_message || "Error loading cart.", this.currentLang);
        }
    },

    async addToCart(productId, quantity, product = null) {
        console.log(`Adding product ${productId} to cart with quantity ${quantity}...`);
        try {
            const clienteData = this.getStoredClienteData();
            if (!clienteData || !clienteData.id) {
                throw new Error(Translations[this.currentLang].alerts.loginCart || "Please log in to add items to cart.");
            }

            // If product is not provided, fetch it
            if (!product) {
                product = await ProductoService.findById(productId);
                if (!product) {
                    throw new Error(Translations[this.currentLang].alerts.productNotFound || "Product not found.");
                }
            }

            if (product.stockDisponible < quantity) {
                throw new Error(Translations[this.currentLang].alerts.insufficientStock || "Insufficient stock available.");
            }

            const cart = await CartService.addToCart(clienteData.id, product, quantity);

            // Fetch images for the added product
            for (let item of cart.items) {
                if (item.product.id === productId) {
                    try {
                        const images = await FileService.getImagesByProductoId(item.product.id);
                        item.product.images = images || [];
                    } catch (imageError) {
                        console.warn(`Não foi possível carregar as imagens para o produto ${item.product.id}:`, imageError);
                        item.product.images = [];
                    }
                }
            }

            await CartView.renderCart("pro-inventario", cart, this.currentLang);
            alert(`✅ Adicionado ${quantity} x ${product.nombre} ao carrinho!`);
        } catch (error) {
            console.error("Error adding to cart:", error);
            CartView.renderError("pro-inventario", error.message || Translations[this.currentLang].alerts.addProductError || "Error adding to cart.", this.currentLang);
        }
    },

    async removeFromCart(productId) {
        console.log(`Removing product ${productId} from cart...`);
        try {
            const clienteData = this.getStoredClienteData();
            const cart = await CartService.removeFromCart(clienteData.id, productId);

            // Fetch images for remaining products
            for (let item of cart.items) {
                try {
                    const images = await FileService.getImagesByProductoId(item.product.id);
                    item.product.images = images || [];
                } catch (imageError) {
                    console.warn(`Não foi possível carregar as imagens para o produto ${item.product.id}:`, imageError);
                    item.product.images = [];
                }
            }

            await CartView.renderCart("pro-inventario", cart, this.currentLang);
            alert(Translations[this.currentLang].alerts.productRemoved || "✅ Item removed from cart!");
        } catch (error) {
            console.error("Error removing from cart:", error);
            CartView.renderError("pro-inventario", error.message || Translations[this.currentLang].alerts.error_message || "Error removing item from cart.", this.currentLang);
        }
    },

    async updateQuantity(productId, quantity) {
        console.log(`Updating quantity for product ${productId} to ${quantity}...`);
        try {
            const clienteData = this.getStoredClienteData();
            const cart = await CartService.updateQuantity(clienteData.id, productId, quantity);

            // Fetch images for all products
            for (let item of cart.items) {
                try {
                    const images = await FileService.getImagesByProductoId(item.product.id);
                    item.product.images = images || [];
                } catch (imageError) {
                    console.warn(`Não foi possível carregar as imagens para o produto ${item.product.id}:`, imageError);
                    item.product.images = [];
                }
            }

            await CartView.renderCart("pro-inventario", cart, this.currentLang);
        } catch (error) {
            console.error("Error updating quantity:", error);
            CartView.renderError("pro-inventario", error.message || Translations[this.currentLang].alerts.error_message || "Error updating cart quantity.", this.currentLang);
        }
    },

    async clearCart() {
        console.log("Clearing cart...");
        try {
            const clienteData = this.getStoredClienteData();
            await CartService.clearCart(clienteData.id);
            await CartView.renderCart("pro-inventario", { items: [], total: 0 }, this.currentLang);
            alert(Translations[this.currentLang].alerts.cartCleared || "✅ Cart cleared!");
        } catch (error) {
            console.error("Error clearing cart:", error);
            CartView.renderError("pro-inventario", error.message || Translations[this.currentLang].alerts.error_message || "Error clearing cart.", this.currentLang);
        }
    },

    async checkout() {
        console.log("Processing checkout...");
        try {
            const clienteData = this.getStoredClienteData();
            if (!clienteData || !clienteData.id) {
                throw new Error(Translations[this.currentLang].alerts.loginCart || "Please log in to complete your purchase.");
            }
            const cart = await CartService.getCart(clienteData.id);
            if (!cart || cart.items.length === 0) {
                throw new Error(Translations[this.currentLang].alerts.emptyCart || "Cart is empty. Add items before checking out.");
            }

            const pedidoData = {
                clienteId: clienteData.id,
                lineas: cart.items.map(item => ({
                    productoId: item.product.id,
                    nombreProducto: item.product.nombre,
                    unidades: item.quantity,
                    precio: item.product.precio
                })),
                precio: cart.total,
                fechaRealizacion: new Date().toISOString(),
                tipoEstadoPedidoId: 1,
                tipoEstadoPedidoNombre: "Pendente"
            };

            console.log("Dados enviados ao backend:", JSON.stringify(pedidoData, null, 2));
            const pedido = await PedidoService.createPedido(pedidoData);
            await CartService.clearCart(clienteData.id);
            await CartView.renderCheckoutSuccess("pro-inventario", pedido, this.currentLang);
            alert(`${Translations[this.currentLang].alerts.orderSuccess || "✅ Order placed successfully!"} ID do Pedido: ${pedido.id}`);
        } catch (error) {
            console.error("Error during checkout:", error);
            CartView.renderError("pro-inventario", error.message || Translations[this.currentLang].alerts.error_message || "Error processing checkout.", this.currentLang);
        }
    },

    getStoredClienteData() {
        const clienteData = sessionStorage.getItem("cliente");
        return clienteData ? JSON.parse(clienteData) : null;
    }
};

export default CartController;