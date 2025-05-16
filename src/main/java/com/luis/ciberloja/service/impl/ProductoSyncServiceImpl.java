package com.luis.ciberloja.service.impl;

import com.luis.ciberloja.model.Familia;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.repository.FamiliaRepository;
import com.luis.ciberloja.repository.ProductoRepository;
import com.luis.ciberloja.service.ProductoSyncService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoSyncServiceImpl implements ProductoSyncService {

    private static final Logger logger = LoggerFactory.getLogger(ProductoSyncServiceImpl.class);

    @Autowired
    private FamiliasCiberlojaImpl familiasCiberlojaImpl;

    @Autowired
    private ArtigosCiberlojaImpl artigosCiberlojaImpl;

    @Autowired
    private FamiliaRepository familiaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void importAllProductos() {
        try {
            logger.info("Starting full import of productos from Ciberloja");

            // Step 1: Sync families first
            logger.info("Importing families...");
            List<Familia> familias = familiasCiberlojaImpl.getFamiliasCiberlojaSite();
            if (familias.isEmpty()) {
                logger.warn("No families retrieved from SOAP service. Products with unknown families will be skipped.");
            } else {
                familiaRepository.saveAll(familias);
                logger.info("Saved {} families to the database", familias.size());
            }

            // Step 2: Sync products
            List<ProductoDTO> productos = artigosCiberlojaImpl.getArtigosCiberlojaSite();
            int skipped = 0;
            for (ProductoDTO producto : productos) {
                Familia familia = producto.getFamilia();
                if (familia != null && familia.getId() != null) {
                    // Check if the familia exists
                    Optional<Familia> existingFamiliaOpt = familiaRepository.findById(familia.getId());
                    if (existingFamiliaOpt.isEmpty()) {
                        logger.warn("Familia with id {} not found. Skipping product: {}", familia.getId(), producto.getId());
                        skipped++;
                        continue;
                    }
                    producto.setFamilia(existingFamiliaOpt.get());
                }
                // Check if product already exists
                ProductoDTO existingProduct = productoRepository.findById(producto.getId()).orElse(null);
                if (existingProduct == null) {
                    productoRepository.save(producto);
                } else {
                    // Update existing product
                    existingProduct.setNombre(producto.getNombre());
                    existingProduct.setPrecio(producto.getPrecio());
                    existingProduct.setStockDisponible(producto.getStockDisponible());
                    existingProduct.setFamilia(producto.getFamilia());
                    productoRepository.save(existingProduct);
                }
            }
            logger.info("Completed full import of {} productos ({} skipped due to missing families)", productos.size() - skipped, skipped);
        } catch (Exception e) {
            logger.error("Error during full import", e);
            throw new RuntimeException("Error during full import: " + e.getMessage(), e);
        }
    }

    @Override
    public void syncUpdatedProductos() {
        try {
            logger.info("Starting incremental sync of updated productos from Ciberloja");

            // Step 1: Sync families first
            List<Familia> familias = familiasCiberlojaImpl.getFamiliasCiberlojaSite();
            if (familias.isEmpty()) {
                logger.warn("No families retrieved from SOAP service. Products with unknown families will be skipped.");
            } else {
                familiaRepository.saveAll(familias);
                logger.info("Saved {} families to the database", familias.size());
            }

            // Step 2: Sync products
            List<ProductoDTO> productos = artigosCiberlojaImpl.getArtigosCiberlojaSite();
            int skipped = 0;
            for (ProductoDTO producto : productos) {
                Familia familia = producto.getFamilia();
                if (familia != null && familia.getId() != null) {
                    Optional<Familia> existingFamiliaOpt = familiaRepository.findById(familia.getId());
                    if (existingFamiliaOpt.isEmpty()) {
                        logger.warn("Familia with id {} not found. Skipping product: {}", familia.getId(), producto.getId());
                        skipped++;
                        continue;
                    }
                    producto.setFamilia(existingFamiliaOpt.get());
                }
                ProductoDTO existingProduct = productoRepository.findById(producto.getId()).orElse(null);
                if (existingProduct == null) {
                    productoRepository.save(producto);
                } else if (hasChanges(existingProduct, producto)) {
                    existingProduct.setNombre(producto.getNombre());
                    existingProduct.setPrecio(producto.getPrecio());
                    existingProduct.setStockDisponible(producto.getStockDisponible());
                    existingProduct.setFamilia(producto.getFamilia());
                    productoRepository.save(existingProduct);
                }
            }
            logger.info("Completed incremental sync of {} productos ({} skipped due to missing families)", productos.size() - skipped, skipped);
        } catch (Exception e) {
            logger.error("Error during incremental sync", e);
            throw new RuntimeException("Error during incremental sync: " + e.getMessage(), e);
        }
    }

    private boolean hasChanges(ProductoDTO existing, ProductoDTO updated) {
        return !existing.getNombre().equals(updated.getNombre()) ||
               !existing.getPrecio().equals(updated.getPrecio()) ||
               !existing.getStockDisponible().equals(updated.getStockDisponible()) ||
               (existing.getFamilia() != null && updated.getFamilia() != null &&
                !existing.getFamilia().getId().equals(updated.getFamilia().getId()));
    }
}