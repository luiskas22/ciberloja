import DireccionView from '../views/direccionView.js';
import DireccionService from '../services/direccionService.js';
import Translations from '../resources/translations.js'; // Add this import


const DireccionController = {
	init(lang = 'pt') {
		console.log("DireccionController.init()...");
		this.currentLang = lang; // Almacenar idioma actual
		this.render();
		this.setupEvents();
		// Escuchar cambios de idioma
		document.addEventListener('languageChange', (e) => {
			this.currentLang = e.detail.lang;
			// Solo renderizar si estamos en la página de direcciones
			if (window.location.hash === '#mis-direcciones') {
			  this.render();
			}
		  });
	},

	render() {
		try {
			this.showAddressesPage();
		} catch (error) {
			console.error('Error rendering addresses:', error);
			DireccionView.renderError('pro-inventario', null, this.currentLang);
		}
	},

	setupEvents() {
		console.log("DireccionController.setupEvents()...");
		document.addEventListener('click', (event) => {
			const deleteTarget = event.target.closest('.btn-delete-direccion');
			if (deleteTarget) {
				event.preventDefault();
				const direccionId = deleteTarget.dataset.direccionId;
				if (direccionId) {
					this.deleteAddress(direccionId);
				}
			}

			const createTarget = event.target.closest('.btn-create-direccion');
			if (createTarget) {
				event.preventDefault();
				this.showCreateAddressForm();
			}

			const editTarget = event.target.closest('.btn-edit-direccion');
			if (editTarget) {
				event.preventDefault();
				const direccionId = editTarget.dataset.direccionId;
				if (direccionId) {
					this.showEditAddressForm(direccionId);
				}
			}

			const saveNewAddress = event.target.closest('#saveNewAddress');
			if (saveNewAddress) {
				event.preventDefault();
				this.handleCreateAddressSubmit();
			}

			const saveEditedAddress = event.target.closest('#saveEditedAddress');
			if (saveEditedAddress) {
				event.preventDefault();
				this.handleEditAddressSubmit();
			}
		});

		window.addEventListener('hashchange', () => {
			if (window.location.hash === '#direcciones') {
				this.showAddressesPage();
			}
		});
	},

	async showAddressesPage() {
		console.log('Showing addresses page...');
		const app = document.getElementById('pro-inventario');
		const homeContent = document.getElementById('home-content');
	
		if (homeContent) homeContent.style.display = 'none';
		if (app) {
			try {
				const clienteData = this.getStoredClienteData();
				console.log('Client data for address rendering:', clienteData);
				
				// Ensure direcciones is defined and an array
				const direcciones = clienteData && Array.isArray(clienteData.direcciones) 
					? clienteData.direcciones 
					: [];
					
				if (direcciones.length > 0) {
					DireccionView.renderAddresses('pro-inventario', direcciones, this.currentLang);
				} else {
					// Simple message without accessing Translations directly
					const message = 'No hay direcciones registradas.';
					DireccionView.renderError('pro-inventario', message, this.currentLang);
				}
				app.style.display = 'block';
			} catch (error) {
				console.error('Error loading addresses:', error);
				DireccionView.renderError('pro-inventario', 'Error al cargar direcciones.', this.currentLang);
			}
		}
	
	},

	async deleteAddress(direccionId) {
		console.log(`Eliminando dirección ${direccionId}...`);
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error(Translations[this.currentLang].direcciones.error_user_not_identified || 'Usuario no identificado. Por favor, inicia sesión.');
			}
			if (!direccionId || isNaN(direccionId)) {
				throw new Error('ID de dirección inválido');
			}
			await DireccionService.deleteDireccion(clienteData.id, direccionId);
			clienteData.direcciones = clienteData.direcciones.filter(dir => dir.id != direccionId);
			sessionStorage.setItem('cliente', JSON.stringify(clienteData));
			DireccionView.renderAddresses('pro-inventario', clienteData.direcciones, this.currentLang);
			DireccionView.renderProfileUpdateSuccess('pro-inventario', Translations[this.currentLang].direcciones.delete_success || 'Dirección eliminada correctamente.', this.currentLang);
		} catch (error) {
			console.error('Error al eliminar dirección:', error);
			const errorMessage = error.message || Translations[this.currentLang].direcciones.delete_error || 'Error al eliminar dirección. Por favor, intenta de nuevo.';
			DireccionView.renderError('pro-inventario', errorMessage, this.currentLang);
		}
	},

	async showCreateAddressForm() {
		console.log('Mostrando formulario para crear nueva dirección...');
		try {
			const [localidades, provincias] = await Promise.all([
				DireccionService.getLocalidades(),
				DireccionService.getProvincias()
			]);

			DireccionView.renderCreateAddressModal('pro-inventario', localidades, provincias, this.currentLang);

			const modal = new bootstrap.Modal(document.getElementById('createAddressModal'));
			modal.show();

			// Filtrar localidades según provincia seleccionada
			const provinciaSelect = document.getElementById('provinciaSelect');
			const localidadSelect = document.getElementById('localidadSelect');

			provinciaSelect.addEventListener('change', () => {
				const provinciaId = provinciaSelect.value;
				localidadSelect.innerHTML = `<option value="" data-i18n="direcciones.select_city">${Translations[this.currentLang].direcciones.select_city || 'Seleccione una ciudad'}</option>`;

				if (provinciaId) {
					const filteredLocalidades = localidades.filter(loc => loc.provinciaId == provinciaId);
					filteredLocalidades.forEach(loc => {
						const option = document.createElement('option');
						option.value = loc.id;
						option.textContent = loc.nombre;
						localidadSelect.appendChild(option);
					});
				} else {
					localidades.forEach(loc => {
						const option = document.createElement('option');
						option.value = loc.id;
						option.textContent = loc.nombre;
						localidadSelect.appendChild(option);
					});
				}
			});
		} catch (error) {
			console.error('Error al cargar ciudades:', error);
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.load_cities_error || 'Error al cargar ciudades. Por favor, intenta de nuevo.', this.currentLang);
		}
	},

	async handleCreateAddressSubmit() {
		const form = document.getElementById('createAddressForm');
		if (!form) {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.form_not_found || 'Formulario no encontrado', this.currentLang);
			return;
		}

		const formData = new FormData(form);
		const provinciaSelect = document.getElementById('provinciaSelect');
		const localidadSelect = document.getElementById('localidadSelect');

		// Validar selecciones
		if (!provinciaSelect.value || !localidadSelect.value) {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.select_province_city || 'Por favor, selecciona provincia y ciudad', this.currentLang);
			return;
		}

		// Obtener textos de las opciones seleccionadas
		const provinciaNombre = provinciaSelect.options[provinciaSelect.selectedIndex].text;
		const localidadNombre = localidadSelect.options[localidadSelect.selectedIndex].text;

		const direccionData = {
			nombreVia: formData.get('nombreVia'),
			dirVia: formData.get('dirVia'),
			clienteId: this.getStoredClienteData().id,
			localidadId: parseInt(localidadSelect.value, 10),
			localidadNombre: localidadNombre,
			provinciaId: parseInt(provinciaSelect.value, 10),
			provinciaNombre: provinciaNombre,
			paisId: 1, // Valor por defecto
			paisNombre: 'España' // Valor por defecto
		};

		try {
			await this.createAddress(direccionData);
			const modal = bootstrap.Modal.getInstance(document.getElementById('createAddressModal'));
			if (modal) modal.hide();
		} catch (error) {
			console.error('Error al crear dirección:', error);
			DireccionView.renderError('pro-inventario', error.message || Translations[this.currentLang].direcciones.create_error || 'Error al crear dirección', this.currentLang);
		}
	},

	async handleEditAddressSubmit() {
		const form = document.getElementById('editAddressForm');
		const formData = new FormData(form);
		const clienteData = this.getStoredClienteData();

		// Validaciones
		const id = parseInt(formData.get('id'), 10);
		const nombreVia = formData.get('nombreVia');
		const dirVia = formData.get('dirVia');
		const localidadId = parseInt(formData.get('localidadId'), 10);
		const provinciaId = parseInt(formData.get('provinciaId'), 10);
		const paisId = parseInt(formData.get('paisId'), 10);

		// Obtener nombres desde los selects
		const localidadSelect = document.getElementById('localidadSelect');
		const provinciaSelect = document.getElementById('provinciaSelect');
		const paisSelect = document.getElementById('paisSelect');

		// Validaciones
		if (!clienteData || !clienteData.id) {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.error_user_not_identified || 'Usuario no identificado. Por favor, inicia sesión.', this.currentLang);
			return;
		}
		if (isNaN(id)) {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.invalid_id || 'El ID de la dirección es inválido.', this.currentLang);
			return;
		}
		if (!nombreVia || nombreVia.trim() === '') {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.street_required || 'El nombre de la calle es obligatorio.', this.currentLang);
			return;
		}
		if (!dirVia || dirVia.trim() === '') {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.number_required || 'El número de la calle es obligatorio.', this.currentLang);
			return;
		}
		if (isNaN(localidadId) || !localidadSelect.value) {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.select_city_valid || 'Por favor, selecciona una ciudad válida.', this.currentLang);
			return;
		}
		if (isNaN(provinciaId) || !provinciaSelect.value) {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.select_province_valid || 'Por favor, selecciona una provincia válida.', this.currentLang);
			return;
		}
		if (isNaN(paisId) || !paisSelect.value) {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.select_country_valid || 'Por favor, selecciona un país válido.', this.currentLang);
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
			console.log('Enviando datos para actualizar dirección:', JSON.stringify(direccionData, null, 2));
			await this.updateAddress(direccionData);
			const modalElement = document.getElementById('editAddressModal');
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
					console.warn('No se pudo obtener la instancia del modal');
				}
			} else {
				console.warn('No se encontró el elemento #editAddressModal');
			}
			DireccionView.renderProfileUpdateSuccess('pro-inventario', Translations[this.currentLang].direcciones.update_success || 'Dirección actualizada correctamente.', this.currentLang);
		} catch (error) {
			console.error('Error al actualizar la dirección:', error);
			DireccionView.renderError('pro-inventario', error.message || Translations[this.currentLang].direcciones.update_error || 'No se pudo actualizar la dirección. Por favor, verifica los datos.', this.currentLang);
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

				DireccionView.renderEditAddressModal(
					'pro-inventario',
					direccion,
					{ localidades, provincias, paises },
					this.currentLang
				);

				const modal = new bootstrap.Modal(document.getElementById('editAddressModal'));
				modal.show();

				// Manejar cambios en los selects
				const provinciaSelect = document.getElementById('provinciaSelect');
				const localidadSelect = document.getElementById('localidadSelect');

				provinciaSelect.addEventListener('change', () => {
					const provinciaId = provinciaSelect.value;
					const currentLocalidadId = localidadSelect.value;

					localidadSelect.innerHTML = `<option value="" data-i18n="direcciones.select_city">${Translations[this.currentLang].direcciones.select_city || 'Seleccione una ciudad'}</option>`;

					const filteredLocalidades = localidades.filter(loc => loc.provinciaId == provinciaId);
					filteredLocalidades.forEach(loc => {
						const option = document.createElement('option');
						option.value = loc.id;
						option.textContent = loc.nombre;
						option.selected = (loc.id == currentLocalidadId);
						localidadSelect.appendChild(option);
					});
				});
			} catch (error) {
				console.error('Error al mostrar el formulario de edición:', error);
				DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.edit_form_error || 'No se pudo cargar el formulario de edición.', this.currentLang);
			}
		} else {
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.address_not_found || 'Dirección no encontrada.', this.currentLang);
		}
	},

	async updateAddress(direccionData) {
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error(Translations[this.currentLang].direcciones.error_user_not_identified || 'Usuario no identificado. Por favor, inicia sesión.');
			}
			const updatedDireccion = await DireccionService.updateDireccion(direccionData);
			console.log('Dirección actualizada recibida:', JSON.stringify(updatedDireccion, null, 2));
			if (!updatedDireccion || !updatedDireccion.id) {
				throw new Error(Translations[this.currentLang].direcciones.invalid_response_update || 'Respuesta inválida del servicio al actualizar la dirección');
			}
			clienteData.direcciones = clienteData.direcciones.map(dir =>
				dir.id == updatedDireccion.id ? updatedDireccion : dir);
			sessionStorage.setItem('cliente', JSON.stringify(clienteData));
			DireccionView.renderAddresses('pro-inventario', clienteData.direcciones, this.currentLang);
		} catch (error) {
			console.error('Error al actualizar dirección:', error);
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.update_error || 'Error al actualizar dirección. Por favor, intenta de nuevo.', this.currentLang);
			throw error;
		}
	},

	async createAddress(direccionData) {
		try {
			const clienteData = this.getStoredClienteData();
			if (!clienteData || !clienteData.id) {
				throw new Error(Translations[this.currentLang].direcciones.error_user_not_identified || 'Usuario no identificado. Por favor, inicia sesión.');
			}
			direccionData.clienteId = clienteData.id;
			console.log('Datos enviados al servicio:', direccionData);

			const newDireccion = await DireccionService.createDireccion(direccionData);
			if (!newDireccion || !newDireccion.id) {
				throw new Error(Translations[this.currentLang].direcciones.invalid_response_create || 'Respuesta inválida del servicio al crear la dirección');
			}

			clienteData.direcciones = clienteData.direcciones || [];
			clienteData.direcciones.push(newDireccion);
			sessionStorage.setItem('cliente', JSON.stringify(clienteData));
			DireccionView.renderAddresses('pro-inventario', clienteData.direcciones, this.currentLang);
			DireccionView.renderProfileUpdateSuccess('pro-inventario', Translations[this.currentLang].direcciones.create_success || 'Dirección creada correctamente.', this.currentLang);
		} catch (error) {
			console.error('Error al crear dirección:', error.message || error);
			DireccionView.renderError('pro-inventario', Translations[this.currentLang].direcciones.create_error || 'Error al crear dirección. Por favor, intenta de nuevo.', this.currentLang);
			throw error;
		}
	},

	getStoredClienteData() {
		const clienteData = sessionStorage.getItem('cliente');
		return clienteData ? JSON.parse(clienteData) : { id: null, direcciones: [] };
	}
};

export default DireccionController;