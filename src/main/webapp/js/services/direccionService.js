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
			defaultApi.deleteDireccion(direccionId, (error, data, response) => {
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
	        console.log("JSON a enviar:", JSON.stringify(direccion));

	        defaultApi.createDireccion(direccion, (error, data, response) => {
	            if (error) {
	                console.error("Error al crear la dirección:", error);
	                reject(error);
	            } else {
	                console.log("Dirección creada con éxito:", data);
	                resolve(data);
	            }
	        });
	    });
	},

	/**
	 * Actualiza una dirección existente de un cliente.
	 * @param {Object} direccion - Datos de la dirección actualizada.
	 * @returns {Promise<Object>} Promesa que resuelve con la dirección actualizada.
	 */
	async updateDireccion(direccion) {
		return new Promise((resolve, reject) => {
			console.log("Actualizando dirección:", direccion);
			defaultApi.updateDireccion(direccion, (error, data, response) => {
				if (error) {
					console.error("Error al actualizar la dirección:", error);
					reject(error);
				} else {
					console.log("Dirección actualizada con éxito:", data);
					resolve(data);
				}
			});
		});
	},

	/**
	 * Obtiene todas las localidades disponibles.
	 * @returns {Promise<Array>} Promesa que resuelve con la lista de localidades.
	 */
	async getLocalidades() {
		return new Promise((resolve, reject) => {
			console.log("Obteniendo todas las localidades...");
			defaultApi.findAllLocalidades((error, data, response) => {
				if (error) {
					console.error("Error al obtener las localidades:", error);
					reject(error);
				} else {
					console.log("Respuesta completa:", response);
					console.log("Datos recibidos en response.body:", response.body);
					console.log("Tipo de datos:", typeof response.body, Array.isArray(response.body));
					resolve(response.body); // Devolver el array de localidades
				}
			});
		});
	}
};

export default DireccionService;