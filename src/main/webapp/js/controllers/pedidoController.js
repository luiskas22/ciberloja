import PedidoView from "../views/pedidoView.js";
import PedidoService from "../services/pedidoService.js";
import ProductoView from "../views/productoView.js"; // Importamos ProductoView
import ProductoService from "../services/productoService.js"; // Asumimos que existe este servicio

const PedidoController = {
	init(action) {
		console.log(`PedidoController.init(${action})...`);
		if (action === "pedidos") {
			this.loadPedidos();
		}
		this.setupEvents();
	},

	setupEvents() {
		console.log("PedidoController.setupEvents()...");
		document.addEventListener("click", (event) => {
			// Manejo del botón "Ver Detalles" del pedido
			const detalleTarget = event.target.closest(".btn-ver-detalle");
			if (detalleTarget) {
				event.preventDefault();
				const pedidoId = detalleTarget.dataset.pedidoId;
				if (pedidoId) {
					this.loadPedidoDetalle(pedidoId);
				}
				return;
			}

			// Manejo del enlace al detalle del producto
			const productoTarget = event.target.closest(".producto-link");
			if (productoTarget) {
				event.preventDefault();
				const productoId = productoTarget.dataset.productoId;
				if (productoId) {
					this.loadProductoDetalle(productoId);
				}
			}
		});
	},

	async loadPedidos() {
		console.log("Carregando pedidos do usuário...");
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}

			const pedidos = await PedidoService.findPedidosByClienteId(clienteData.id);

			if (pedidos && pedidos.length > 0) {
				PedidoView.renderPedidos("pro-inventario", pedidos);
			} else {
				PedidoView.renderError("Nenhum pedido encontrado para este usuário.");
			}
		} catch (error) {
			console.error("Erro ao carregar pedidos:", error);
			PedidoView.renderError("Erro ao carregar pedidos. Por favor, tente novamente.");
		}
	},

	async loadPedidoDetalle(pedidoId) {
		console.log(`Carregando detalhes do pedido ${pedidoId}...`);
		try {
			const pedido = await PedidoService.findById(pedidoId);
			if (!pedido) {
				throw new Error("Pedido no encontrado");
			}
			PedidoView.renderPedidoDetalhe("pro-inventario", pedido);
		} catch (error) {
			console.error("Erro ao carregar detalhes do pedido:", error);
			PedidoView.renderError("Erro ao carregar detalhes do pedido.");
		}
	},

	async loadProductoDetalle(productoId) {
		console.log(`Carregando detalles del producto ${productoId}...`);
		try {
			const producto = await ProductoService.findById(productoId); // Asumimos este método existe
			if (!producto) {
				throw new Error("Producto no encontrado");
			}
			ProductoView.renderProductoDetails(producto, "pro-inventario");
		} catch (error) {
			console.error("Erro ao carregar detalles del producto:", error);
			PedidoView.renderError("Erro ao carregar detalles del producto.");
		}
	},

	getStoredClienteData() {
		const clienteData = sessionStorage.getItem("cliente");
		return clienteData ? JSON.parse(clienteData) : null;
	},

};

export default PedidoController;