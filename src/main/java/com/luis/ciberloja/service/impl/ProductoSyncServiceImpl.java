package com.luis.ciberloja.service.impl;

import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.repository.ProductoRepository;
import com.luis.ciberloja.service.ProductoSyncService;
import com.luis.ciberloja.soap.SoapServiceIntegration;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoSyncServiceImpl implements ProductoSyncService {
    private static final Logger logger = LogManager.getLogger(ProductoSyncServiceImpl.class);

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private SoapServiceIntegration soapService;

    @Override
    public void importAllProductos() {
        logger.info("Starting full import of productos from Ciberloja");
        try {
            List<ProductoDTO> productos = soapService.getArtigosCiberlojaSite();

            for (ProductoDTO producto : productos) {
                productoRepository.save(producto);
                logger.debug("Imported producto: {}", producto.getId());
            }
            logger.info("Full import completed: {} productos imported", productos.size());
        } catch (Exception e) {
            logger.error("Error during full import: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to import productos", e);
        }
    }

    @Override
    public void syncUpdatedProductos() {
        logger.info("Starting incremental sync of productos from Ciberloja");
        try {
            List<ProductoDTO> productos = soapService.getArtigosCiberlojaSite();

            int updated = 0, inserted = 0;
            for (ProductoDTO producto : productos) {
                Optional<ProductoDTO> existing = productoRepository.findById(producto.getId());
                if (existing.isPresent()) {
                    ProductoDTO current = existing.get();
                    if (!isEqual(current, producto)) {
                        productoRepository.save(producto);
                        updated++;
                        logger.debug("Updated producto: {}", producto.getId());
                    }
                } else {
                    productoRepository.save(producto);
                    inserted++;
                    logger.debug("Inserted producto: {}", producto.getId());
                }
            }

            // Optional: Handle deletions (uncomment if Ciberloja supports deletion detection)
            // deleteRemovedProductos(productos);

            logger.info("Incremental sync completed: {} updated, {} inserted", updated, inserted);
        } catch (Exception e) {
            logger.error("Error during incremental sync: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to sync productos", e);
        }
    }

    private boolean isEqual(ProductoDTO current, ProductoDTO newProducto) {
        return current.getNombre().equals(newProducto.getNombre()) &&
               current.getPrecio().equals(newProducto.getPrecio()) &&
               current.getStockDisponible().equals(newProducto.getStockDisponible()) &&
               current.getFamilia().equals(newProducto.getFamilia());
    }

    // Optional: Handle deletions
    /*
    private void deleteRemovedProductos(List<ProductoDTO> remoteProductos) {
        List<String> remoteIds = remoteProductos.stream().map(ProductoDTO::getId).toList();
        List<ProductoDTO> localProductos = productoRepository.findAll();
        for (ProductoDTO local : localProductos) {
            if (!remoteIds.contains(local.getId())) {
                productoRepository.deleteById(local.getId());
                logger.debug("Deleted producto: {}", local.getId());
            }
        }
    }
    */
}