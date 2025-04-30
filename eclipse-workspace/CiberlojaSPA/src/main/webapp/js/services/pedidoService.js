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

	async createPedido(pedidoData) {
		try {
			console.log("Enviando petición de creación con datos:", pedidoData);

			// Ensure pedidoData is valid
			if (!pedidoData || !pedidoData.clienteId) {
				throw new Error("El objeto pedidoData debe contener un clienteId válido");
			}

			const response = await fetch('http://192.168.99.40:8080/ciberloja-rest-api/api/pedido/create', {
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

		const response = await fetch(`http://192.168.99.40:8080/ciberloja-rest-api/api/pedido/pedidos?${queryParams.toString()}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Erro ao buscar pedidos por critérios: ${response.status} - ${errorText}`);
		}
		return await response.json();
	},

	async updatePedido(pedido) {
		try {
			console.log("Enviando solicitud PUT con datos:", JSON.stringify(pedido, null, 2));

			// Verificar que el pedido tenga los campos obligatorios
			if (!pedido || !pedido.id || !pedido.clienteId || !pedido.tipoEstadoPedidoId) {
				throw new Error("El pedido debe contener id, clienteId y tipoEstadoPedidoId válidos");
			}

			const response = await fetch(`http://192.168.99.40:8080/ciberloja-rest-api/api/pedido/update`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(pedido),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Respuesta de error del servidor:", errorText);

				if (response.status === 400) {
					throw new Error("Datos del pedido inválidos. Verifica que todos los campos requeridos sean correctos.");
				} else if (response.status === 404) {
					throw new Error("Pedido no encontrado.");
				} else if (response.status === 500) {
					throw new Error("Error interno del servidor. Por favor, intenta más tarde.");
				} else {
					throw new Error(`Error al actualizar el pedido: ${response.status} - ${errorText}`);
				}
			}

			const data = await response.json();
			console.log("Pedido actualizado con éxito:", data);
			return data;
		} catch (error) {
			console.error("Error al actualizar el pedido:", error);
			throw error; // Propagar el error para manejarlo en el controlador
		}
	},
};

export default PedidoService;