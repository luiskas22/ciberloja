package com.luis.ciberloja.service;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.model.EstadoPedido;
import com.luis.ciberloja.service.impl.EstadoPedidoServiceImpl;

public class EstadoPedidoServiceTest {

	private EstadoPedidoService estadoPedidoService = null;
	private static Logger logger = LogManager.getLogger(EstadoPedidoServiceImpl.class);
	
	public EstadoPedidoServiceTest() {
		estadoPedidoService = new EstadoPedidoServiceImpl();
	}
	
	public void testFindAll() {
		
		try {
			List<EstadoPedido> estados = estadoPedidoService.findAll();
			logger.info(estados);
		}catch(Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	
	public static void main (String []args) {
		EstadoPedidoServiceTest test = new EstadoPedidoServiceTest();
		test.testFindAll();
	}
}
