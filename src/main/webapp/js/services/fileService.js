import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

// Crear una instancia de ApiClient
const apiClient = new ApiClient();

// Crear una instancia de DefaultApi
const defaultApi = new DefaultApi(apiClient);

const FileService = {
	/**
	 * Sube una imagen para un producto específico.
	 * @param {number} productoId - El ID del producto al que se subirá la imagen.
	 * @param {File} file - El archivo de imagen a subir.
	 * @returns {Promise<Object>} Promesa que resuelve con la lista de imágenes actualizada del producto.
	 */
	async uploadImageToProducto(productoId, file) {
		return new Promise((resolve, reject) => {
			console.log(`Enviando petición para subir imagen al producto con ID: ${productoId}`);

			// Crear un FormData para enviar el archivo
			const formData = new FormData();
			formData.append('file', file, file.name);

			defaultApi.uploadImageToProducto(productoId, formData, (error, data, response) => {
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
					console.log("Imagen subida exitosamente al producto:", data);
					resolve(data);
				}
			});
		});
	},

	/**
	 * Obtiene la lista de imágenes asociadas a un producto por su ID.
	 * @param {number} productoId - El ID del producto cuyas imágenes se desean obtener.
	 * @returns {Promise<Array>} Promesa que resuelve con la lista de imágenes (ImageDTO).
	 */
	async getImagesByProductoId(productoId) {
		try {
			console.log(`Enviando petición para obtener imágenes del producto con ID: ${productoId}`);

			const response = await fetch(`http://localhost:8080/ciberloja-rest-api/file/producto/${productoId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					// Si necesitas autenticación, añade el token aquí, por ejemplo:
					// 'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
			});

			if (!response.ok) {
				if (response.status === 204) {
					console.log(`No se encontraron imágenes para el producto con ID: ${productoId}`);
					return []; // Devuelve lista vacía si no hay contenido
				}
				const errorText = await response.text();
				throw new Error(`Error al obtener imágenes: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			console.log("Imágenes obtenidas:", data);
			return data;
		} catch (error) {
			console.error("Error al obtener imágenes del producto:", error);
			throw new Error(`Error al obtener imágenes: ${error.message}`);
		}
	},
};

export default FileService;