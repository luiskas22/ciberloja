package com.luis.ciberloja.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.CategoriaDAO;
import com.luis.ciberloja.model.Categoria;
import com.luis.ciberloja.dao.util.JDBCUtils;

public class CategoriaDAOImpl implements CategoriaDAO{

	@Override
	public List<Categoria> findAll(Connection con) throws DataException {
		List<Categoria> categoria=new ArrayList<Categoria>();
		ResultSet rs = null;
		PreparedStatement pst = null;

		try {

			StringBuilder query = new StringBuilder(" SELECT ID, NOMBRE").append(" FROM CATEGORIA ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			rs = pst.executeQuery();

			while (rs.next()) {
				categoria.add(loadNext(con, rs));

			}

		} catch (SQLException e) {
			throw new DataException(e);

		} finally {
			JDBCUtils.close(pst, rs);
		}

		return categoria;

	}
	protected Categoria loadNext(Connection con, ResultSet rs) throws SQLException {

		int i = 1;
		Categoria c = new Categoria();

		c.setId(rs.getLong(i++));
		c.setNombre(rs.getString(i++));

		return c;
	}
}
