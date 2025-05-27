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
import com.luis.ciberloja.dao.PaisDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Pais;

public class PaisDAOImpl implements PaisDAO{

	private static Logger logger = LogManager.getLogger(PaisDAOImpl.class);

	public PaisDAOImpl() {

	}

	public List<Pais> findAll(Connection con) throws DataException{

		List<Pais>resultados = new ArrayList<Pais>();
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			
			StringBuilder query = new StringBuilder(" SELECT ID ,NOMBRE, ISO1, ISO2, PHONE_CODIGO ")
					.append(" FROM PAIS ").append(" ORDER BY NOMBRE ASC");

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

	public Pais findById(Connection con, int id) throws DataException {

		PreparedStatement pst = null;
		ResultSet rs = null;
		Pais p = null;
		try { 
			StringBuilder query = new StringBuilder("SELECT ID, NOMBRE, ISO1, ISO2, PHONE_CODIGO ")
					.append(" FROM PAIS ")
					.append(" WHERE ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			pst.setInt(i++, id);
			
			rs = pst.executeQuery();

			if(rs.next()) {
				p = loadNext(rs);
			}
		}catch(SQLException e) {
			logger.error("ID: "+id, e);
			throw new DataException(e);
		}finally {
			JDBCUtils.close(pst, rs);
		}
		return p;
	}
	protected Pais loadNext (ResultSet rs) throws SQLException{

		int i = 1;

		Pais p = new Pais();

		p.setId(rs.getInt(i++));
		p.setNombre(rs.getString(i++));
		p.setIso1(rs.getString(i++));
		p.setIso2(rs.getString(i++));
		p.setPhoneCodigo(rs.getString(i++));


		return p;
	}
}
