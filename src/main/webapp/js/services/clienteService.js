import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

// Crear una instancia de ApiClient
const apiClient = new ApiClient();

// Crear una instancia de DefaultApi
const defaultApi = new DefaultApi(apiClient);

const ClienteService = {

	/**
		 * Elimina un usuario por su ID.
		 * @param {number} userId - El ID del usuario a eliminar.
		 * @returns {Promise<Object>} Promesa que resuelve con la respuesta de la API.
		 */

	async deleteCliente(clienteId) {
		return new Promise((resolve, reject) => {
			console.log(`Enviando petición con ID: ${clienteId}`); // Updated log for clarity

			defaultApi.deleteCliente(clienteId, function(error, data, response) {
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

					reject(error); // Rechaza la promesa si hay error
				} else {
					console.log("Cliente borrado:", data);
					resolve(data); // Resuelve la promesa con los datos obtenidos
				}
			});
		});
	},

	async obterPerfil() {
		try {
			// Recuperar token de autenticação do sessionStorage
			const clienteData = JSON.parse(sessionStorage.getItem("cliente"));
			if (!clienteData || !clienteData.token) {
				throw new Error("Usuário não autenticado");
			}

			const response = await fetch('/api/clientes/perfil', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${clienteData.token}`
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Erro ao carregar perfil');
			}

			const perfil = await response.json();
			return perfil;
		} catch (error) {
			console.error('Erro no serviço de carregamento de perfil:', error);
			throw error;
		}
	},
}

export default ClienteService;