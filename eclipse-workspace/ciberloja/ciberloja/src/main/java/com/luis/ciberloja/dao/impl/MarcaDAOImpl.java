package com.luis.ciberloja.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.MarcaDAO;
import com.luis.ciberloja.model.Marca;
import com.luis.ciberloja.dao.util.JDBCUtils;

public class MarcaDAOImpl implements MarcaDAO {

	@Override
	public List<Marca> findAll(Connection con) throws DataException{
		List<Marca> marca = new ArrayList<Marca>();
		ResultSet rs = null;
		PreparedStatement pst = null;

		try {

			StringBuilder query = new StringBuilder(" SELECT ID, NOMBRE").append(" FROM MARCA ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;

			rs = pst.executeQuery();

			while (rs.next()) {
				marca.add(loadNext(con, rs));

			}

		} catch (SQLException e) {
			throw new DataException(e);

		} finally {
			JDBCUtils.close(pst, rs);
		}

		return marca;

	}

	protected Marca loadNext(Connection con, ResultSet rs) throws SQLException {

		int i = 1;
		Marca m = new Marca();

		m.setId(rs.getLong(i++));
		m.setNombre(rs.getString(i++));

		return m;
	}

}
