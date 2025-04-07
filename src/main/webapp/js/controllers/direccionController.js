import DireccionView from "../views/direccionView.js";
import DireccionService from "../services/direccionService.js";

const DireccionController = {
	init(action) {
		console.log(`DireccionesController.init(${action})...`);
		if (action === "direcciones") {
			this.loadAddresses();
		}
		this.setupEvents();
	},

	setupEvents() {
		console.log("DireccionesController.setupEvents()...");
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
		});
	},

	async loadAddresses() {
		console.log("Carregando direções do usuário...");
		try {
			let clienteData = this.getStoredClienteData();

			if (clienteData && clienteData.direcciones) {
				DireccionView.renderAddresses("pro-inventario", clienteData.direcciones);
			} else {
				DireccionView.renderError("Nenhuma direção cadastrada.");
			}
		} catch (error) {
			console.error("Erro ao carregar direções:", error);
			DireccionView.renderError("Erro ao carregar direções. Por favor, tente novamente.");
		}
	},

	async deleteAddress(direccionId) {
		console.log(`Eliminando dirección ${direccionId}...`);
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}
			await DireccionService.deleteDireccion(clienteData.id, direccionId);
			clienteData.direcciones = clienteData.direcciones.filter(dir => dir.id != direccionId);
			sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			DireccionView.renderAddresses("pro-inventario", clienteData.direcciones);
			DireccionView.renderProfileUpdateSuccess("Dirección eliminada correctamente.");
		} catch (error) {
			console.error("Erro ao eliminar dirección:", error);
			DireccionView.renderError("Erro ao eliminar dirección. Por favor, tente novamente.");
		}
	},

	async showCreateAddressForm() {
		console.log("Mostrando formulario para crear nueva dirección...");
		try {
			const localidades = await DireccionService.getLocalidades();
			console.log("Localidades cargadas:", localidades);
			if (!Array.isArray(localidades)) {
				console.error("Respuesta inválida de getLocalidades:", localidades);
				throw new Error("A lista de localidades não é válida");
			}

			DireccionView.renderModal("pro-inventario", DireccionView.getCreateAddressModal(localidades));
			const modal = new bootstrap.Modal(document.getElementById("createAddressModal"));
			modal.show();

			const localidadInput = document.getElementById("localidadInput");
			const localidadIdInput = document.getElementById("localidadId");
			localidadInput.addEventListener("input", () => {
				const selectedOption = Array.from(document.querySelectorAll("#localidadesList option"))
					.find(option => option.value === localidadInput.value);
				if (selectedOption) {
					localidadIdInput.value = selectedOption.getAttribute("data-id");
				} else {
					localidadIdInput.value = "";
				}
			});
		} catch (error) {
			console.error("Erro ao carregar localidades:", error);
			DireccionView.renderError("Erro ao carregar cidades. Por favor, tente novamente.");
		}
	},

	async handleCreateAddressSubmit() {
		const form = document.getElementById("createAddressForm");
		const formData = new FormData(form);
		const localidadId = parseInt(formData.get("localidadId"), 10);

		// Validate localidadId
		if (isNaN(localidadId)) {
			console.error("Invalid localidadId:", formData.get("localidadId"));
			DireccionView.renderError("Por favor, seleccione una localidad válida.");
			return;
		}

		// Construct the full payload expected by the backend
		const direccionData = {
			nombreVia: formData.get("nombreVia"),
			dirVia: formData.get("dirVia"),
			clienteId: this.getStoredClienteData().id,
			empleadoId: null, // Assuming null is allowed
			localidadId: localidadId,
			localidadNombre: formData.get("localidadInput") || "", // Use the selected locality name or fetch it
			provinciaId: 8, // Default or fetch from locality data
			provinciaNombre: "Barcelona", // Default or fetch
			paisId: 1, // Default or fetch
			paisNombre: "España" // Default or fetch
		};

		console.log("Datos enviados al servicio:", direccionData);
		await this.createAddress(direccionData);
		const modal = bootstrap.Modal.getInstance(document.getElementById("createAddressModal"));
		if (modal) modal.hide();
	},

	async showEditAddressForm(direccionId) {
		console.log(`Mostrando formulario para editar dirección ${direccionId}...`);
		const clienteData = this.getStoredClienteData();
		const direccion = clienteData.direcciones.find(dir => dir.id == direccionId);
		if (direccion) {
			DireccionView.renderModal("pro-inventario", DireccionView.getEditAddressModal(direccion));
			const modal = new bootstrap.Modal(document.getElementById("editAddressModal"));
			modal.show();
		} else {
			DireccionView.renderError("Dirección no encontrada.");
		}
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

	async updateAddress(direccionData) {
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}
			const updatedDireccion = await DireccionService.updateDireccion(direccionData);
			clienteData.direcciones = clienteData.direcciones.map(dir =>
				dir.id == updatedDireccion.id ? updatedDireccion : dir);
			sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			DireccionView.renderAddresses("pro-inventario", clienteData.direcciones);
			DireccionView.renderProfileUpdateSuccess("Dirección actualizada correctamente.");
		} catch (error) {
			console.error("Erro ao atualizar dirección:", error);
			DireccionView.renderError("Erro ao atualizar dirección. Por favor, tente novamente.");
		}
	},

	async createAddress(direccionData) {
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}
			direccionData.clienteId = clienteData.id;
			console.log("Datos enviados al servicio:", direccionData);

			const newDireccion = await DireccionService.createDireccion(direccionData);
			if (!newDireccion || !newDireccion.id) {
				throw new Error("Respuesta inválida del servicio al crear la dirección");
			}

			clienteData.direcciones = clienteData.direcciones || [];
			clienteData.direcciones.push(newDireccion);
			sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			DireccionView.renderAddresses("pro-inventario", clienteData.direcciones);
			DireccionView.renderProfileUpdateSuccess("Dirección creada correctamente.");
		} catch (error) {
			console.error("Erro ao criar dirección:", error.message || error);
			DireccionView.renderError("Erro ao criar dirección. Por favor, tente novamente.");
		}
	},



	getStoredClienteData() {
		const clienteData = sessionStorage.getItem("cliente");
		return clienteData ? JSON.parse(clienteData) : null;
	},
};

export default DireccionController;