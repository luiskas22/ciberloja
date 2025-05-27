package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.LocalidadDAO;
import com.luis.ciberloja.dao.impl.LocalidadDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Localidad;
import com.luis.ciberloja.service.LocalidadService;

public class LocalidadServiceImpl implements LocalidadService{

	private static Logger logger = LogManager.getLogger(LocalidadServiceImpl.class);
	private LocalidadDAO localidadDAO = null;
	
	public LocalidadServiceImpl() {
		localidadDAO = new LocalidadDAOImpl();
	}
	
	public List<Localidad> findAll() throws DataException{
		
		Connection con = null;
		List<Localidad> localidades = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			localidades = localidadDAO.findAll(con);
			commit = true;
			
		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return localidades;
	}

	
	public Localidad findById(int id) throws DataException{
		
		Connection con = null;
		Localidad l = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			l = localidadDAO.findById(con, id);
			commit = true;
		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return l;
		
	}

	
	public Localidad findByCodigoPostal(int codigoPostal) throws DataException {
		
		Connection con = null;
		Localidad l = null;
		boolean commit = false;
		
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			l = localidadDAO.findByCodigoPostal(con, codigoPostal);
			commit = true;
			
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return l;
	}
}
