package com.luis.ciberloja.dao.impl;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.ProductoDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.Results;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ProductoDAOImpl implements ProductoDAO {

	private static final Logger logger = LogManager.getLogger(ProductoDAOImpl.class);

	public ProductoDAOImpl() {
	}

	@Override
	public ProductoDTO findById(Connection con, String id) throws DataException {
		ProductoDTO p = null;
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			String query = "SELECT p.ARTIGO, p.DESCRICAO, p.PVP3, p.STOCK, p.FAMILIA, f.DESCRICAO AS FAMILIA_DESCRIPCION "
					+ "FROM PRODUCTO p JOIN FAMILIA f ON p.FAMILIA = f.FAMILIA WHERE p.ARTIGO = ?";

			pst = con.prepareStatement(query, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			pst.setString(1, id);

			rs = pst.executeQuery();

			if (rs.next()) {
				p = loadNext(rs);
			}

		} catch (SQLException e) {
			logger.error("Error finding product with ID: {}", id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return p;
	}

	@Override
	public String create(Connection con, ProductoDTO p) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		try {
			// Validate familia exists to avoid foreign key violation
			if (p.getFamilia() != null) {
				String checkQuery = "SELECT 1 FROM FAMILIA WHERE FAMILIA = ?";
				PreparedStatement checkStmt = con.prepareStatement(checkQuery);
				checkStmt.setString(1, p.getFamilia());
				ResultSet checkRs = checkStmt.executeQuery();
				if (!checkRs.next()) {
					throw new DataException("Familia " + p.getFamilia() + " does not exist for product " + p.getId());
				}
				JDBCUtils.close(checkStmt, checkRs);
			}

			pst = con.prepareStatement(
					"INSERT INTO PRODUCTO (ARTIGO, DESCRIPCION, PVP3, STOCK, FAMILIA) VALUES (?, ?, ?, ?, ?)",
					Statement.RETURN_GENERATED_KEYS);

			int i = 1;
			pst.setString(i++, p.getId());
			JDBCUtils.setNullable(pst, i++, p.getNombre());
			pst.setDouble(i++, p.getPrecio() != null ? p.getPrecio() : 0.0);
			pst.setDouble(i++, p.getStockDisponible() != null ? p.getStockDisponible() : 0.0);
			JDBCUtils.setNullable(pst, i++, p.getFamilia());

			int insertedRows = pst.executeUpdate();

			if (insertedRows != 1) {
				throw new DataException("Error inserting product");
			}

			rs = pst.getGeneratedKeys();
			if (rs.next()) {
				return rs.getString(1);
			} else {
				throw new DataException("Unable to retrieve generated ID for inserted product");
			}
		} catch (SQLException e) {
			logger.error("Error creating product: {}", p, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
	}

	@Override
	public Results<ProductoDTO> findBy(Connection con, ProductoCriteria criteria, int pos, int pageSize)
			throws DataException {
		Results<ProductoDTO> resultados = new Results<>();
		PreparedStatement pst = null;
		ResultSet rs = null;
		List<String> condiciones = new ArrayList<>();
		List<Object> params = new ArrayList<>();

		try {
			StringBuilder query = new StringBuilder(
					"SELECT p.ARTIGO, p.DESCRICAO, p.PVP3, p.STOCK, p.FAMILIA, f.DESCRICAO AS FAMILIA_DESCRIPCION "
							+ "FROM PRODUCTO p LEFT JOIN FAMILIA f ON p.FAMILIA = f.FAMILIA");

			if (criteria.getArtigo() != null) {
				condiciones.add("p.ARTIGO = ?");
				params.add(criteria.getArtigo());
			}
			if (criteria.getDescripcion() != null && !criteria.getDescripcion().isEmpty()) {
				condiciones.add("UPPER(p.DESCRIPCION) LIKE ?");
				params.add("%" + criteria.getDescripcion().toUpperCase() + "%");
			}
			if (criteria.getPvp3Min() != null) {
				condiciones.add("p.PVP3 >= ?");
				params.add(criteria.getPvp3Min());
			}
			if (criteria.getPvp3Max() != null) {
				condiciones.add("p.PVP3 <= ?");
				params.add(criteria.getPvp3Max());
			}
			if (criteria.getStockMin() != null) {
				condiciones.add("p.STOCK >= ?");
				params.add(criteria.getStockMin());
			}
			if (criteria.getStockMax() != null) {
				condiciones.add("p.STOCK <= ?");
				params.add(criteria.getStockMax());
			}
			if (criteria.getFamiliaNombre() != null && !criteria.getFamiliaNombre().isEmpty()) {
				condiciones.add("UPPER(f.DESCRIPCION) LIKE ?");
				params.add("%" + criteria.getFamiliaNombre().toUpperCase() + "%");
			}

			if (!condiciones.isEmpty()) {
				query.append(" WHERE ").append(String.join(" AND ", condiciones));
			}

			query.append(" LIMIT ? OFFSET ?");
			params.add(pageSize);
			params.add(pos);

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			for (int i = 0; i < params.size(); i++) {
				pst.setObject(i + 1, params.get(i));
			}

			rs = pst.executeQuery();

			int count = 0;
			if ((pos >= 0) && rs.absolute(pos + 1)) {
				do {
					resultados.getPage().add(loadNext(rs));
					count++;
				} while (count < pageSize && rs.next());
			}

			String countQuery = "SELECT COUNT(*) FROM PRODUCTO p LEFT JOIN FAMILIA f ON p.FAMILIA = f.FAMILIA"
					+ (condiciones.isEmpty() ? "" : " WHERE " + String.join(" AND ", condiciones));
			PreparedStatement countStmt = con.prepareStatement(countQuery);
			for (int i = 0; i < params.size() - 2; i++) {
				countStmt.setObject(i + 1, params.get(i));
			}
			ResultSet countRs = countStmt.executeQuery();
			if (countRs.next()) {
				resultados.setTotal(countRs.getInt(1));
			}
//            JDBCUtils.close(countStmt, checkRs);

		} catch (SQLException e) {
			logger.error("Error in findBy criteria: {}", criteria, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return resultados;
	}

	@Override
	public boolean update(Connection con, ProductoDTO p) throws DataException {
		PreparedStatement pst = null;
		try {
			// Validate familia exists to avoid foreign key violation
			if (p.getFamilia() != null) {
				String checkQuery = "SELECT 1 FROM FAMILIA WHERE FAMILIA = ?";
				PreparedStatement checkStmt = con.prepareStatement(checkQuery);
				checkStmt.setString(1, p.getFamilia());
				ResultSet checkRs = checkStmt.executeQuery();
				if (!checkRs.next()) {
					throw new DataException("Familia " + p.getFamilia() + " does not exist for product " + p.getId());
				}
				JDBCUtils.close(checkStmt, checkRs);
			}

			pst = con.prepareStatement(
					"UPDATE PRODUCTO SET DESCRIPCION = ?, PVP3 = ?, STOCK = ?, FAMILIA = ? WHERE ARTIGO = ?");

			int i = 1;
			JDBCUtils.setNullable(pst, i++, p.getNombre());
			pst.setDouble(i++, p.getPrecio() != null ? p.getPrecio() : 0.0);
			pst.setDouble(i++, p.getStockDisponible() != null ? p.getStockDisponible() : 0.0);
			JDBCUtils.setNullable(pst, i++, p.getFamilia());
			pst.setString(i++, p.getId());

			int updatedRows = pst.executeUpdate();

			if (updatedRows == 0) {
				logger.warn("No product updated with ID: {}", p.getId());
				return false;
			}

			return true;

		} catch (SQLException e) {
			logger.error("Error updating product: {}", p, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
	}

	@Override
	public boolean delete(Connection con, String id) throws DataException {
		PreparedStatement pst = null;
		try {
			ProductoDTO existingProducto = findById(con, id);
			if (existingProducto == null) {
				logger.warn("Attempt to delete non-existent product. ID: {}", id);
				return false;
			}

			pst = con.prepareStatement("DELETE FROM PRODUCTO WHERE ARTIGO = ?");
			pst.setString(1, id);

			int deletedRows = pst.executeUpdate();

			if (deletedRows == 0) {
				logger.warn("No product deleted with ID: {}", id);
				return false;
			}

			logger.info("Product deleted successfully. ID: {}", id);
			return true;

		} catch (SQLException e) {
			logger.error("Error deleting product. ID: {}", id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
	}

	protected ProductoDTO loadNext(ResultSet rs) throws SQLException {
		ProductoDTO p = new ProductoDTO();
		int i = 1;

		p.setId(rs.getString(i++));
		p.setNombre(rs.getString(i++));
		p.setPrecio(rs.getDouble(i++));
		p.setStockDisponible(rs.getDouble(i++));
		p.setFamilia(rs.getString(i++));
		p.setFamiliaNombre(rs.getString(i++));

		return p;
	}
}