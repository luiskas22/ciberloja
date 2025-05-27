const FileService = {
    async uploadImageToProducto(productoId, file) {
        try {
            // Validate file
            if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
                throw new Error("Solo se permiten imágenes JPG o PNG");
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error("La imagen no debe exceder 5MB");
            }

            console.log("Subiendo imagen para producto:", productoId, "Nombre:", file.name, "Tamaño:", file.size, "bytes");

            const formData = new FormData();
            formData.append('file', file);

            const url = `http://192.168.99.40:8080/ciberloja-rest-api/api/file/upload/producto/${productoId}`;
            console.log("Enviando solicitud a:", url);

            const response = await fetch(url, {
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
            const url = `http://192.168.99.40:8080/ciberloja-rest-api/api/file/producto/${productoId}`;
            // console.log(`Obteniendo imágenes para producto ${productoId} desde: ${url}`);

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
            // console.log("Imágenes obtenidas:", data);
            return Array.isArray(data) ? data.map(url => ({ url })) : [];
        } catch (error) {
            console.warn(`Error al intentar obtener imágenes para el producto ${productoId}:`, error.message);
            return [];
        }
    },
};

export default FileService;