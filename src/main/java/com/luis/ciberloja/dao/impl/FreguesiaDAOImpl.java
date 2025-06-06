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
import com.luis.ciberloja.dao.FreguesiaDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Freguesia;

public class FreguesiaDAOImpl implements FreguesiaDAO {

	private static Logger logger = LogManager.getLogger(FreguesiaDAOImpl.class);

	public FreguesiaDAOImpl() {

	}

	public Freguesia findById(Connection con, int id) throws DataException {

		ResultSet rs = null;
		PreparedStatement pst = null;
		Freguesia l = null;

		try {
			StringBuilder query = new StringBuilder("SELECT ID, NOMBRE, CONCELHO_ID ").append(" FROM FREGUESIA ")
					.append(" WHERE ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			pst.setInt(i++, id);

			rs = pst.executeQuery();

			if (rs.next()) {
				l = loadNext(rs);
			}

		} catch (SQLException e) {
			logger.error("ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return l;
	}

	public List<Freguesia> findAll(Connection con) throws DataException {

		List<Freguesia> resultados = new ArrayList<Freguesia>();
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {

			StringBuilder query = new StringBuilder(" SELECT ID, NOMBRE, CONCELHO_ID FROM FREGUESIA");

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

	protected Freguesia loadNext(ResultSet rs) throws SQLException {

		int i = 1;

		Freguesia l = new Freguesia();

		l.setId(rs.getInt(i++));
		l.setNombre(rs.getString(i++));
		l.setConcelhoId(rs.getInt(i++));

		return l;
	}

}
