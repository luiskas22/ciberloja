const FileService = {
    async uploadImageToProducto(productoId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`http://localhost:8080/ciberloja-rest-api/api/file/upload/producto/${productoId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al subir la imagen: ${response.status} - ${errorText || response.statusText}`);
            }

            const data = await response.json();
            console.log("Imagen subida exitosamente:", data);
            return data; // Expecting ["url1", "url2", ...]
        } catch (error) {
            console.error("Error al subir la imagen:", error.message);
            throw error;
        }
    },

    async getImagesByProductoId(productoId) {
        try {
            const url = `http://localhost:8080/ciberloja-rest-api/api/file/producto/${productoId}`;
            console.log(`Obteniendo imágenes para producto ${productoId} desde: ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`Error al obtener imágenes para el producto ${productoId}: ${response.status} - ${errorText}`);
                return [];
            }

            const data = await response.json();
            console.log("Imágenes obtenidas:", data);
            // Convert list of URLs to array of objects for consistency with ProductoView
            return Array.isArray(data) ? data.map(url => ({ url })) : [];
        } catch (error) {
            console.warn(`Error al intentar obtener imágenes para el producto ${productoId}:`, error.message);
            return [];
        }
    },
};

export default FileService;