package com.luis.ciberloja.service;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.Results;
import com.luis.ciberloja.service.impl.ProductoServiceImpl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

public class ProductoServiceTest {

    private static ProductoService productoService = new ProductoServiceImpl();
    private static Logger logger = LogManager.getLogger(ProductoServiceTest.class);

    public static void main(String[] args) {
        try {
            probarBusquedaPorCriterios();
         
        } catch (DataException e) {
            logger.error("Error en las pruebas", e);
        }
    }

//    private static Long crearProductoEjemplo() throws DataException {
//        logger.info("Creando producto de prueba");
//        ProductoDTO nuevoProducto = new ProductoDTO();
//        nuevoProducto.setNombre("Camiseta de Prueba");
//        nuevoProducto.setDescripcion("Camiseta blanca de algodón");
//        nuevoProducto.setPrecio(24.99);
//        nuevoProducto.setStockDisponible(50);
//        nuevoProducto.setIdCategoria(2L);
//        nuevoProducto.setIdMarca(2L);
//        nuevoProducto.setIdUnidadMedida(1L);
//
//        Long idGenerado = productoService.create(nuevoProducto);
//        if (idGenerado != null) {
//            logger.info("Producto creado con éxito. ID: {}", idGenerado);
//        } else {
//            logger.warn("No se pudo crear el producto.");
//        }
//        return idGenerado;
//    }
//
//    private static void buscarProductoPorId(Long id) throws DataException {
//        logger.info("Buscando producto por ID: {}", id);
//        ProductoDTO producto = productoService.findById(id);
//        if (producto != null) {
//            logger.info("Producto encontrado: {}", producto);
//        } else {
//            logger.warn("Producto no encontrado.");
//        }
//    }

    private static void probarBusquedaPorCriterios() throws DataException {
        logger.info("Probando búsqueda por criterios");
        ProductoCriteria criterio = new ProductoCriteria();
        criterio.setFamiliaNombre("computadores");
        Results<ProductoDTO> resultados = productoService.findBy(criterio, 3, 30);
        imprimirResultados(resultados.getPage());
        logger.info("Total productos: {}", resultados.getTotal());
    }

//    private static void listarTodosLosProductos() throws DataException {
//        logger.info("Listando todos los productos");
//        ProductoCriteria criterio = new ProductoCriteria();
//        Results<ProductoDTO> resultados = productoService.findBy(criterio, 1, 50);
//        imprimirResultados(resultados.getPage());
//    }

//    private static void actualizarProducto(Long id) throws DataException {
//        logger.info("Actualizando producto con ID: {}", id);
//        ProductoDTO producto = productoService.findById(id);
//        if (producto != null) {
//            producto.setPrecio(29.99);
//            producto.setStockDisponible(30);
//            boolean actualizado = productoService.update(producto);
//            if (actualizado) {
//                logger.info("Producto actualizado correctamente.");
//            } else {
//                logger.warn("No se pudo actualizar el producto.");
//            }
//        } else {
//            logger.warn("Producto no encontrado para actualización.");
//        }
//    }
//
//    private static void eliminarProducto(Long id) throws DataException {
//        logger.info("Eliminando producto con ID: {}", id);
//        boolean eliminado = productoService.delete(id);
//        if (eliminado) {
//            logger.info("Producto eliminado correctamente.");
//        } else {
//            logger.warn("No se pudo eliminar el producto.");
//        }
//    }
//
    private static void imprimirResultados(List<ProductoDTO> productos) {
        if (productos == null || productos.isEmpty()) {
            logger.warn("No se encontraron resultados.");
        } else {
            logger.info("Resultados encontrados: {} productos", productos.size());
            productos.forEach(p -> logger.info("Producto: ID={}, Nombre={}, Stock={}", 
                p.getId(), p.getNombre(), p.getStockDisponible()));
        }
    }
}
