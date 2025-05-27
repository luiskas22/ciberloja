package com.luis.ciberloja.service;

public interface ProductoSyncService {
    /**
     * Imports all products from the Ciberloja SOAP service and saves them to the local database.
     * This method is intended for initial data import or full synchronization.
     *
     * @throws RuntimeException if the import process fails due to SOAP or database errors
     */
    void importAllProductos();

    /**
     * Synchronizes updated or new products from the Ciberloja SOAP service to the local database.
     * This method performs an incremental update, inserting new products and updating existing ones
     * based on field differences.
     *
     * @throws RuntimeException if the synchronization process fails due to SOAP or database errors
     */
    void syncUpdatedProductos();
}