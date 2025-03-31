import PedidoView from "../views/pedidoView.js";
import PedidoService from "../services/pedidoService.js";

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
	        const target = event.target.closest(".btn-ver-detalle");
	        if (target) {
	            event.preventDefault();
	            const pedidoId = target.dataset.pedidoId;
	            if (pedidoId) {
	                this.loadPedidoDetalle(pedidoId);
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
	        PedidoView.renderPedidoDetalhe("pro-inventario", pedido); // Corregido a 2 parámetros
	    } catch (error) {
	        console.error("Erro ao carregar detalhes do pedido:", error);
	        PedidoView.renderError("Erro ao carregar detalhes do pedido.");
	    }
	},

    getStoredClienteData() {
        const clienteData = sessionStorage.getItem("cliente");
        return clienteData ? JSON.parse(clienteData) : null;
    },
};

export default PedidoController;
