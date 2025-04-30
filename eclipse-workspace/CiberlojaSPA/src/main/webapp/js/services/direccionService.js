import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

// Crear una instancia de ApiClient
const apiClient = new ApiClient();

// Crear una instancia de DefaultApi
const defaultApi = new DefaultApi(apiClient);

const DireccionService = {
	/**
	 * Elimina una dirección específica de un cliente.
	 * @param {number} clienteId - El ID del cliente.
	 * @param {number} direccionId - El ID de la dirección a eliminar.
	 * @returns {Promise<Object>} Promesa que resuelve con la respuesta de la API.
	 */
	async deleteDireccion(clienteId, direccionId) {
		return new Promise((resolve, reject) => {
			console.log(`Eliminando dirección ${direccionId} del cliente ${clienteId}...`);

			// Create the options object with the query parameter
			const opts = {
				'id': direccionId // Pass direccionId as a query parameter named 'id'
			};

			defaultApi.deleteDireccion(opts, (error, data, response) => {
				if (error) {
					console.error(`Error al eliminar dirección ${direccionId} del cliente ${clienteId}:`, error);
					reject(error);
				} else {
					console.log(`Dirección ${direccionId} eliminada con éxito.`);
					resolve(data);
				}
			});
		});
	},

	async createDireccion(direccion) {
		return new Promise((resolve, reject) => {
			console.log("Creando nueva dirección:", direccion);

			// Verificar que la dirección tenga los campos obligatorios
			if (!direccion || !direccion.nombreVia || !direccion.dirVia || !direccion.localidadId || !direccion.clienteId) {
				reject(new Error("La dirección debe contener nombreVia, dirVia, localidadId y clienteId válidos"));
				return;
			}

			console.log("JSON a enviar:", JSON.stringify(direccion, null, 2));

			try {
				// Use fetch API for consistency with updateDireccion method
				fetch(`http://192.168.99.40:8080/ciberloja-rest-api/api/direccion/create`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					body: JSON.stringify(direccion)
				})
					.then(response => {
						if (!response.ok) {
							// Handle various error responses based on status code
							if (response.status === 400) {
								throw new Error("Datos de dirección inválidos. Verifica que todos los campos requeridos sean correctos.");
							} else if (response.status === 500) {
								throw new Error("Error interno del servidor. Por favor, intenta más tarde.");
							} else {
								throw new Error(`Error al crear la dirección: ${response.status}`);
							}
						}
						return response.json();
					})
					.then(data => {
						console.log("Dirección creada con éxito:", data);
						resolve(data);
					})
					.catch(error => {
						console.error("Error en la solicitud:", error);
						reject(error);
					});
			} catch (error) {
				console.error("Error al crear la dirección:", error);
				reject(error);
			}
		});
	},

	/**
	 * Actualiza una dirección existente de un cliente.
	 * @param {Object} direccion - Datos de la dirección actualizada.
	 * @returns {Promise<Object>} Promesa que resuelve con la dirección actualizada.
	 */

	async updateDireccion(direccion) {
		try {
			console.log("Enviando solicitud PUT con datos:", JSON.stringify(direccion, null, 2));

			// Verificar que la dirección tenga los campos obligatorios
			if (!direccion || !direccion.id || !direccion.nombreVia || !direccion.dirVia || !direccion.localidadId) {
				throw new Error("La dirección debe contener id, nombreVia, dirVia y localidadId válidos");
			}

			const response = await fetch(`http://192.168.99.40:8080/ciberloja-rest-api/api/direccion/update`, {
				method: 'PUT', // El endpoint usa PUT según la anotación en el recurso
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
					// Si necesitas autenticación, añade el token aquí
				},
				body: JSON.stringify(direccion),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Respuesta de error del servidor:", errorText);

				if (response.status === 400) {
					throw new Error("Datos de dirección inválidos. Verifica que todos los campos requeridos sean correctos.");
				} else if (response.status === 404) {
					throw new Error("Dirección no encontrada.");
				} else if (response.status === 500) {
					throw new Error("Error interno del servidor. Por favor, intenta más tarde.");
				} else {
					throw new Error(`Error al actualizar la dirección: ${response.status} - ${errorText}`);
				}
			}

			const data = await response.json();
			console.log("Dirección actualizada con éxito:", data);
			return data;
		} catch (error) {
			console.error("Error al actualizar la dirección:", error);
			throw error; // Propagar el error para manejarlo en el controlador
		}
	},
	/**
	 * Obtiene todas las localidades disponibles.
	 * @returns {Promise<Array>} Promesa que resuelve con la lista de localidades.
	 */
	async getLocalidades() {
		return new Promise((resolve, reject) => {
			defaultApi.findAllLocalidades((error, data, response) => {
				if (error) {
					reject(error);
				} else {
					// Asegurarse de que cada localidad tenga provinciaId
					const localidades = response.body.map(loc => ({
						id: loc.id,
						nombre: loc.nombre,
						provinciaId: loc.provincia?.id || loc.provinciaId
					}));
					resolve(localidades);
				}
			});
		});
	},

	async getProvincias() {
		return new Promise((resolve, reject) => {
			console.log("Obteniendo todas las Provincias...");
			defaultApi.findAllProvincias((error, data, response) => {
				if (error) {
					console.error("Error al obtener las Provincias:", error);
					reject(error);
				} else {
					console.log("Respuesta completa:", response);
					console.log("Datos recibidos en response.body:", response.body);
					console.log("Tipo de datos:", typeof response.body, Array.isArray(response.body));
					resolve(response.body); // Devolver el array de Provincias
				}
			});
		});
	},

	async getPaises() {
		return new Promise((resolve, reject) => {
			console.log("Obteniendo todas las Paises...");
			defaultApi.findAllPaises((error, data, response) => {
				if (error) {
					console.error("Error al obtener las Paises:", error);
					reject(error);
				} else {
					console.log("Respuesta completa:", response);
					console.log("Datos recibidos en response.body:", response.body);
					console.log("Tipo de datos:", typeof response.body, Array.isArray(response.body));
					resolve(response.body); // Devolver el array de Paises
				}
			});
		});
	}
};

export default DireccionService;