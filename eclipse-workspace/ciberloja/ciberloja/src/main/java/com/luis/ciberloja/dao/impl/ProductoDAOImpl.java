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
	public Results<ProductoDTO> findBy(Connection con, ProductoCriteria criteria, int pageNumber, int pageSize)
			throws DataException {

		Results<ProductoDTO> resultados = new Results<>();
		List<String> condiciones = new ArrayList<>();
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			StringBuilder query = new StringBuilder(
					"SELECT p.ARTIGO, p.DESCRICAO, p.PVP3, p.STOCK, p.FAMILIA, f.DESCRICAO AS FAMILIA_DESCRIPCION "
							+ "FROM PRODUCTO p LEFT JOIN FAMILIA f ON p.FAMILIA = f.FAMILIA");

			// Añadir condiciones dinámicamente
			if (criteria.getArtigo() != null) {
				condiciones.add("p.ARTIGO = ?");
			}
			if (criteria.getDescripcion() != null && !criteria.getDescripcion().trim().isEmpty()) {
				condiciones.add("UPPER(p.DESCRICAO) LIKE ?");
			}
			if (criteria.getPvp3Min() != null) {
				condiciones.add("p.PVP3 >= ?");
			}
			if (criteria.getPvp3Max() != null) {
				condiciones.add("p.PVP3 <= ?");
			}
			if (criteria.getStockMin() != null) {
				condiciones.add("p.STOCK >= ?");
			}
			if (criteria.getStockMax() != null) {
				condiciones.add("p.STOCK <= ?");
			}
			if (criteria.getFamiliaNombre() != null && !criteria.getFamiliaNombre().trim().isEmpty()) {
				condiciones.add("UPPER(f.DESCRICAO) LIKE ?");
			}

			// Agregar cláusula WHERE si hay condiciones
			if (!condiciones.isEmpty()) {
				query.append(" WHERE ").append(String.join(" AND ", condiciones));
			}

			// Agregar ORDER BY para consistencia en paginación
			query.append(" ORDER BY p.ARTIGO");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			// Asignar valores a los parámetros
			int paramIndex = 1;
			if (criteria.getArtigo() != null) {
				pst.setString(paramIndex++, criteria.getArtigo());
			}
			if (criteria.getDescripcion() != null && !criteria.getDescripcion().trim().isEmpty()) {
				pst.setString(paramIndex++, "%" + criteria.getDescripcion().trim().toUpperCase() + "%");
			}
			if (criteria.getPvp3Min() != null) {
				pst.setDouble(paramIndex++, criteria.getPvp3Min());
			}
			if (criteria.getPvp3Max() != null) {
				pst.setDouble(paramIndex++, criteria.getPvp3Max());
			}
			if (criteria.getStockMin() != null) {
				pst.setDouble(paramIndex++, criteria.getStockMin());
			}
			if (criteria.getStockMax() != null) {
				pst.setDouble(paramIndex++, criteria.getStockMax());
			}
			if (criteria.getFamiliaNombre() != null && !criteria.getFamiliaNombre().trim().isEmpty()) {
				pst.setString(paramIndex++, "%" + criteria.getFamiliaNombre().trim().toUpperCase() + "%");
			}

			rs = pst.executeQuery();

			// CORRECCIÓN: Calcular la posición inicial correctamente
			// Si pageNumber = 1, startPos = 1
			// Si pageNumber = 2, startPos = 31 (para pageSize = 30)
			// Si pageNumber = 3, startPos = 61, etc.
			int startPos = ((pageNumber - 1) * pageSize) + 1;

			int count = 0;
			// Vamos a la posición inicial de carga
			if (startPos >= 1 && rs.absolute(startPos)) {
				// Carga la página de datos
				do {
					resultados.getPage().add(loadNext(rs));
					count++;
				} while (count < pageSize && rs.next());
			}

			// Configura el total de resultados encontrados
			resultados.setTotal(JDBCUtils.getTotalRows(rs));

		} catch (SQLException e) {
			logger.error("Producto criteria: " + criteria, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return resultados;
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