package com.luis.ciberloja.service;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.DireccionDTO;
import com.luis.ciberloja.service.impl.ClienteServiceImpl;
import com.luis.ciberloja.service.impl.DireccionServiceImpl;


public class DireccionServiceTest {
	
	private static Logger logger = LogManager.getLogger(DireccionServiceTest.class);
	private DireccionService direccionService = null;
	private ClienteService clienteService = null;
	
	public DireccionServiceTest() {
		direccionService = new DireccionServiceImpl();
		clienteService = new ClienteServiceImpl();
	}
	
	public void testDelete() throws Exception{
		
		logger.traceEntry("Testing deleteByCliente...");
		DireccionDTO direccion = new DireccionDTO();
		direccion.setId(12l);
		
		if(direccionService.delete(direccion.getId())){
			logger.trace("La dirección con ID: "+direccion.getId()+" ha sido borrada correctamente");
		}else {
			logger.trace("La dirección no ha sido borrada correctamente");
		}
	}
	
	public void testCreate() throws Exception{
		logger.traceEntry("Testing create...");
		DireccionDTO d = new DireccionDTO();
		d.setNombreVia("Plaza de la Concepción");
		d.setDirVia("nº7");
		d.setLocalidadId(24);
		d.setClienteId(null);
		direccionService.create(d);
		logger.trace("Creada la dirección con ID: "+d.getId());
		
	}
	
	public void testUpdateByCliente() throws Exception{
		logger.traceEntry("Testing UpdateByEmpleado...");
		ClienteDTO cliente = new ClienteDTO();
		cliente = clienteService.findById(1l);
		List<DireccionDTO> direcciones = cliente.getDirecciones();
		for(DireccionDTO direccion : direcciones) {
			direccion.setNombreVia("Avenida Camariñas");
			direccionService.update(direccion);
		}
		
	}
	
	public static void main(String [] args) throws Exception{
		
		DireccionServiceTest test = new DireccionServiceTest();
		//test.testDelete();
		test.testCreate();
		//test.testUpdateByCliente();
	}

}
