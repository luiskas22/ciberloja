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
	/**
	 * Crea un nuevo pedido.
	 * @param {Object} pedidoData - Datos del pedido a crear.
	 * @returns {Promise<Object>} Promesa que resuelve con los datos del pedido creado.
	 */
	async createPedido(pedidoData) {
		try {
			console.log("Enviando petición de creación con datos:", pedidoData);

			// Ensure pedidoData is valid
			if (!pedidoData || !pedidoData.clienteId) {
				throw new Error("El objeto pedidoData debe contener un clienteId válido");
			}

			const response = await fetch('http://localhost:8080/ciberloja-rest-api/api/pedido/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(pedidoData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error al crear el pedido: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			console.log("Pedido creado exitosamente:", data);
			return data;
		} catch (error) {
			console.error("Error al crear el pedido:", error);
			throw new Error(`Error al crear el pedido: ${error.message}`);
		}
	},

	async findByCriteria(criteria) {
		const queryParams = new URLSearchParams();
		if (criteria.id) queryParams.append("id", criteria.id);
		if (criteria.fechaDesde) queryParams.append("fechaDesde", criteria.fechaDesde);
		if (criteria.fechaHasta) queryParams.append("fechaHasta", criteria.fechaHasta);
		if (criteria.precioDesde) queryParams.append("precioDesde", criteria.precioDesde);
		if (criteria.precioHasta) queryParams.append("precioHasta", criteria.precioHasta);
		if (criteria.clienteId) queryParams.append("clienteId", criteria.clienteId);
		if (criteria.tipoEstadoPedidoId) queryParams.append("tipoEstadoPedidoId", criteria.tipoEstadoPedidoId);
		if (criteria.productoId) queryParams.append("productoId", criteria.productoId);
		if (criteria.descripcion) queryParams.append("descripcion", criteria.descripcion);

		// Use the full URL to your backend server
		const response = await fetch(`http://localhost:8080/ciberloja-rest-api/api/pedido/pedidos?${queryParams.toString()}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Erro ao buscar pedidos por critérios: ${response.status} - ${errorText}`);
		}
		return await response.json();
	}
};

export default PedidoService;