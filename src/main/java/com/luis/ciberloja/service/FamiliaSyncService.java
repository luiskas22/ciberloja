package com.luis.ciberloja.service;

public interface FamiliaSyncService {
    /**
     * Imports all families from the Ciberloja SOAP service and saves them to the local database.
     * This method is intended for initial data import or full synchronization.
     *
     * @throws RuntimeException if the import process fails due to SOAP or database errors
     */
    void importAllFamilias();

    /**
     * Synchronizes updated or new families from the Ciberloja SOAP service to the local database.
     * This method performs an incremental update, inserting new families and updating existing ones
     * based on field differences.
     *
     * @throws RuntimeException if the synchronization process fails due to SOAP or database errors
     */
    void syncUpdatedFamilias();
}