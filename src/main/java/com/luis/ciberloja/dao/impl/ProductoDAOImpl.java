package com.luis.ciberloja.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.CategoriaDAO;
import com.luis.ciberloja.dao.MarcaDAO;
import com.luis.ciberloja.dao.ProductoDAO;
import com.luis.ciberloja.dao.UnidadMedidaDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.dao.util.SQLUtils;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.Results;

public class ProductoDAOImpl implements ProductoDAO {

	private static Logger logger = LogManager.getLogger(ProductoDAOImpl.class);

	public ProductoDAOImpl() {

	}

	@Override
	public ProductoDTO findById(Connection con, Long id) throws DataException {
		ProductoDTO p = null;
		Statement stmt = null;
		ResultSet rs = null;

		try {

			stmt = con.createStatement();

			rs = stmt.executeQuery(" SELECT p.ID, p.NOMBRE, p.DESCRIPCION, p.PRECIO, p.STOCK_DISPONIBLE, "
					+ " c.ID AS ID_CATEGORIA, c.NOMBRE AS NOMBRE_CATEGORIA, "
					+ " m.ID AS ID_MARCA, m.NOMBRE AS NOMBRE_MARCA, "
					+ " u.ID AS ID_UNIDAD_MEDIDA, u.NOMBRE AS NOMBRE_UNIDAD_MEDIDA " + " FROM PRODUCTO p "
					+ " JOIN CATEGORIA c ON p.ID_CATEGORIA = c.ID " + " JOIN MARCA m ON p.ID_MARCA = m.ID "
					+ " JOIN UNIDAD_MEDIDA u ON p.ID_UNIDAD_MEDIDA = u.ID " + " WHERE p.ID = " + id);

			if (rs.next()) {
				p = loadNext(rs);
			}

		} catch (SQLException e) {
			logger.error("ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(stmt, rs);
		}
		return p;
	}

	@Override
	public Long create(Connection con, ProductoDTO p) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		try {
			pst = con.prepareStatement(
					"INSERT INTO PRODUCTO (NOMBRE, DESCRIPCION, PRECIO, STOCK_DISPONIBLE, ID_CATEGORIA, ID_MARCA, ID_UNIDAD_MEDIDA) "
							+ "VALUES (?, ?, ?, ?, ?, ?, ?)",
					Statement.RETURN_GENERATED_KEYS);

			int i = 1;
			JDBCUtils.setNullable(pst, i++, p.getNombre()); // Maneja null explícitamente
			JDBCUtils.setNullable(pst, i++, p.getDescripcion()); // Maneja null explícitamente
			pst.setDouble(i++, p.getPrecio());
			pst.setInt(i++, p.getStockDisponible());
			pst.setLong(i++, p.getIdCategoria());
			pst.setLong(i++, p.getIdMarca());
			pst.setLong(i++, p.getIdUnidadMedida());

			int insertedRows = pst.executeUpdate();

			if (insertedRows != 1) {
				throw new DataException("Error al insertar el producto");
			}

			rs = pst.getGeneratedKeys();
			if (rs.next()) {
				Long id = rs.getLong(1);
				p.setId(id);
				return id; // Eliminamos las llamadas a findAll si no son necesarias
			} else {
				throw new DataException("No se pudo obtener el ID del producto insertado");
			}
		} catch (SQLException e) {
			logger.error("Error al insertar producto: " + p, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs); // Cerramos tanto el PreparedStatement como el ResultSet
		}
	}

	public Results<ProductoDTO> findBy(Connection con, ProductoCriteria criteria, int pos, int pageSize)
			throws DataException {
		Results<ProductoDTO> resultados = new Results<>();
		PreparedStatement pst = null;
		ResultSet rs = null;
		List<String> condiciones = new ArrayList<>();

		try {
			StringBuilder query = new StringBuilder(
					"SELECT P.ID, P.NOMBRE, P.DESCRIPCION, P.PRECIO, P.STOCK_DISPONIBLE, "
							+ "P.ID_CATEGORIA, C.NOMBRE AS NOMBRE_CATEGORIA, "
							+ "P.ID_MARCA, M.NOMBRE AS NOMBRE_MARCA, "
							+ "P.ID_UNIDAD_MEDIDA, UM.NOMBRE AS NOMBRE_UNIDAD_MEDIDA " + "FROM PRODUCTO P "
							+ "LEFT JOIN CATEGORIA C ON P.ID_CATEGORIA = C.ID "
							+ "LEFT JOIN MARCA M ON P.ID_MARCA = M.ID "
							+ "LEFT JOIN UNIDAD_MEDIDA UM ON P.ID_UNIDAD_MEDIDA = UM.ID ");

			// Criterios de búsqueda
			if (criteria.getId() != null) {
				condiciones.add(" P.ID = ? ");
			}

			// Criterios de búsqueda
			if (criteria.getNombre() != null && !criteria.getNombre().isEmpty()) {
				condiciones.add(" P.NOMBRE LIKE ? ");
			}
			if (criteria.getDescripcion() != null && !criteria.getDescripcion().isEmpty()) {
				condiciones.add(" P.DESCRIPCION LIKE ? ");
			}
			if (criteria.getPrecioMin() != null) {
				condiciones.add(" P.PRECIO >= ? ");
			}
			if (criteria.getPrecioMax() != null) {
				condiciones.add(" P.PRECIO <= ? ");
			}
			if (criteria.getStockMin() != null) {
				condiciones.add(" P.STOCK_DISPONIBLE >= ? ");
			}
			if (criteria.getStockMax() != null) {
				condiciones.add(" P.STOCK_DISPONIBLE <= ? ");
			}
			if (criteria.getNombreCategoria() != null && !criteria.getNombreCategoria().isEmpty()) {
				condiciones.add(" C.NOMBRE LIKE ? ");
			}
			if (criteria.getNombreMarca() != null && !criteria.getNombreMarca().isEmpty()) {
				condiciones.add(" M.NOMBRE LIKE ? ");
			}
			if (criteria.getNombreUnidadMedida() != null && !criteria.getNombreUnidadMedida().isEmpty()) {
				condiciones.add(" UM.NOMBRE LIKE ? ");
			}

			if (!condiciones.isEmpty()) {
				query.append(" WHERE ");
				query.append(String.join(" AND ", condiciones));
			}

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			// Configura parámetros
			
			if (criteria.getId() != null) {
				pst.setLong(i++, criteria.getId());
			}
			
			if (criteria.getNombre() != null && !criteria.getNombre().isEmpty()) {
				pst.setString(i++, "%" + criteria.getNombre().toUpperCase() + "%");
			}
			if (criteria.getDescripcion() != null && !criteria.getDescripcion().isEmpty()) {
				pst.setString(i++, "%" + criteria.getDescripcion().toUpperCase() + "%");
			}
			if (criteria.getPrecioMin() != null) {
				pst.setDouble(i++, criteria.getPrecioMin());
			}
			if (criteria.getPrecioMax() != null) {
				pst.setDouble(i++, criteria.getPrecioMax());
			}
			if (criteria.getStockMin() != null) {
				pst.setInt(i++, criteria.getStockMin());
			}
			if (criteria.getStockMax() != null) {
				pst.setInt(i++, criteria.getStockMax());
			}
			if (criteria.getNombreCategoria() != null && !criteria.getNombreCategoria().isEmpty()) {
				pst.setString(i++, "%" + criteria.getNombreCategoria().toUpperCase() + "%");
			}
			if (criteria.getNombreMarca() != null && !criteria.getNombreMarca().isEmpty()) {
				pst.setString(i++, "%" + criteria.getNombreMarca().toUpperCase() + "%");
			}
			if (criteria.getNombreUnidadMedida() != null && !criteria.getNombreUnidadMedida().isEmpty()) {
				pst.setString(i++, "%" + criteria.getNombreUnidadMedida().toUpperCase() + "%");
			}

			rs = pst.executeQuery();

			int count = 0;
			// Vamos a la posición inicial de carga
			if ((pos >= 1) && rs.absolute(pos)) {
				// Carga la página de datos
				do {
					resultados.getPage().add(loadNext(rs));
					count++;
				} while (count < pageSize && rs.next());
			}

			// Configura el total de resultados encontrados
			resultados.setTotal(JDBCUtils.getTotalRows(rs));

		} catch (SQLException e) {
			logger.error("Error en findBy criteria: " + criteria, e);
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
			// Actualización de producto con campos más completos
			pst = con.prepareStatement("UPDATE PRODUCTO SET " + "NOMBRE = ?, " + "DESCRIPCION = ?, " + "PRECIO = ?, "
					+ "STOCK_DISPONIBLE = ?, " + "ID_CATEGORIA = ?, " + "ID_MARCA = ?, " + "ID_UNIDAD_MEDIDA = ? "
					+ "WHERE ID = ?");

			int i = 1;
			pst.setString(i++, p.getNombre());
			pst.setString(i++, p.getDescripcion());
			pst.setDouble(i++, p.getPrecio());
			pst.setInt(i++, p.getStockDisponible());

			// Manejar posibles nulos para referencias
			if (p.getIdCategoria() != null) {
				pst.setLong(i++, p.getIdCategoria());
			} else {
				pst.setNull(i++, java.sql.Types.BIGINT);
			}

			if (p.getIdMarca() != null) {
				pst.setLong(i++, p.getIdMarca());
			} else {
				pst.setNull(i++, java.sql.Types.BIGINT);
			}

			if (p.getIdUnidadMedida() != null) {
				pst.setLong(i++, p.getIdUnidadMedida());
			} else {
				pst.setNull(i++, java.sql.Types.BIGINT);
			}

			pst.setLong(i++, p.getId());

			int updatedRows = pst.executeUpdate();

			if (updatedRows == 0) {
				logger.warn("No se actualizó ningún producto con ID: " + p.getId());
				return false;
			}

			return true;

		} catch (SQLException e) {
			logger.error("Error al actualizar producto: " + p, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
	}

	@Override
	public boolean delete(Connection con, Long id) throws DataException {
		PreparedStatement pst = null;
		try {
			ProductoDTO existingProducto = findById(con, id);
			if (existingProducto == null) {
				logger.warn("Intento de eliminar producto no existente. ID: " + id);
				return false;
			}

			pst = con.prepareStatement("DELETE FROM PRODUCTO WHERE ID = ?");
			pst.setLong(1, id);

			int deletedRows = pst.executeUpdate();

			if (deletedRows == 0) {
				logger.warn("No se eliminó ningún producto con ID: " + id);
				return false;
			}

			logger.info("Producto eliminado exitosamente. ID: " + id);
			return true;

		} catch (SQLException e) {
			logger.error("Error al eliminar producto. ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
	}

	protected ProductoDTO loadNext(ResultSet rs) throws SQLException, DataException {
		int i = 1;

		ProductoDTO p = new ProductoDTO();

		p.setId(rs.getLong(i++)); // ID
		p.setNombre(rs.getString(i++)); // NOMBRE
		p.setDescripcion(rs.getString(i++)); // DESCRIPCION
		p.setPrecio(rs.getDouble(i++)); // PRECIO
		p.setStockDisponible(rs.getInt(i++)); // STOCK_DISPONIBLE

		// IDs de categoría, marca, unidad de medida
		p.setIdCategoria(rs.getLong(i++)); // ID_CATEGORIA
		p.setNombreCategoria(rs.getString(i++)); // NOMBRE_CATEGORIA

		p.setIdMarca(rs.getLong(i++)); // ID_MARCA
		p.setNombreMarca(rs.getString(i++)); // NOMBRE_MARCA

		p.setIdUnidadMedida(rs.getLong(i++)); // ID_UNIDAD_MEDIDA
		p.setNombreUnidadMedida(rs.getString(i++)); // NOMBRE_UNIDAD_MEDIDA

		return p;
	}

}
