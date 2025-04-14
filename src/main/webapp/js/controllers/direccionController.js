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
			const [localidades, provincias] = await Promise.all([
				DireccionService.getLocalidades(),
				DireccionService.getProvincias()
			]);

			DireccionView.renderModal("pro-inventario",
				DireccionView.getCreateAddressModal(localidades, provincias));

			const modal = new bootstrap.Modal(document.getElementById("createAddressModal"));
			modal.show();

			// Filtrar localidades según provincia seleccionada
			const provinciaSelect = document.getElementById("provinciaSelect");
			const localidadSelect = document.getElementById("localidadSelect");

			provinciaSelect.addEventListener("change", () => {
				const provinciaId = provinciaSelect.value;
				localidadSelect.innerHTML = '<option value="">Seleccione una localidad</option>';

				if (provinciaId) {
					const filteredLocalidades = localidades.filter(loc => loc.provinciaId == provinciaId);
					filteredLocalidades.forEach(loc => {
						const option = document.createElement("option");
						option.value = loc.id;
						option.textContent = loc.nombre;
						localidadSelect.appendChild(option);
					});
				} else {
					// Mostrar todas las localidades si no se selecciona provincia
					localidades.forEach(loc => {
						const option = document.createElement("option");
						option.value = loc.id;
						option.textContent = loc.nombre;
						localidadSelect.appendChild(option);
					});
				}
			});
		} catch (error) {
			console.error("Erro ao carregar localidades:", error);
			DireccionView.renderError("Erro ao carregar cidades. Por favor, tente novamente.");
		}
	},

	async handleCreateAddressSubmit() {
		const form = document.getElementById("createAddressForm");
		if (!form) {
			DireccionView.renderError("Formulario no encontrado");
			return;
		}

		const formData = new FormData(form);
		const provinciaSelect = document.getElementById("provinciaSelect");
		const localidadSelect = document.getElementById("localidadSelect");

		// Validar selecciones
		if (!provinciaSelect.value || !localidadSelect.value) {
			DireccionView.renderError("Por favor, seleccione provincia y localidad");
			return;
		}

		// Obtener textos de las opciones seleccionadas
		const provinciaNombre = provinciaSelect.options[provinciaSelect.selectedIndex].text;
		const localidadNombre = localidadSelect.options[localidadSelect.selectedIndex].text;

		const direccionData = {
			nombreVia: formData.get("nombreVia"),
			dirVia: formData.get("dirVia"),
			clienteId: this.getStoredClienteData().id,
			localidadId: parseInt(localidadSelect.value, 10),
			localidadNombre: localidadNombre,
			provinciaId: parseInt(provinciaSelect.value, 10),
			provinciaNombre: provinciaNombre,
			paisId: 1, // Valor por defecto o puedes añadir select para país
			paisNombre: "España" // Valor por defecto
		};

		try {
			await this.createAddress(direccionData);
			const modal = bootstrap.Modal.getInstance(document.getElementById("createAddressModal"));
			if (modal) modal.hide();
		} catch (error) {
			console.error("Error al crear dirección:", error);
			DireccionView.renderError(error.message || "Error al crear dirección");
		}
	},

	async handleEditAddressSubmit() {
		const form = document.getElementById("editAddressForm");
		const formData = new FormData(form);
		const clienteData = this.getStoredClienteData();

		// Validaciones
		const id = parseInt(formData.get("id"), 10);
		const nombreVia = formData.get("nombreVia");
		const dirVia = formData.get("dirVia");
		const localidadId = parseInt(formData.get("localidadId"), 10);
		const provinciaId = parseInt(formData.get("provinciaId"), 10);
		const paisId = parseInt(formData.get("paisId"), 10);

		// Obtener nombres desde los selects
		const localidadSelect = document.getElementById("localidadSelect");
		const provinciaSelect = document.getElementById("provinciaSelect");
		const paisSelect = document.getElementById("paisSelect");

		// Validaciones
		if (!clienteData || !clienteData.id) {
			DireccionView.renderError("Usuario no identificado. Por favor, inicia sesión.");
			return;
		}
		if (isNaN(id)) {
			DireccionView.renderError("El ID de la dirección es inválido.");
			return;
		}
		if (!nombreVia || nombreVia.trim() === "") {
			DireccionView.renderError("El nombre de la vía es obligatorio.");
			return;
		}
		if (!dirVia || dirVia.trim() === "") {
			DireccionView.renderError("El número de la vía es obligatorio.");
			return;
		}
		if (isNaN(localidadId) || !localidadSelect.value) {
			DireccionView.renderError("Por favor, selecciona una localidad válida.");
			return;
		}
		if (isNaN(provinciaId) || !provinciaSelect.value) {
			DireccionView.renderError("Por favor, selecciona una provincia válida.");
			return;
		}
		if (isNaN(paisId) || !paisSelect.value) {
			DireccionView.renderError("Por favor, selecciona un país válido.");
			return;
		}

		// Obtener nombres desde los selects
		const localidadNombre = localidadSelect.options[localidadSelect.selectedIndex].text;
		const provinciaNombre = provinciaSelect.options[provinciaSelect.selectedIndex].text;
		const paisNombre = paisSelect.options[paisSelect.selectedIndex].text;

		// Construir el objeto direccionData
		const direccionData = {
			id: id,
			nombreVia: nombreVia,
			dirVia: dirVia,
			localidadId: localidadId,
			localidadNombre: localidadNombre,
			clienteId: clienteData.id,
			empleadoId: null,
			provinciaId: provinciaId,
			provinciaNombre: provinciaNombre,
			paisId: paisId,
			paisNombre: paisNombre
		};

		try {
			console.log("Enviando datos para actualizar dirección:", JSON.stringify(direccionData, null, 2));
			await this.updateAddress(direccionData);
			const modalElement = document.getElementById("editAddressModal");
			if (modalElement) {
				const modal = bootstrap.Modal.getInstance(modalElement);
				if (modal) {
					modal.hide();
					document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
					document.body.classList.remove('modal-open');
					document.body.style.overflow = '';
					document.body.style.paddingRight = '';
					modalElement.remove();
				} else {
					console.warn("No se pudo obtener la instancia del modal");
				}
			} else {
				console.warn("No se encontró el elemento #editAddressModal");
			}
			DireccionView.renderProfileUpdateSuccess("Dirección actualizada correctamente.");
		} catch (error) {
			console.error("Error al actualizar la dirección:", error);
			DireccionView.renderError(error.message || "No se pudo actualizar la dirección. Por favor, verifica los datos.");
		}
	},

	async showEditAddressForm(direccionId) {
		console.log(`Mostrando formulario para editar dirección ${direccionId}...`);
		const clienteData = this.getStoredClienteData();
		const direccion = clienteData.direcciones.find(dir => dir.id == direccionId);

		if (direccion) {
			try {
				const [localidades, provincias, paises] = await Promise.all([
					DireccionService.getLocalidades(),
					DireccionService.getProvincias(),
					DireccionService.getPaises()
				]);

				DireccionView.renderModal(
					"pro-inventario",
					DireccionView.getEditAddressModal(direccion, { localidades, provincias, paises })
				);

				const modal = new bootstrap.Modal(document.getElementById("editAddressModal"));
				modal.show();

				// Manejar cambios en los selects (opcional, si quieres filtrado en edición)
				const provinciaSelect = document.getElementById("provinciaSelect");
				const localidadSelect = document.getElementById("localidadSelect");

				provinciaSelect.addEventListener("change", () => {
					const provinciaId = provinciaSelect.value;
					const currentLocalidadId = localidadSelect.value;

					localidadSelect.innerHTML = '<option value="">Seleccione una localidad</option>';

					const filteredLocalidades = localidades.filter(loc => loc.provinciaId == provinciaId);
					filteredLocalidades.forEach(loc => {
						const option = document.createElement("option");
						option.value = loc.id;
						option.textContent = loc.nombre;
						option.selected = (loc.id == currentLocalidadId);
						localidadSelect.appendChild(option);
					});
				});
			} catch (error) {
				console.error("Error al mostrar el formulario de edición:", error);
				DireccionView.renderError("No se pudo cargar el formulario de edición.");
			}
		} else {
			DireccionView.renderError("Dirección no encontrada.");
		}
	},

	async updateAddress(direccionData) {
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error("Usuário não identificado. Por favor, faça login.");
			}
			const updatedDireccion = await DireccionService.updateDireccion(direccionData);
			console.log("Dirección actualizada recibida:", JSON.stringify(updatedDireccion, null, 2));
			if (!updatedDireccion || !updatedDireccion.id) {
				throw new Error("Respuesta inválida del servicio al actualizar la dirección");
			}
			clienteData.direcciones = clienteData.direcciones.map(dir =>
				dir.id == updatedDireccion.id ? updatedDireccion : dir);
			sessionStorage.setItem("cliente", JSON.stringify(clienteData));
			DireccionView.renderAddresses("pro-inventario", clienteData.direcciones);
		} catch (error) {
			console.error("Erro ao atualizar dirección:", error);
			DireccionView.renderError("Erro ao atualizar dirección. Por favor, tente novamente.");
			throw error;
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