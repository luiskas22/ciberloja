package com.luis.ciberloja.service.impl;

import com.luis.ciberloja.service.ProductoSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class ProductoSyncScheduler {
    @Autowired
    private ProductoSyncService productoSyncService;

    @Scheduled(cron = "0 0 2 * * ?")
    public void scheduleSync() {
        productoSyncService.syncUpdatedProductos();
    }

    
    @Scheduled(initialDelay = 1000, fixedDelay = Long.MAX_VALUE)
    public void initialImport() {
        productoSyncService.importAllProductos();
    }
    
}