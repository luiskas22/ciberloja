package com.luis.ciberloja.dao.impl;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.UnidadMedidaDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.UnidadMedida;



public class UnidadMedidaDAOImpl implements UnidadMedidaDAO {

	public List<UnidadMedida> findAll(Connection con) throws DataException{
		List<UnidadMedida> unidadMedida = new ArrayList<UnidadMedida>();
		ResultSet rs = null;
		PreparedStatement pst = null;

		try {

			StringBuilder query = new StringBuilder(" SELECT ID, NOMBRE").append(" FROM UNIDAD_MEDIDA ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			rs = pst.executeQuery();

			while (rs.next()) {
				unidadMedida.add(loadNext(con, rs));

			}

		} catch (SQLException e) {
			throw new DataException(e);

		} finally {
			JDBCUtils.close(pst, rs);
		}

		return unidadMedida;

	}

	
	protected UnidadMedida loadNext(Connection con, ResultSet rs) throws SQLException {

		int i = 1;
		UnidadMedida um = new UnidadMedida();

		um.setId(rs.getLong(i++));
		um.setNombre(rs.getString(i++));

		return um;
	}

}
