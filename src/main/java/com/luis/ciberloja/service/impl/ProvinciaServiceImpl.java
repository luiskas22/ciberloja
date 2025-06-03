package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.ProvinciaDAO;
import com.luis.ciberloja.dao.impl.ProvinciaDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Distrito;
import com.luis.ciberloja.service.ProvinciaService;

public class ProvinciaServiceImpl implements ProvinciaService{
	
	private static Logger logger = LogManager.getLogger(PaisServiceImpl.class);
	private ProvinciaDAO provinciaDAO = null;
	
	public ProvinciaServiceImpl() {
		provinciaDAO = new ProvinciaDAOImpl();
	}
	
	public Distrito findById(int id) throws DataException{
		
		Connection con = null;
		Distrito p = null;
		boolean commit = false;
		
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			p = provinciaDAO.findById(con, id);
			commit = true;
			
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return p;
	}

	
	public List<Distrito> findAll() throws DataException {
		
		Connection con = null;
		List<Distrito> resultados = null;
		boolean commit = false;
		
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			resultados = provinciaDAO.findAll(con);
			commit = true;
			
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return resultados;
	}

}

