package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.ConcelhoDAO;
import com.luis.ciberloja.dao.impl.ConcelhoDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.Concelho;
import com.luis.ciberloja.model.Freguesia;
import com.luis.ciberloja.service.ConcelhoService;

public class ConcelhoServiceImpl implements ConcelhoService {
	private static Logger logger = LogManager.getLogger(ConcelhoServiceImpl.class);
	private ConcelhoDAO concelhoDAO = null;

	public ConcelhoServiceImpl() {
		concelhoDAO = new ConcelhoDAOImpl();
	}

	@Override
	public Concelho findById(int id) throws DataException {
		Connection con = null;
		Concelho concelho = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			concelho = concelhoDAO.findById(con, id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return concelho;
	}

	@Override
	public List<Concelho> findAll() throws DataException {
		Connection con = null;
		List<Concelho> concelhos = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			concelhos = concelhoDAO.findAll(con);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return concelhos;
	}
}
