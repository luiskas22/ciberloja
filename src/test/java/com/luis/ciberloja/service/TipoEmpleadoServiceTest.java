package com.luis.ciberloja.service;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.model.TipoEmpleado;
import com.luis.ciberloja.service.impl.TipoEmpleadoServiceImpl;

public class TipoEmpleadoServiceTest {
	
	private TipoEmpleadoService tipoEmpleadoService = new TipoEmpleadoServiceImpl();
	
	private static Logger logger = LogManager.getLogger(TipoEmpleadoServiceTest.class);
	
	public void testFindAll() throws Exception {
		
		List<TipoEmpleado> tipos = tipoEmpleadoService.findAll();
		logger.info(tipos);
	}
	
	public static void main (String [] args) throws Exception{
		TipoEmpleadoServiceTest test = new TipoEmpleadoServiceTest();
		test.testFindAll();
	}
}
