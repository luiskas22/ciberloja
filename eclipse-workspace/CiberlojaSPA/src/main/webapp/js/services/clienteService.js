import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

// Crear una instancia de ApiClient
const apiClient = new ApiClient();

// Crear una instancia de DefaultApi
const defaultApi = new DefaultApi(apiClient);

const ClienteService = {
	/**
	 * Elimina un usuario por su ID.
	 * @param {number} clienteId - El ID del cliente a eliminar.
	 * @returns {Promise<Object>} Promesa que resuelve con la respuesta de la API.
	 */
	async deleteCliente(clienteId) {
		return new Promise((resolve, reject) => {
			console.log(`Enviando petición para eliminar cliente con ID: ${clienteId}`);
			defaultApi.deleteCliente(clienteId, (error, data, response) => {
				if (error) {
					console.error("Error en la petición a la API:", error);
					if (error.response) {
						console.error("Código de estado HTTP:", error.response.status);
						console.error("Respuesta del servidor:", error.response.body);
					} else if (error.request) {
						console.error("No se recibió respuesta del servidor. Verifique la conexión de red.");
					} else {
						console.error("Error al configurar la solicitud:", error.message);
					}
					reject(error);
				} else {
					console.log("Cliente borrado:", data);
					resolve(data);
				}
			});
		});
	},

	/**
		 * Actualiza un cliente existente.
		 * @param {Object} clienteData - Datos del cliente a actualizar.
		 * @returns {Promise<Object>} Promesa que resuelve con los datos del cliente actualizado.
		 */
	async updateCliente(clienteData) {
		try {
			console.log("Enviando petición de actualización con datos:", clienteData);

			// Ensure clienteData has an id
			if (!clienteData || !clienteData.id) {
				throw new Error("El objeto clienteData debe contener un ID válido");
			}

			const response = await fetch(`http://192.168.99.40:8080/ciberloja-rest-api/api/cliente/update`, {
				method: 'POST', // El endpoint usa POST según tu definición en ClienteResource
				headers: {
					'Content-Type': 'application/json',
					// Si necesitas autenticación, añade el token aquí, por ejemplo:
					// 'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify(clienteData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error al actualizar el cliente: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			console.log("Cliente actualizado:", data);
			return data;
		} catch (error) {
			console.error("Error al actualizar el cliente:", error);
			throw new Error(`Error al actualizar el cliente: ${error.message}`);
		}
	}
};

export default ClienteService;