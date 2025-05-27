	package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.TipoEmpleadoDAO;
import com.luis.ciberloja.dao.impl.TipoEmpleadoDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.TipoEmpleado;
import com.luis.ciberloja.service.TipoEmpleadoService;

public class TipoEmpleadoServiceImpl implements TipoEmpleadoService{
	
	private TipoEmpleadoDAO tipoEmpleadoDAO = new TipoEmpleadoDAOImpl();
	
	private static Logger logger = LogManager.getLogger(TipoEmpleadoServiceImpl.class);
	
	@Override
	public List<TipoEmpleado> findAll() throws DataException {
		
		Connection con = null;
		boolean commit = false;
		List<TipoEmpleado> tipos = null;
		
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			tipos = tipoEmpleadoDAO.findAll(con);
			commit = true;
			
		}catch(SQLException ex) {
			logger.error(ex.getMessage(), ex);
			throw new DataException(ex);
		}finally {
			JDBCUtils.close(con, commit);
		}
		return tipos;
	}

}
