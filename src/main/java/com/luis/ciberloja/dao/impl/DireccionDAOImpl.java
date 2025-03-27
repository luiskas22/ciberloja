package com.luis.ciberloja.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.DireccionDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.DireccionDTO;


public class DireccionDAOImpl implements DireccionDAO {

	private static Logger logger = LogManager.getLogger(DireccionDAOImpl.class);
	
	public DireccionDAOImpl() {
		
	}
	
	public boolean delete(Connection con, Long id) throws DataException{

		PreparedStatement pst = null;
		
		try {

			pst = con.prepareStatement(" DELETE FROM DIRECCION WHERE ID = ? ");

			int i = 1;

			pst.setLong(i++, id);

			int deletedRows = pst.executeUpdate();

			if(deletedRows == 0) {
				return false;
			}


		} catch (SQLException e) {
			logger.error("ID: "+id, e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(pst);
		}
		return true;
	}

	
	public boolean update(Connection con, DireccionDTO d) throws DataException{

		PreparedStatement pst = null;
		
		try {

			pst = con.prepareStatement(" UPDATE DIRECCION SET NOMBRE_VIA = ?, DIR_VIA = ?, LOCALIDAD_ID = ?, CLIENTE_ID = ? "
					+" WHERE ID = ?");
			
			int i = 1;
			pst.setString(i++, d.getNombreVia());
			pst.setString(i++, d.getDirVia());
			pst.setInt(i++, d.getLocalidadId());
			JDBCUtils.setNullable(pst, i++, d.getClienteId());
			pst.setLong(i++, d.getId());
			
			int updatedRows = pst.executeUpdate();

			if(updatedRows == 0) {
				return false;
			}

		} catch (SQLException e) {
			logger.error("DireccionDTO: "+d, e);
			throw new DataException (e);
		}finally {
			JDBCUtils.close(pst);
		}
		return true;
	}

	
	public Long create(Connection con, DireccionDTO d) throws DataException{
		
		PreparedStatement pst = null;
		ResultSet rs = null;
		
		try {
			
			pst = con.prepareStatement(" INSERT INTO DIRECCION (NOMBRE_VIA, DIR_VIA, LOCALIDAD_ID, CLIENTE_ID)"
													+ " VALUES(?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			
			int i = 1;
			JDBCUtils.setNullable(pst, i++, d.getNombreVia());
			JDBCUtils.setNullable(pst, i++, d.getDirVia());
			JDBCUtils.setNullable(pst, i++, d.getLocalidadId());				
			JDBCUtils.setNullable(pst, i++, d.getClienteId());
			
			int insertedRows = pst.executeUpdate();
			
			if(insertedRows != 1) {
				
			}
			
			rs = pst.getGeneratedKeys();
			
			if(rs.next()) {
				Long id = rs.getLong(1);
				d.setId(id);
				return id;
			}
			
		} catch(SQLException e) {
			logger.error("DireccionDTO: "+d, e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(pst, rs);
		}
		
		return null;
	}

	
	protected DireccionDTO loadNext (ResultSet rs) throws SQLException{

		int i = 1;

		DireccionDTO d = new DireccionDTO();

		d.setId(rs.getLong(i++));
		d.setNombreVia(rs.getString(i++));
		d.setDirVia(rs.getString(i++));
		d.setClienteId(JDBCUtils.getNullableLong(rs, i++));
		d.setLocalidadId(rs.getInt(i++));
		d.setLocalidadNombre(rs.getString(i++));
		d.setProvinciaId(rs.getInt(i++));
		d.setProvinciaNombre(rs.getString(i++));
		d.setPaisId(rs.getInt(i++));
		d.setPaisNombre(rs.getString(i++));
		
		return d;
	}
}
