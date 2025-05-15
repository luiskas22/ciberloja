import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

// Crear una instancia de ApiClient
const apiClient = new ApiClient();

// Crear una instancia de DefaultApi
const defaultApi = new DefaultApi(apiClient);

const ProductoService = {
	/**
	 * Busca un producto por su ID.
	 * @param {number} id - El ID del producto a buscar.
	 * @returns {Promise<Object>} Promesa que resuelve con los datos del producto.
	 */
	async findById(id) {
		try {
			const data = await new Promise((resolve, reject) => {
				defaultApi.findProductoById(id, (error, data) => {
					if (error) {
						console.error('Error al buscar producto ' + id, error);
						reject(error);
					} else {
						console.log('Producto ' + id + ' encontrado.');
						data.consumos = data.consumos || [];
						resolve(data);
					}
				});
			});
			return data;
		} catch (error) {
			throw new Error(`Error al buscar el producto con ID ${id}: ${error.message}`);
		}
	},

	/**
	 * Busca productos por criterios.
	 * @param {Object} criteria - Criterios de búsqueda.
	 * @returns {Promise<Object>} Promesa que resuelve con los datos de los productos encontrados.
	 */
	async findByProductosCriteria(criteria) {
		try {
			const data = await new Promise((resolve, reject) => {
				console.log("Enviando petición con:", criteria);
				defaultApi.findProductosByCriteria(criteria, (error, data) => {
					if (error) {
						console.error("Error en la petición a la API:", error);
						reject(error);
					} else {
						console.log("Productos encontrados:", data);
						resolve(data);
					}
				});
			});
			return data;
		} catch (error) {
			throw new Error(`Error al buscar productos por criterios: ${error.message}`);
		}
	},

	/**
	 * Elimina un producto por su ID.
	 * @param {number} productoId - El ID del producto a eliminar.
	 * @returns {Promise<Object>} Promesa que resuelve con la respuesta de la API.
	 */
	async deleteProducto(productoId) {
		try {
			const data = await new Promise((resolve, reject) => {
				console.log(`Enviando petición con ID: ${productoId}`);
				defaultApi.deleteProducto(productoId, (error, data) => {
					if (error) {
						console.error("Error en la petición a la API:", error);
						reject(error);
					} else {
						console.log("Producto borrado:", data);
						resolve(data);
					}
				});
			});
			return data;
		} catch (error) {
			throw new Error(`Error al eliminar el producto con ID ${productoId}: ${error.message}`);
		}
	},

	/**
	 * Crea un nuevo producto.
	 * @param {Object} productoData - Datos del producto a crear.
	 * @returns {Promise<Object>} Promesa que resuelve con los datos del producto creado.
	 */
	async createProducto(productoData) {
		try {
			const data = await new Promise((resolve, reject) => {
				console.log("Enviando petición con datos:", productoData);
				defaultApi.createProducto(productoData, (error, data) => {
					if (error) {
						console.error("Error al crear el producto:", error);
						reject(error);
					} else {
						console.log("Producto creado:", data);
						resolve(data);
					}
				});
			});
			return data;
		} catch (error) {
			throw new Error(`Error al crear el producto: ${error.message}`);
		}
	},

	/**
	 * Actualiza un producto existente.
	 * @param {Object} productoData - Datos del producto a actualizar.
	 * @returns {Promise<Object>} Promesa que resuelve con los datos del producto actualizado.
	 */
	async updateProducto(productoData) {
		try {
			console.log("Enviando petición de actualización con datos:", productoData);

			// Ensure productoData has an id
			if (!productoData || !productoData.id) {
				throw new Error("El objeto productoData debe contener un ID válido");
			}

			const response = await fetch(`http://192.168.99.40:8080/ciberloja-rest-api/api/producto/update/${productoData.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productoData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error al actualizar el producto: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			console.log("Producto actualizado:", data);
			return data;
		} catch (error) {
			console.error("Error al actualizar el producto:", error);
			throw new Error(`Error al actualizar el producto: ${error.message}`);
		}
	},
	/**
		 * Busca todos los productos usando el endpoint SOAP.
		 * @param {Object} credentials - Credenciales para la autenticación SOAP.
		 * @returns {Promise<Object>} Promesa que resuelve con los datos de los productos encontrados.
		 */
	async findByProductosSOAP(credentials, filters = {}) {
		try {
			const { nombre, precioMin, precioMax, stockMin, stockMax } = filters;
			const queryParams = new URLSearchParams({
				empresa: credentials.empresa || 'ciberloja',
				utilizador: credentials.utilizador || 'website',
				password: credentials.password || 'Website2025*',
				descricao: nombre || '',
				PVP3Min: precioMin || '',
				PVP3Max: precioMax || '',
				StockMin: stockMin || '',
				StockMax: stockMax || '',

			});

			const url = `http://192.168.99.40:8080/ciberloja-rest-api/api/producto/sync-soap?${queryParams}`;

			console.log("Enviando petición a:", url);

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error al buscar productos SOAP: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			console.log("Productos SOAP encontrados:", data);

			// Asegura que la respuesta tenga el formato esperado
			return {
				page: data.page || [],
				totalElements: data.total || 0
			};
		} catch (error) {
			console.error("Error al buscar productos SOAP:", error);
			throw new Error(`Error al buscar productos SOAP: ${error.message}`);
		}
	},

	async findByIdSOAP(credentials, id) {
		try {
			const queryParams = new URLSearchParams({
				empresa: credentials.empresa || 'ciberloja',
				utilizador: credentials.utilizador || 'website',
				password: credentials.password || 'Website2025*',
				id: id || '',
			});

			const url = `http://192.168.99.40:8080/ciberloja-rest-api/api/producto/sync-soap/findById?${queryParams}`;

			console.log("Enviando petición a:", url);

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error al buscar producto por ID SOAP: ${response.status} - ${errorText}`);
			}

			const producto = await response.json();
			console.log("Producto SOAP encontrado:", producto);

			// Verifica que la respuesta sea un producto válido
			if (!producto || !producto.id) {
				throw new Error("Producto no encontrado o respuesta inválida");
			}

			return producto; // Devuelve el ProductoDTO directamente
		} catch (error) {
			console.error("Error al buscar producto por ID SOAP:", error);
			throw new Error(`Error al buscar producto por ID SOAP: ${error.message}`);
		}
	}
};

export default ProductoService;