//package com.luis.ciberloja.service;
//
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//
//import com.luis.ciberloja.model.LineaPedido;
//import com.luis.ciberloja.model.Pedido;
//import com.luis.ciberloja.model.PedidoCriteria;
//import com.luis.ciberloja.model.ProductoDTO;
//import com.luis.ciberloja.model.Results;
//import com.luis.ciberloja.service.impl.PedidoServiceImpl;
//import com.luis.ciberloja.service.impl.ProductoServiceImpl;
//
//public class PedidoServiceTest {
//
//	private static Logger logger = LogManager.getLogger(PedidoServiceTest.class);
//	private PedidoService pedidoService = null;
//	private ProductoService productoService = null;
//
//	public PedidoServiceTest() {
//		pedidoService = new PedidoServiceImpl();
//		productoService = new ProductoServiceImpl();
//	}
//
//	public void testFindById() throws Exception {
//		logger.info("Testing FindById...");
//		Pedido p = null;
//		pedidoService = new PedidoServiceImpl();
//		p = pedidoService.findBy(5l);
//		if (p == null) {
//			logger.info("No se han encontrado resultados a partir del identificador introducido");
//		} else {
//			logger.info(p);
//		}
//	}
//
//	public void testFindByCriteriaId() throws Exception {
//		logger.info("Testing FindByCriteriaId...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		criteria.setId(2l);
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado resultados a partir del identificador introducido");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//	}
//
//	public void testFindByCriteriaFechaDesde() throws Exception {
//		logger.info("Testing FindByCriteriaFechaDesde...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		criteria.setFechaDesde(com.luis.ciberloja.dao.util.DateUtils.getDate(2023, 9, 1));
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado pedidos realizados a partir de la fecha proporcionada");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//	}
//
//	public void testFindByCriteriaFechaHasta() throws Exception {
//		logger.info("Testing FindByCriteriaFechaHasta...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		criteria.setFechaHasta(com.luis.ciberloja.dao.util.DateUtils.getDate(2023, 4, 1));
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado pedidos realizados antes de la fecha proporcionada");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//	}
//
//	public void testFindByCriteriaPrecioDesde() throws Exception {
//		logger.info("Testing FindByCriteriaPrecioDesde...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		criteria.setPrecioDesde(40.00);
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado pedidos con un precio superior al proporcionado");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//	}
//
//	public void testFindByCriteriaPrecioHasta() throws Exception {
//		logger.info("Testing FindByCriteriaPrecioHasta...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		criteria.setPrecioHasta(20.00);
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado pedidos con un precio inferior al proporcionado");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//	}
//
//	public void testFindByCriteriaClienteId() throws Exception {
//		logger.info("Testing FindByCriteriaClienteId...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		criteria.setClienteId(2l);
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado pedidos realizados por el cliente proporcionado");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//	}
//
//	public void testFindByCriteriaTipoEstadoPedidoId() throws Exception {
//		logger.info("Testing FindByCriteriaTipoEstadoPedidoId...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		criteria.setTipoEstadoPedidoId(2);
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado pedidos a partir del del estado proporcionado");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//	}
//
//	public void testFindByCriteriaMultipleParameters() throws Exception {
//		logger.info("Testing findByCriteriaMultipleParameters...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		// criteria.setFechaDesde(DateUtils.getDate(2023, 8, 1));
//		// criteria.setFechaHasta(DateUtils.getDate(2023, 10, 1));
//		criteria.setPrecioDesde(16.0d);
//		criteria.setPrecioHasta(20.00);
//		// criteria.setTipoEstadoPedidoId(2);
//		// criteria.setClienteId(3l);
//		// criteria.setOrderBy(criteria.ORDER_BY_PRECIO);
//		// criteria.setAscDesc(Boolean.FALSE);
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado resultados a partir de los parámetros introducidos");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//
//	}
//
//	public void testFindByEmptyCriteria() throws Exception {
//		logger.info("Testing findByEmptyCriteria...");
//		PedidoCriteria criteria = new PedidoCriteria();
//		Results<Pedido> resultados = pedidoService.findByCriteria(criteria, 1, 7);
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado resultados a partir de los parámetros introducidos");
//		} else {
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//		}
//
//	}
//
//	public void testCreate() throws Exception {
//		// Crear el pedido
//		Pedido p = new Pedido();
//
//		// Crear líneas de pedido
//		LineaPedido lp1 = new LineaPedido();
//		LineaPedido lp2 = new LineaPedido();
//		LineaPedido lp3 = new LineaPedido();
//
//		// Obtener los productos
//		ProductoDTO pro8 = productoService.findById(8L);
//		ProductoDTO pro9 = productoService.findById(9L);
//		ProductoDTO pro10 = productoService.findById(10L);
//
//		// Verificar que los productos existan
//		if (pro8 == null || pro9 == null || pro10 == null) {
//			logger.error("Uno o más productos no encontrados: 11=" + pro8 + ", 15=" + pro9 + ", 17=" + pro10);
//			return;
//		}
//
//		// Configurar el pedido
//		p.setFechaRealizacion(new Date()); // Fecha actual
//		p.setClienteId(1L); // Cliente con id = 1 (Luis)
//		p.setTipoEstadoPedidoId(2); // Estado "En proceso" (id = 2)
//
//		// Configurar la línea de pedido para producto 11
//		lp1.setProductoId(pro8.getId()); // Producto id = 11
//		lp1.setNombreProducto(pro8.getNombre()); // Nombre del producto
//		lp1.setPrecio(pro8.getPrecio()); // Precio del producto
//		lp1.setUnidades(4); // 2 unidades
//
//		// Configurar la línea de pedido para producto 15
//		lp2.setProductoId(pro9.getId()); // Producto id = 15
//		lp2.setNombreProducto(pro9.getNombre()); // Nombre del producto
//		lp2.setPrecio(pro9.getPrecio()); // Precio del producto
//		lp2.setUnidades(1); // 1 unidad
//
//		// Configurar la línea de pedido para producto 17
//		lp3.setProductoId(pro10.getId()); // Producto id = 17
//		lp3.setNombreProducto(pro10.getNombre()); // Nombre del producto
//		lp3.setPrecio(pro10.getPrecio()); // Precio del producto
//		lp3.setUnidades(2); // 3 unidades
//
//		// Añadir las líneas al pedido
//		p.getLineas().add(lp1);
//		p.getLineas().add(lp2);
//		p.getLineas().add(lp3);
//
//		// Calcular el precio total del pedido
//		p.setPrecio(pedidoService.calcularPrecio(p));
//
//		// Guardar el pedido
//		Long id = pedidoService.create(p);
//
//		// Verificar el resultado
//		if (id == null) {
//			logger.info("El pedido no se ha creado correctamente");
//		} else {
//			logger.info("El pedido se ha creado correctamente con id: " + id);
//		}
//	}
//
//	public void testUpdate() throws Exception {
//		logger.info("Testing update...");
//		Pedido pedido = pedidoService.findBy(23l);
//		pedido.setTipoEstadoPedidoId(6);
//		pedido.setClienteId(1l);
//		List<LineaPedido> pedidos = new ArrayList<LineaPedido>();
////		LineaPedido lp = new LineaPedido();
////		lp.setProductoId(3l);
////		lp.setPedidoId(3l);
////		lp.setPrecio(10.00);
////		lp.setUnidades(1);
////		pedidos.add(lp);
//		pedido.setLineas(pedidos);
//		boolean b = pedidoService.update(pedido);
//
//		if (b == false) {
//			logger.info("El pedido no se ha actualizado");
//		} else {
//			logger.info("El pedido se ha actualizado correctamente");
//		}
//	}
//
//	public void testDelete() throws Exception {
//		logger.info("Testing delete...");
//		Pedido p = new Pedido();
//		p.setId(12l);
//		pedidoService.delete(p.getId());
//
//		if (pedidoService.findBy(p.getId()) == null) {
//			logger.info("Pedido eliminado correctamente");
//		} else {
//			logger.info("No se ha borrado el pedido con ID proporcionado porque no se encuentra en la BD");
//		}
//
//	}
//
//	public void testFindPedidosByClienteId() throws Exception {
//		logger.info("Testing FindPedidosByClienteId...");
//		Long clienteId = 2L; // Usamos un ID de cliente de ejemplo (ajústalo según tu base de datos)
//
//		Results<Pedido> resultados = pedidoService.findPedidosByClienteId(clienteId);
//
//		if (resultados.getPage().isEmpty()) {
//			logger.info("No se han encontrado pedidos para el cliente con ID: " + clienteId);
//		} else {
//			logger.info("Pedidos encontrados para el cliente con ID: " + clienteId);
//			for (Pedido p : resultados.getPage()) {
//				logger.info(p);
//			}
//			logger.info("Total de pedidos encontrados: " + resultados.getTotal());
//		}
//	}
//
//	public static void main(String[] args) throws Exception {
//		PedidoServiceTest test = new PedidoServiceTest();
////		test.testFindById();
//		// test.testFindByCriteriaId();
//		// test.testFindByCriteriaFechaDesde();
//		// test.testFindByCriteriaFechaHasta();
//		// test.testFindByCriteriaPrecioDesde();
//		// test.testFindByCriteriaPrecioHasta();
//		// test.testFindByCriteriaClienteId();
//		// test.testFindByCriteriaTipoEstadoPedidoId();
//		// test.testFindByCriteriaMultipleParameters();
////		 test.testFindByEmptyCriteria();
////		test.testCreate();
//		 test.testUpdate();
//		// test.testDelete();
////		test.testFindPedidosByClienteId();
//
//	}
//
//}
