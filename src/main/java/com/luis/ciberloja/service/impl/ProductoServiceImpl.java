package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.ProductoDAO;
import com.luis.ciberloja.dao.impl.ProductoDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.Results;
import com.luis.ciberloja.service.ProductoService;

public class ProductoServiceImpl implements ProductoService {
	private ProductoDAO productoDAO = null;

	private static Logger logger = LogManager.getLogger(ProductoServiceImpl.class);

	public ProductoServiceImpl() {
		productoDAO = new ProductoDAOImpl();
	}

	@Override
	public ProductoDTO findById(Long id) throws DataException {
		ProductoDTO p = null;
		Connection con = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			p = productoDAO.findById(con, id);
			commit = true;

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return p;
	}

	@Override
	public Long create(ProductoDTO p) throws DataException {
		Connection con = null;
		boolean commit = false;
		Long id = null;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			id = productoDAO.create(con, p);
			commit = true;

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return id;
	}

	@Override
	public Results<ProductoDTO> findBy(ProductoCriteria criteria, int pos, int pageSize) throws DataException {
		Connection con = null;
		boolean commit = false;

		Results<ProductoDTO> resultados = null;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			resultados = productoDAO.findBy(con, criteria, pos, pageSize);
			commit = true;

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return resultados;
	}

	@Override
	public boolean update(ProductoDTO p) throws DataException {
		boolean pro = false;
		Connection con = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			pro = productoDAO.update(con, p);
			commit = true;

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return pro;
	}

	@Override
	public boolean delete(Long id) throws DataException {
		boolean pro = false;
		Connection con = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			pro = productoDAO.delete(con, id);
			commit = true;

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return pro;
	}

	
}
