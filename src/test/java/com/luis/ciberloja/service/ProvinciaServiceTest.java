package com.luis.ciberloja.service;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.model.Distrito;
import com.luis.ciberloja.service.impl.DistritoServiceImpl;

public class ProvinciaServiceTest {
	
	private static Logger logger = LogManager.getLogger(ProvinciaServiceTest.class);
	private DistritoService provinciaService = null;
	
	public ProvinciaServiceTest() {
		provinciaService = new DistritoServiceImpl();
	}
	
	public void testFindAll() throws Exception{
		logger.traceEntry("Testing findAll...");
		List<Distrito> resultados = provinciaService.findAll();
		if(resultados.isEmpty()) {
			logger.trace("No se han encontrado resultados");
		}else {
			for(Distrito p : resultados) {
				logger.info(p);
			}	
		}
	}
	
	public void testFindById() throws Exception{
		logger.traceEntry("Testing findByProvinciaId...");
		Distrito p = provinciaService.findById(4);
		
		if(p!=null) {
			logger.info(p);
		}else {
			logger.trace("No se han encontrado resultados");
		}
	}
	
	public static void main(String[]args) throws Exception{
		ProvinciaServiceTest test = new ProvinciaServiceTest();
		test.testFindAll();
		test.testFindById();
	}

}
