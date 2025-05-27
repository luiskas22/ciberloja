package com.luis.ciberloja.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.luis.ciberloja.service.FamiliaSyncService;
import com.luis.ciberloja.service.ProductoSyncService;

@Component
@EnableScheduling
public class FamiliaSyncScheduler {

	@Autowired
	private FamiliaSyncService familiaSyncService;

	@Scheduled(cron = "0 0 2 * * ?")
	public void scheduleSync() {
		familiaSyncService.syncUpdatedFamilias();
	}

	@Scheduled(initialDelay = 1000, fixedDelay = Long.MAX_VALUE)
	public void initialImport() {
		familiaSyncService.importAllFamilias();
	}

}
