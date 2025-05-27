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
import com.luis.ciberloja.dao.LineaPedidoDAO;
import com.luis.ciberloja.dao.PedidoDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.LineaPedido;
import com.luis.ciberloja.model.Pedido;
import com.luis.ciberloja.model.PedidoCriteria;
import com.luis.ciberloja.model.Results;

public class PedidoDAOImpl implements PedidoDAO {

	private static Logger logger = LogManager.getLogger(PedidoDAOImpl.class);
	private LineaPedidoDAO lineaPedidoDAO = null;

	public PedidoDAOImpl() {
		lineaPedidoDAO = new LineaPedidoDAOImpl();
	}

	public Results<Pedido> findByCriteria(Connection con, PedidoCriteria p, int pos, int pageSize)
			throws DataException {
		Results<Pedido> resultados = new Results<Pedido>();
		List<String> condiciones = new ArrayList<String>();
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			StringBuilder query = new StringBuilder(
					" SELECT DISTINCT P.ID, P.FECHA_REALIZACION, P.PRECIO, P.CLIENTE_ID, C.NICKNAME, P.TIPO_ESTADO_PEDIDO_ID, EP.NOMBRE ")
					.append(" FROM PEDIDO P ").append(" INNER JOIN CLIENTE C ON C.ID = P.CLIENTE_ID")
					.append(" INNER JOIN ESTADO_PEDIDO EP ON EP.ID = P.TIPO_ESTADO_PEDIDO_ID")
					.append(" LEFT JOIN LINEA_PEDIDO LP ON LP.PEDIDO_ID = P.ID") // Join with linea_pedido
					.append(" LEFT JOIN PRODUCTO PR ON PR.ARTIGO = LP.PRODUCTO_ID"); // Join with producto

			if (p.getId() != null) {
				condiciones.add(" P.ID = ? ");
			} else {
				if (p.getFechaDesde() != null) {
					condiciones.add(" P.FECHA_REALIZACION >= ? ");
				}
				if (p.getFechaHasta() != null) {
					condiciones.add(" P.FECHA_REALIZACION <= ? ");
				}
				if (p.getPrecioDesde() != null) {
					condiciones.add(" P.PRECIO >= ? ");
				}
				if (p.getPrecioHasta() != null) {
					condiciones.add(" P.PRECIO <= ? ");
				}
				if (p.getClienteId() != null) {
					condiciones.add(" P.CLIENTE_ID = ? ");
				}
				if (p.getTipoEstadoPedidoId() != null) {
					condiciones.add(" P.TIPO_ESTADO_PEDIDO_ID = ? ");
				}
				if (p.getProductoId() != null) {
					condiciones.add(" LP.PRODUCTO_ID = ? "); // Filter by product ID
				}
				if (p.getDescripcionProducto() != null && !p.getDescripcionProducto().trim().isEmpty()) {
					condiciones.add(" PR.DESCRIPCION LIKE ? "); // Filter by product description
				}
			}

			if (!condiciones.isEmpty()) {
				query.append(" WHERE ");
				query.append(String.join(" AND ", condiciones));
			}

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			if (p.getId() != null) {
				pst.setLong(i++, p.getId());
			} else {
				if (p.getFechaDesde() != null) {
					pst.setDate(i++, new java.sql.Date(p.getFechaDesde().getTime()));
				}
				if (p.getFechaHasta() != null) {
					pst.setDate(i++, new java.sql.Date(p.getFechaHasta().getTime()));
				}
				if (p.getPrecioDesde() != null) {
					pst.setDouble(i++, p.getPrecioDesde());
				}
				if (p.getPrecioHasta() != null) {
					pst.setDouble(i++, p.getPrecioHasta());
				}
				if (p.getClienteId() != null) {
					pst.setLong(i++, p.getClienteId());
				}
				if (p.getTipoEstadoPedidoId() != null) {
					pst.setInt(i++, p.getTipoEstadoPedidoId());
				}
				if (p.getProductoId() != null) {
					pst.setString(i++, p.getProductoId()); // Set product ID parameter
				}
				if (p.getDescripcionProducto() != null && !p.getDescripcionProducto().trim().isEmpty()) {
					pst.setString(i++, "%" + p.getDescripcionProducto().trim() + "%"); // Set description parameter with
																						// wildcards
				}
			}

			rs = pst.executeQuery();

			int count = 0;
			if ((pos >= 1) && rs.absolute(pos)) {
				do {
					resultados.getPage().add(loadNext(con, rs));
					count++;
				} while (count < pageSize && rs.next());
			}
			resultados.setTotal(JDBCUtils.getTotalRows(rs));

		} catch (SQLException e) {
			logger.error("PedidoCriteria: " + p, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return resultados;
	}

	public Pedido findBy(Connection con, Long id) throws DataException {
		Pedido p = null;
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			StringBuilder query = new StringBuilder(
					" SELECT P.ID, P.FECHA_REALIZACION, P.PRECIO, P.CLIENTE_ID, C.NICKNAME, P.TIPO_ESTADO_PEDIDO_ID, EP.NOMBRE ")
					.append(" FROM PEDIDO P ").append(" INNER JOIN CLIENTE C ON C.ID = P.CLIENTE_ID ")
					.append(" INNER JOIN ESTADO_PEDIDO EP ON EP.ID = P.TIPO_ESTADO_PEDIDO_ID ")
					.append(" WHERE P.ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			pst.setLong(i++, id);

			rs = pst.executeQuery();

			if (rs.next()) {
				p = loadNext(con, rs);
			}

		} catch (SQLException e) {
			logger.error("ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return p;
	}

	public Long create(Connection con, Pedido p) throws DataException {

		PreparedStatement ps = null;
		ResultSet rs = null;

		try {

			ps = con.prepareStatement(
					" INSERT INTO PEDIDO(FECHA_REALIZACION, PRECIO, CLIENTE_ID, TIPO_ESTADO_PEDIDO_ID) "
							+ " VALUES(?,?,?,?)",
					Statement.RETURN_GENERATED_KEYS);

			int i = 1;
			ps.setDate(i++, new java.sql.Date(p.getFechaRealizacion().getTime()));
			ps.setDouble(i++, p.getPrecio());
			ps.setLong(i++, p.getClienteId());
			ps.setInt(i++, p.getTipoEstadoPedidoId());

			int insertedRows = ps.executeUpdate();

			if (insertedRows != 1) {
				// throw new Excepction
			}

			rs = ps.getGeneratedKeys();

			if (rs.next()) {
				Long id = rs.getLong(1);
				p.setId(id);
				lineaPedidoDAO.create(con, p.getId(), p.getLineas());
				return id;
			}

		} catch (SQLException e) {
			logger.error("Pedido: " + p, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(ps, rs);
		}
		return p.getId();

	}

	public boolean update(Connection con, Pedido p) throws DataException {

		PreparedStatement pst = null;

		try {

			pst = con.prepareStatement(" UPDATE PEDIDO SET " + " FECHA_REALIZACION = ?, " + " PRECIO = ?, "
					+ " CLIENTE_ID = ?, " + " TIPO_ESTADO_PEDIDO_ID = ? " + " WHERE ID = ?");
			int i = 1;
			pst.setDate(i++, new java.sql.Date(p.getFechaRealizacion().getTime()));
			pst.setDouble(i++, p.getPrecio());
			pst.setLong(i++, p.getClienteId());
			pst.setInt(i++, p.getTipoEstadoPedidoId());
			pst.setLong(i++, p.getId());

			int updatedRows = pst.executeUpdate();

			if (updatedRows != 1) {
				// Normalmente será porque lo ha borrado
				// otro proceso
				return false;
			}

			lineaPedidoDAO.deleteByPedido(con, p.getId());
			lineaPedidoDAO.create(con, p.getId(), p.getLineas());

		} catch (SQLException e) {
			logger.error("Pedido: " + p, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
		return true;
	}

	public boolean delete(Connection con, Long id) throws DataException {

		PreparedStatement pst = null;

		try {

			lineaPedidoDAO.deleteByPedido(con, id);

			pst = con.prepareStatement(" DELETE FROM PEDIDO WHERE ID = ?");

			int i = 1;
			pst.setLong(i++, id);

			int deletedRows = pst.executeUpdate();

			if (deletedRows == 0) {
				// No pasa nada realmente, seguramente
				// ha sido ya ha sido borrado en otro proceso
				return false;
			}

		} catch (SQLException e) {
			logger.error("ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
		return true;
	}

	@Override
	public Results<Pedido> findPedidosByClienteId(Connection con, Long clienteId) throws DataException {
		Results<Pedido> resultados = new Results<Pedido>();
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			StringBuilder query = new StringBuilder(
					" SELECT P.ID, P.FECHA_REALIZACION, P.PRECIO, P.CLIENTE_ID, C.NICKNAME, P.TIPO_ESTADO_PEDIDO_ID, EP.NOMBRE "
							+ " FROM PEDIDO P " + " INNER JOIN CLIENTE C ON C.ID = P.CLIENTE_ID "
							+ " INNER JOIN ESTADO_PEDIDO EP ON EP.ID = P.TIPO_ESTADO_PEDIDO_ID "
							+ " WHERE P.CLIENTE_ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			pst.setLong(1, clienteId);

			rs = pst.executeQuery();

			List<Pedido> pedidos = new ArrayList<>();
			while (rs.next()) {
				pedidos.add(loadNext(con, rs));
			}

			resultados.setPage(pedidos);
			resultados.setTotal(pedidos.size()); // Como no hay paginación, el total es el tamaño de la lista

			if (logger.isDebugEnabled()) {
				logger.debug("Pedidos encontrados para clienteId {}: {}", clienteId, pedidos.size());
			}

			return resultados;

		} catch (SQLException e) {
			logger.error("Error al buscar pedidos para clienteId: " + clienteId, e);
			throw new DataException("Error al buscar pedidos por clienteId: " + clienteId, e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
	}

	protected Pedido loadNext(Connection con, ResultSet rs) throws SQLException, DataException {

		int i = 1;
		Pedido p = new Pedido();

		p.setId(rs.getLong(i++));
		p.setFechaRealizacion(rs.getDate(i++));
		p.setPrecio(rs.getDouble(i++));
		p.setClienteId(rs.getLong(i++));
		p.setNickname(rs.getString(i++));
		p.setTipoEstadoPedidoId(rs.getInt(i++));
		p.setTipoEstadoPedidoNombre(rs.getString(i++));

		List<LineaPedido> lineas = lineaPedidoDAO.findByPedido(con, p.getId());
		p.setLineas(lineas);

		return p;
	}

}
