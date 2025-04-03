package com.luis.ciberloja.service; 

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.Results;
import com.luis.ciberloja.service.impl.ClienteServiceImpl;

public class ClienteServiceTest {

	private static Logger logger = LogManager.getLogger(ClienteServiceTest.class);
	private ClienteService clienteService = null;

	public ClienteServiceTest() {
		clienteService = new ClienteServiceImpl();
	}

	public void testFindAll() throws Exception{
		logger.traceEntry("Testing findAll....");
		Results<ClienteDTO> clientes = clienteService.findAll(1, 5);

		for(ClienteDTO c : clientes.getPage()) {
			logger.info(c);
		}
	}

	public void testFindById() throws Exception{

		logger.traceEntry("Testing findById...");
		ClienteDTO cliente = new ClienteDTO();
		cliente = clienteService.findById(null);

		logger.info(cliente);

	}

	public void testFindByNick() throws Exception{

		logger.traceEntry("Testing findByNickname...");
		ClienteDTO cliente = new ClienteDTO();
		cliente = clienteService.findByNick("user1");

		logger.info(cliente);
	}

	public void testFindByEmail() throws Exception{

		logger.traceEntry("Testing findByNickname...");
		ClienteDTO cliente = new ClienteDTO();
		cliente = clienteService.findByEmail("juan@gmail.com");
		logger.info(cliente);
	}

	public void testRegistrar() throws Exception{

		logger.traceEntry("Testing create...");

		ClienteDTO c = new ClienteDTO();

		c.setNickname("test");
		c.setNombre("test");
		c.setApellido1("test");
		c.setApellido2(null);
		c.setDniNie("347565323F");
		c.setEmail("luiskaspoty@gmail.com");
		c.setTelefono("698212323");
		c.setPassword("abc123.");

		clienteService.registrar(c);

		logger.trace("Guardado el cliente: "+c);


	}

	public void testDelete() throws Exception{

		logger.traceEntry("Testing delete...");
		ClienteDTO c = new ClienteDTO();
		c.setId(9l);
		clienteService.delete(c.getId());
		logger.trace("Eliminado el cliente: "+c);

	}

	public void testUpdate() throws Exception{

		ClienteDTO cliente = new ClienteDTO();

		logger.traceEntry("Testing update...");

		cliente = clienteService.findById(4l);

		if(cliente.getId() != null) {
			cliente.setNombre("Ana");
			clienteService.update(cliente);
			logger.trace("Los datos del cliente han sido actualizados correctamente");
		}else {
			logger.trace("No se han encontrado clientes con el id proporcionado");
		}

		
	}

	public void testUpdatePassword() throws Exception{
		logger.traceEntry("Testing updatePassword...");
		String password = "Escairon718";
		Long id = 11l;
		if (clienteService.updatePassword(password, id)) {
			logger.info("Su contraseña ha sido actualizada correctamente");
		}else{
			logger.info("Su contraseña no ha sido actualizada");
		}
			
	}
	
	public void testAutenticacionOK() throws Exception{

		logger.trace("Testing Autenticacion de usuario y password correctas...");


			ClienteDTO e = clienteService.autenticar("joroleacasanova@gmail.com", "abc123.");

			if (e!=null) {
				logger.trace("Autenticación correcta. Todo OK!");
				logger.trace(e);
			} else {
				logger.trace("Fallo en el método de autenticación con usuario y password correctos.");
			}
		
	}

	public static void main(String [] args) throws Exception{

		ClienteServiceTest test = new ClienteServiceTest();
//		test.testFindAll();
		//test.testFindById();
		//test.testFindByNick();
		//test.testFindByEmail();
		test.testRegistrar();
		//test.testUpdate();
//		test.testUpdatePassword();
		//test.testDelete();
		//test.testAutenticacionOK();

	}

}
