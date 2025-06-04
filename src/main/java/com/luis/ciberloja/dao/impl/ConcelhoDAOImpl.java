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
import com.luis.ciberloja.dao.ConcelhoDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Concelho;
import com.luis.ciberloja.model.Freguesia;

public class ConcelhoDAOImpl implements ConcelhoDAO {
	private static Logger logger = LogManager.getLogger(ConcelhoDAOImpl.class);

	@Override
	public Concelho findById(Connection con, int id) throws DataException {
		ResultSet rs = null;
		PreparedStatement pst = null;
		Concelho c = null;

		try {
			StringBuilder query = new StringBuilder("SELECT ID, NOMBRE, DISTRITO_ID ").append(" FROM CONCELHO ")
					.append(" WHERE ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			pst.setInt(i++, id);

			rs = pst.executeQuery();

			if (rs.next()) {
				c = loadNext(rs);
			}

		} catch (SQLException e) {
			logger.error("ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return c;
	}

	@Override
	public List<Concelho> findAll(Connection con) throws DataException {
		List<Concelho> resultados = new ArrayList<Concelho>();
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {

			StringBuilder query = new StringBuilder(" SELECT ID, NOMBRE, DISTRITO_ID FROM CONCELHO");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			rs = pst.executeQuery();

			while (rs.next()) {
				resultados.add(loadNext(rs));
			}

		} catch (SQLException e) {
			logger.error(e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}

		return resultados;
	}

	protected Concelho loadNext(ResultSet rs) throws SQLException {

		int i = 1;

		Concelho c = new Concelho();

		c.setId(rs.getInt(i++));
		c.setNombre(rs.getString(i++));
		c.setDistritoId(rs.getInt(i++));

		return c;
	}

}
