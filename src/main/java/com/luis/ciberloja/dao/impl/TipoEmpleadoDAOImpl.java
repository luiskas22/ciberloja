package com.luis.ciberloja.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.TipoEmpleadoDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.TipoEmpleado;

public class TipoEmpleadoDAOImpl implements TipoEmpleadoDAO{
	
	private static Logger logger = LogManager.getLogger();
	
	@Override
	public List<TipoEmpleado> findAll(Connection con) throws DataException {
		
		PreparedStatement pst = null;
		ResultSet rs = null;
		List<TipoEmpleado> estados = new ArrayList<TipoEmpleado>();
		
		try {
			
			StringBuilder query = new StringBuilder(" SELECT ID, NOMBRE ").append(" FROM TIPO_EMPLEADO ");
			
			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			
			rs = pst.executeQuery();
			
			while(rs.next()) {
				estados.add(loadNext(rs));
			}
			
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(pst, rs);
		}
		
		
		return estados;
	}
	
	protected TipoEmpleado loadNext(ResultSet rs) throws SQLException{
		
		TipoEmpleado tipo = new TipoEmpleado();
		int i = 1;
		
		tipo.setId(rs.getInt(i++));
		tipo.setNombre(rs.getString(i++));
		
		return tipo;
	}

}
