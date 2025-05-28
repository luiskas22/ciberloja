package com.luis.ciberloja.service.impl;

import java.sql.Connection;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.ProductoDAO;
import com.luis.ciberloja.dao.impl.ProductoDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.Results;
import com.luis.ciberloja.service.ProductoService;

@Service
public class ProductoServiceImpl implements ProductoService {
	private ProductoDAO productoDAO = null;

	private static Logger logger = LogManager.getLogger(ProductoServiceImpl.class);

	public ProductoServiceImpl() {
		productoDAO = new ProductoDAOImpl();
	}

	@Override
	public ProductoDTO findById(String id) throws DataException {
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
	public Results<ProductoDTO> findByDestaques(int pos, int pageSize) throws DataException {
		Connection con = null;
		boolean commit = false;

		Results<ProductoDTO> resultados = null;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			resultados = productoDAO.findByDestaques(con, pos, pageSize);
			commit = true;

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return resultados;
	}
}
