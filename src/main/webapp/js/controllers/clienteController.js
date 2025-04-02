import ClienteView from "../views/clienteView.js";
import ClienteService from "../services/clienteService.js";

const ClienteController = {
	init(action) {
		console.log(`ClienteController.init(${action})...`);
		if (action === "perfil") {
			this.loadProfileForm();
			// Verificar si se actualizó el perfil y mostrar mensaje
			if (sessionStorage.getItem("profileUpdated")) {
				ClienteView.renderProfileUpdateSuccess("Perfil actualizado correctamente.");
				sessionStorage.removeItem("profileUpdated");
			}
		} else if (action === "direcciones") {
			this.loadAddresses();
		}
		this.setupEvents();
	},

	setupEvents() {
		console.log("ClienteController.setupEvents()...");
		document.addEventListener("click", (event) => {
			const deleteTarget = event.target.closest(".btn-delete-direccion");
			if (deleteTarget) {
				event.preventDefault();
				const direccionId = deleteTarget.dataset.direccionId;
				if (direccionId) {
					this.deleteAddress(direccionId);
				}
			}

			const createTarget = event.target.closest(".btn-create-direccion");
			if (createTarget) {
				event.preventDefault();
				this.showCreateAddressForm();
			}

			const editTarget = event.target.closest(".btn-edit-direccion");
			if (editTarget) {
				event.preventDefault();
				const direccionId = editTarget.dataset.direccionId;
				if (direccionId) {
					this.showEditAddressForm(direccionId);
				}
			}

			const saveNewAddress = event.target.closest("#saveNewAddress");
			if (saveNewAddress) {
				event.preventDefault();
				this.handleCreateAddressSubmit();
			}

			const saveEditedAddress = event.target.closest("#saveEditedAddress");
			if (saveEditedAddress) {
				event.preventDefault();
				this.handleEditAddressSubmit();
			}

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

	async deleteAddress(direccionId) {
		console.log(`Eliminando dirección ${direccionId}...`);
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}

			await ClienteService.deleteDireccion(clienteData.id, direccionId);
			clienteData.direcciones = clienteData.direcciones.filter(dir => dir.id != direccionId);
			sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			ClienteView.renderAddresses("pro-inventario", clienteData.direcciones);
			ClienteView.renderProfileUpdateSuccess("Dirección eliminada correctamente.");
		} catch (error) {
			console.error("Erro ao eliminar dirección:", error);
			ClienteView.renderError("Erro ao eliminar dirección. Por favor, tente novamente.");
		}
	},

	async showCreateAddressForm() {
		console.log("Mostrando formulario para crear nueva dirección...");
		ClienteView.renderModal("pro-inventario", ClienteView.getCreateAddressModal());
		const modal = new bootstrap.Modal(document.getElementById("createAddressModal"));
		modal.show();
	},

	async showEditAddressForm(direccionId) {
		console.log(`Mostrando formulario para editar dirección ${direccionId}...`);
		const clienteData = this.getStoredClienteData();
		const direccion = clienteData.direcciones.find(dir => dir.id == direccionId);
		if (direccion) {
			ClienteView.renderModal("pro-inventario", ClienteView.getEditAddressModal(direccion));
			const modal = new bootstrap.Modal(document.getElementById("editAddressModal"));
			modal.show();
		} else {
			ClienteView.renderError("Dirección no encontrada.");
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

	async handleCreateAddressSubmit() {
		const form = document.getElementById("createAddressForm");
		const formData = new FormData(form);
		const direccionData = {
			nombreVia: formData.get("nombreVia"),
			dirVia: formData.get("dirVia"),
			localidadId: parseInt(formData.get("localidadId"), 10)
		};

		await this.createAddress(direccionData);
		const modal = bootstrap.Modal.getInstance(document.getElementById("createAddressModal"));
		modal.hide();
	},

	async handleEditAddressSubmit() {
		const form = document.getElementById("editAddressForm");
		const formData = new FormData(form);
		const direccionData = {
			id: parseInt(formData.get("id"), 10),
			nombreVia: formData.get("nombreVia"),
			dirVia: formData.get("dirVia"),
			localidadId: parseInt(formData.get("localidadId"), 10)
		};

		await this.updateAddress(direccionData);
		const modal = bootstrap.Modal.getInstance(document.getElementById("editAddressModal"));
		modal.hide();
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

	async createAddress(direccionData) {
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}
			direccionData.clienteId = clienteData.id;
			const newDireccion = await ClienteService.createDireccion(direccionData);
			clienteData.direcciones.push(newDireccion);
			sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			ClienteView.renderAddresses("pro-inventario", clienteData.direcciones);
			ClienteView.renderProfileUpdateSuccess("Dirección creada correctamente.");
		} catch (error) {
			console.error("Erro ao criar dirección:", error);
			ClienteView.renderError("Erro ao criar dirección. Por favor, tente novamente.");
		}
	},

	async updateAddress(direccionData) {
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}
			const updatedDireccion = await ClienteService.updateDireccion(direccionData);
			clienteData.direcciones = clienteData.direcciones.map(dir =>
				dir.id == updatedDireccion.id ? updatedDireccion : dir);
			sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			ClienteView.renderAddresses("pro-inventario", clienteData.direcciones);
			ClienteView.renderProfileUpdateSuccess("Dirección actualizada correctamente.");
		} catch (error) {
			console.error("Erro ao atualizar dirección:", error);
			ClienteView.renderError("Erro ao atualizar dirección. Por favor, tente novamente.");
		}
	},

	async updateCliente(clienteData) {
	    try {
	        const updatedCliente = await ClienteService.updateCliente(clienteData);
	        sessionStorage.setItem("cliente", JSON.stringify(updatedCliente));
	        // Guardar un indicador de actualización exitosa
	        sessionStorage.setItem("profileUpdated", "true");
	        // Recargar la página manteniendo la URL actual
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