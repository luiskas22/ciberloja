import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

const apiClient = new ApiClient();
const defaultApi = new DefaultApi(apiClient);

const ProductoService = {
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

    async findByProductosCriteria(criteria, pagination) {
        try {
            const queryParams = new URLSearchParams({
                id: criteria.id || '',
                descripcion: criteria.nombre || '',
                precioMin: criteria.precioMin || '',
                precioMax: criteria.precioMax || '',
                stockMin: criteria.stockMin || '',
                stockMax: criteria.stockMax || '',
                familia: criteria.familia || '',
                page: pagination.page || 1,
                size: pagination.size || 30
            });

            const url = `http://192.168.99.40:8080/ciberloja-rest-api/api/producto/search?${queryParams}`;
            console.log("Enviando petición a:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al buscar productos: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Productos encontrados:", {
                total: data.total,
                pageLength: data.page?.length,
                firstId: data.page?.[0]?.id,
                lastId: data.page?.[data.page.length - 1]?.id
            });

            return {
                page: data.page || [],
                total: data.total || data.page.length,
                totalPages: data.totalPages || Math.ceil((data.total || data.page.length) / (pagination.size || 30))
            };
        } catch (error) {
            console.error("Error al buscar productos por criterios:", error);
            throw new Error(`Error al buscar productos: ${error.message}`);
        }
    },


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

    async findByIdSOAP(id) {
        return this.findById(id);
    }
};

export default ProductoService;