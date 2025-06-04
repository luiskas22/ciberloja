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
import com.luis.ciberloja.dao.DistritoDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Distrito;

public class DistritoDAOImpl implements DistritoDAO{

	private static Logger logger = LogManager.getLogger(DistritoDAOImpl.class);

	public Distrito findById(Connection con, int id) throws DataException{

		PreparedStatement pst = null;
		ResultSet rs = null;
		Distrito p = null;

		try {
			StringBuilder query = new StringBuilder(" SELECT ID ,NOMBRE, PAIS_ID ")
					.append(" FROM DISTRITO ")
					.append(" WHERE ID = ? ");
			
			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			
			int i = 1;
			pst.setInt(i++, id);

			rs = pst.executeQuery();

			if(rs.next()) {
				p = loadNext(rs);
			}

		} catch(SQLException e) {
			logger.error("ID: "+id, e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(pst, rs);
		}
		return p;
	}



	public List<Distrito> findAll(Connection con) throws DataException{

		List<Distrito>resultados = new ArrayList<Distrito>();;
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {

			StringBuilder query = new StringBuilder(" SELECT ID ,NOMBRE, PAIS_ID ")
					.append(" FROM DISTRITO ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);


			rs = pst.executeQuery();

			while(rs.next()) {
				resultados.add(loadNext(rs));
			}

		}catch(SQLException e) {
			logger.error(e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(pst, rs);
		}
		return resultados;
	}
	
	protected Distrito loadNext (ResultSet rs ) throws SQLException {

		int i = 1;
		Distrito p = new Distrito();

		p.setId(rs.getInt(i++));
		p.setNombre(rs.getString(i++));
		p.setPaisId(rs.getInt(i++));

		return p;
	}
}



