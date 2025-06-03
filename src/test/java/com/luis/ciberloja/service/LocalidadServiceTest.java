package com.luis.ciberloja.service;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.model.Freguesia;
import com.luis.ciberloja.service.impl.LocalidadServiceImpl;

public class LocalidadServiceTest {

	private static Logger logger = LogManager.getLogger(LocalidadServiceTest.class);
	private LocalidadService localidadService = null;

	public LocalidadServiceTest() {
		localidadService = new LocalidadServiceImpl();
	}

	public void testFindAll() throws Exception{
		logger.traceEntry("Testing FindAll...");
		List<Freguesia> resultados = localidadService.findAll();

		if(resultados.isEmpty()) {
			logger.info("No se han encontrado resultados");
		}else {
			for(Freguesia l : resultados) {
				logger.info(resultados);
			}
		}
	}

	public void testFindByCodigoPostal() throws Exception{
		logger.traceEntry("Testing findByCodigoPostal...");
		Freguesia l = localidadService.findByCodigoPostal(27510);
		if(l != null) {
			logger.info(l);
		}else {
			logger.info("No se han encontrado resultados");
		}


	}

	public void testFindById() throws Exception{
		logger.traceEntry("Testing findByLocalidadId...");
		Freguesia l = localidadService.findById(4);
		if(l != null) {
			logger.info(l);
		}else {
			logger.info("No se han encontrado resultados");
		}

	}

	public static void main(String[]args) throws Exception{
		LocalidadServiceTest test = new LocalidadServiceTest();
		test.testFindAll();
		//test.testFindByCodigoPostal();
		//test.testFindById();

	}
}
