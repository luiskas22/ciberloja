package com.luis.ciberloja.service.impl;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.luis.ciberloja.service.ProductoSyncService;

@Component
@EnableScheduling
public class ProductoSyncScheduler {
	
	private static Logger logger = LogManager.getLogger(ProductoSyncScheduler.class);

    @Autowired
    private ProductoSyncService productoSyncService;

    @Scheduled(cron = "0 0 2 * * ?")
    public void scheduleSync() {
        productoSyncService.syncUpdatedProductos();
    }

    @Scheduled(initialDelay = 6000, fixedDelay = Long.MAX_VALUE)
    public void initialImport() {
        logger.info("Running initial import of all products");
        productoSyncService.importAllProductos();
        logger.info("Initial import completed");
    }
}