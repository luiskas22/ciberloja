package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.FreguesiaDAO;
import com.luis.ciberloja.dao.impl.FreguesiaDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Freguesia;
import com.luis.ciberloja.service.FreguesiaService;

public class FreguesiaServiceImpl implements FreguesiaService{

	private static Logger logger = LogManager.getLogger(FreguesiaServiceImpl.class);
	private FreguesiaDAO freguesiaDAO = null;
	
	public FreguesiaServiceImpl() {
		freguesiaDAO = new FreguesiaDAOImpl();
	}
	
	public List<Freguesia> findAll() throws DataException{
		
		Connection con = null;
		List<Freguesia> localidades = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			localidades = freguesiaDAO.findAll(con);
			commit = true;
			
		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return localidades;
	}

	
	public Freguesia findById(int id) throws DataException{
		
		Connection con = null;
		Freguesia l = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			l = freguesiaDAO.findById(con, id);
			commit = true;
		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return l;
		
	}
}
