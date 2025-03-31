import ClienteView from "../views/clienteView.js";
import ClienteService from "../services/clienteService.js";

const ClienteController = {
	init(action) {
		console.log(`ClienteController.init(${action})...`);
		if (action === "perfil") {
			this.loadProfileForm();
		} else if (action === "direcciones") {
			this.loadAddresses();
		}
		this.setupEvents();
	},

	setupEvents() {
		console.log("ClienteController.setupEvents()...");

		const mainContainer = document.getElementById("pro-inventario");
		if (mainContainer && !mainContainer.hasListener) {
			mainContainer.addEventListener("click", (event) => {
				// Adicionar eventos de interação conforme necessário
			});
			mainContainer.hasListener = true;
		}
	},

	async loadProfileForm() {
		console.log("Carregando formulário de perfil...");
		try {
			let clienteData = this.getStoredClienteData();

			// Se não tiver dados no sessionStorage, buscar do servidor
			if (!clienteData) {
				clienteData = await ClienteService.obterPerfil();
				// Salvar no sessionStorage
				sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			}

			if (clienteData) {
				ClienteView.renderProfile("pro-inventario", clienteData);
			} else {
				ClienteView.renderError("Não foi possível carregar os dados do perfil.");
			}
		} catch (error) {
			console.error("Erro ao carregar perfil:", error);
			ClienteView.renderError("Erro ao carregar perfil. Por favor, faça login novamente.");
		}
	},
	
	async loadAddresses() {
		console.log("Carregando direções do usuário...");
		try {
			let clienteData = this.getStoredClienteData();

			if (!clienteData) {
				clienteData = await ClienteService.obterPerfil();
				sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			}

			if (clienteData && clienteData.direcciones) {
				ClienteView.renderAddresses("pro-inventario", clienteData.direcciones);
			} else {
				ClienteView.renderError("Nenhuma direção cadastrada.");
			}
		} catch (error) {
			console.error("Erro ao carregar direções:", error);
			ClienteView.renderError("Erro ao carregar direções. Por favor, tente novamente.");
		}
	},
	
	getStoredClienteData() {
		const clienteData = sessionStorage.getItem("cliente");
		return clienteData ? JSON.parse(clienteData) : null;
	},
};

export default ClienteController;