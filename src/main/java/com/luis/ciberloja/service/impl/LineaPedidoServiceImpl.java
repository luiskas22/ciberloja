package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.LineaPedidoDAO;
import com.luis.ciberloja.dao.impl.LineaPedidoDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.LineaPedido;
import com.luis.ciberloja.service.LineaPedidoService;

public class LineaPedidoServiceImpl implements LineaPedidoService{

	private static Logger logger = LogManager.getLogger(LineaPedidoServiceImpl.class);
	private LineaPedidoDAO lineaPedidoDAO = null;

	public LineaPedidoServiceImpl() {
		lineaPedidoDAO = new LineaPedidoDAOImpl();
	}

	public LineaPedido findById(Long lineaPedidoId) throws DataException{

		Connection con = null;
		LineaPedido lp = null;
		boolean commit = false;
		
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			lp = lineaPedidoDAO.findById(con, lineaPedidoId);
			commit = true;

		} catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return lp;
	}

	
	public boolean deleteFromPedido(Long lineaId, Long pedidoId) throws DataException {
		
		Connection con = null;
		boolean isDeleted = false;
		boolean commit = false;
		
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			isDeleted = lineaPedidoDAO.deleteFromPedido(con, lineaId, pedidoId);
			commit = true;
			
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		
		return isDeleted;
	}
}
