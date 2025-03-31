import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

// Crear una instancia de ApiClient
const apiClient = new ApiClient();

// Crear una instancia de DefaultApi
const defaultApi = new DefaultApi(apiClient);

const PedidoService = {
	async findById(id) {
		try {
			const data = await new Promise((resolve, reject) => {
				defaultApi.findPedidoById(id, (error, data) => {
					if (error) {
						console.error('Error al buscar pedido ' + id, error);
						reject(error);
					} else {
						console.log('Pedido ' + id + ' encontrado.');
						resolve(data);
					}
				});
			});
			return data;
		} catch (error) {
			throw new Error(`Error al buscar el pedido con ID ${id}: ${error.message}`);
		}
	},

	async findPedidosByClienteId(clienteId) {
		try {
			const data = await new Promise((resolve, reject) => {
				defaultApi.findPedidosByClienteId(clienteId, (error, data, response) => {
					if (error) {
						console.error('Error al buscar pedidos del cliente ' + clienteId, error);
						console.error('Respuesta del servidor:', response ? response.status : 'Sin respuesta');
						reject(error);
					} else {
						// Si data es null (por ejemplo, 204 No Content), devolvemos una lista vacía
						const pedidos = data || [];
						console.log(`Pedidos del cliente ${clienteId} encontrados: ${pedidos.length} pedidos.`);
						resolve(pedidos);
					}
				});
			});
			return data;
		} catch (error) {
			throw new Error(`Error al buscar los pedidos del cliente con ID ${clienteId}: ${error.message}`);
		}
	},
};

export default PedidoService;