import ClienteView from "../views/clienteView.js";
import ClienteService from "../services/clienteService.js";

const ClienteController = {
	init(action) {
		console.log(`ClienteController.init(${action})...`);
		if (action === "perfil") {
			this.loadProfileForm();
			if (sessionStorage.getItem("profileUpdated")) {
				ClienteView.renderProfileUpdateSuccess("Perfil actualizado correctamente.");
				sessionStorage.removeItem("profileUpdated");
			}
		}
		this.setupEvents();
	},

	setupEvents() {
		console.log("ClienteController.setupEvents()...");
		document.addEventListener("click", (event) => {
			const editProfileTarget = event.target.closest(".btn-edit-profile");
			if (editProfileTarget) {
				event.preventDefault();
				this.showEditProfileForm();
			}

			const saveEditedProfile = event.target.closest("#saveEditedProfile");
			if (saveEditedProfile) {
				event.preventDefault();
				this.handleEditProfileSubmit();
			}
		});
	},

	async loadProfileForm() {
		console.log("Carregando formulário de perfil...");
		try {
			let clienteData = this.getStoredClienteData();
			if (!clienteData) {
				clienteData = await ClienteService.obterPerfil();
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

	async showEditProfileForm() {
		console.log("Mostrando formulario para editar perfil...");
		const clienteData = this.getStoredClienteData();
		if (clienteData) {
			ClienteView.renderModal("pro-inventario", ClienteView.getEditProfileModal(clienteData));
			const modal = new bootstrap.Modal(document.getElementById("editProfileModal"));
			modal.show();
		} else {
			ClienteView.renderError("Datos del cliente no disponibles. Por favor, recargue la página.");
		}
	},

	async handleEditProfileSubmit() {
		const form = document.getElementById("editProfileForm");
		const formData = new FormData(form);
		const clienteData = {
			id: parseInt(formData.get("id"), 10),
			nombre: formData.get("nombre"),
			apellido1: formData.get("apellido1"),
			apellido2: formData.get("apellido2") || null,
			nickname: formData.get("nickname"),
			email: formData.get("email"),
			dniNie: formData.get("dniNie"),
			telefono: formData.get("telefono") || null,
			password: formData.get("password") || null
		};

		try {
			await this.updateCliente(clienteData);
			const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
			if (modal) modal.hide();
		} catch (error) {
			console.error("Error en handleEditProfileSubmit:", error);
		}
	},

	async updateCliente(clienteData) {
		try {
			const updatedCliente = await ClienteService.updateCliente(clienteData);
			sessionStorage.setItem("cliente", JSON.stringify(updatedCliente));
			sessionStorage.setItem("profileUpdated", "true");
			window.location.href = window.location.href;
		} catch (error) {
			console.error("Erro ao atualizar cliente:", error);
			ClienteView.renderError("Erro ao atualizar cliente. Por favor, tente novamente.");
		}
	},

	getStoredClienteData() {
		const clienteData = sessionStorage.getItem("cliente");
		return clienteData ? JSON.parse(clienteData) : null;
	},
};

export default ClienteController;