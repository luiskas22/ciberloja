package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.DireccionDAO;
import com.luis.ciberloja.dao.impl.DireccionDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.DireccionDTO;
import com.luis.ciberloja.model.Pedido;
import com.luis.ciberloja.service.DireccionService;

public class DireccionServiceImpl implements DireccionService {

	private DireccionDAO direccionDAO = null;
	private static Logger logger = LogManager.getLogger();

	public DireccionServiceImpl() {
		direccionDAO = new DireccionDAOImpl();
	}

	public boolean delete(Long id) throws DataException {

		Connection con = null;
		boolean d = false;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			d = direccionDAO.delete(con, id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return d;
	}

	public boolean update(DireccionDTO d) throws DataException {

		Connection con = null;
		boolean di = false;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			di = direccionDAO.update(con, d);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return di;
	}

	public Long create(DireccionDTO d) throws DataException {

		Connection con = null;
		Long id = null;
		boolean commit = true;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			id = direccionDAO.create(con, d);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return id;
	}

	@Override
	public DireccionDTO findById(Long id) throws DataException {

		Connection con = null;
		DireccionDTO d = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			d = direccionDAO.findById(con, id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return d;
	}

	@Override
	public List<DireccionDTO> findByClienteId(Long clienteId) throws DataException {
		List<DireccionDTO> direcciones = new ArrayList<DireccionDTO>();
		Connection con = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			direcciones = direccionDAO.findByClienteId(con, clienteId);
			commit = true;
			
		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return direcciones;
	}
}
