package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.PedidoDAO;
import com.luis.ciberloja.dao.impl.PedidoDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.LineaPedido;
import com.luis.ciberloja.model.Pedido;
import com.luis.ciberloja.model.PedidoCriteria;
import com.luis.ciberloja.model.Results;
import com.luis.ciberloja.service.ClienteService;
import com.luis.ciberloja.service.MailException;
import com.luis.ciberloja.service.MailService;
import com.luis.ciberloja.service.PedidoService;

public class PedidoServiceImpl implements PedidoService {

	private static Logger logger = LogManager.getLogger(PedidoServiceImpl.class);
	private PedidoDAO pedidoDAO = null;
	private ClienteService clienteService=null;
	private MailService mailService = null; // Instância do MailService

	public PedidoServiceImpl() {
		pedidoDAO = new PedidoDAOImpl();
		mailService = new MailServiceImpl(); // Inicialização do MailService
		clienteService=new ClienteServiceImpl();
	}

	public Pedido findBy(Long id) throws DataException {
		Connection con = null;
		Pedido p = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			p = pedidoDAO.findBy(con, id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return p;
	}

	public Results<Pedido> findByCriteria(PedidoCriteria pedido, int pos, int pageSize) throws DataException {
		Connection con = null;
		Results<Pedido> resultados = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			resultados = pedidoDAO.findByCriteria(con, pedido, pos, pageSize);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return resultados;
	}

	public Long create(Pedido p) throws DataException, MailException {
	    Connection con = null;
	    Long id = null;
	    boolean commit = false;

	    try {
	        con = JDBCUtils.getConnection();
	        con.setAutoCommit(false);

	        PedidoCriteria criteria = new PedidoCriteria();
	        criteria.setTipoEstadoPedidoId(6); // Tipo de estado "carrinho"
	        criteria.setClienteId(p.getClienteId());

	        List<Pedido> pedidos = findByCriteria(criteria, 1, Integer.MAX_VALUE).getPage();

	        Pedido carrito = null;
	        if (!pedidos.isEmpty()) {
	            carrito = pedidos.get(0);
	        }

	        if (carrito == null || p.getTipoEstadoPedidoId() != 7) {
	            p.setPrecio(calcularPrecio(p));
	            id = pedidoDAO.create(con, p);
	            if (id != null) {
	                commit = true;
	                // Obter dados do cliente (exemplo fictício)
	                ClienteService clienteService = new ClienteServiceImpl(); // Substituir por tua implementação
	                ClienteDTO cliente = clienteService.findById(p.getClienteId());
	                String emailCliente = cliente.getEmail(); // Assumindo que ClienteDTO tem getEmail()
	                mailService.sendPedidoRealizado(emailCliente, cliente, p);
	            }
	        }

	    } catch (SQLException e) {
	        logger.error(e.getMessage(), e);
	        throw new DataException(e);
	    } finally {
	        JDBCUtils.close(con, commit);
	    }
	    return id;
	}

	public boolean update(Pedido p) throws DataException {

		Connection con = null;
		boolean tf = false;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			p.setPrecio(calcularPrecio(p));
			tf = pedidoDAO.update(con, p);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return tf;
	}

	public boolean delete(Long id) throws DataException {
		Connection con = null;
		boolean tf = false;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			tf = pedidoDAO.delete(con, id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return tf;
	}

	public Double calcularPrecio(Pedido p) throws DataException {
		double precioTotal = 0.0d;

		for (LineaPedido lp : p.getLineas()) {
			precioTotal += lp.getPrecio() * lp.getUnidades();
		}

		return precioTotal;
	}

	@Override
	public Results<Pedido> findPedidosByClienteId(Long clienteId) throws DataException {
		Connection con = null;
		Results<Pedido> resultados = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);

			if (clienteId == null) {
				throw new DataException("El ID del cliente no puede ser nulo");
			}

			resultados = pedidoDAO.findPedidosByClienteId(con, clienteId);
			commit = true;

		} catch (SQLException e) {
			logger.error("Error al buscar pedidos para clienteId: " + clienteId, e);
			throw new DataException("Error en la base de datos al buscar pedidos: " + e.getMessage(), e);
		} finally {
			JDBCUtils.close(con, commit);
		}

		return resultados;
	}
}