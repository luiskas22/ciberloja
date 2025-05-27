package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.EstadoPedidoDAO;
import com.luis.ciberloja.dao.impl.EstadoPedidoDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.EstadoPedido;
import com.luis.ciberloja.service.EstadoPedidoService;

public class EstadoPedidoServiceImpl implements EstadoPedidoService{

	private static Logger logger = LogManager.getLogger();
	private EstadoPedidoDAO estadoPedidoDAO = null;
	
	public EstadoPedidoServiceImpl() {
		estadoPedidoDAO = new EstadoPedidoDAOImpl();
	}
	
	@Override
	public List<EstadoPedido> findAll() throws DataException {
		
		Connection con = null;
		List<EstadoPedido> estados = null;
		boolean commit = false;
		
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			estados = estadoPedidoDAO.findAll(con);
			commit = true;
			
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return estados;
	}

}
