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
import com.luis.ciberloja.dao.DireccionDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.DireccionDTO;

public class DireccionDAOImpl implements DireccionDAO {

	private static Logger logger = LogManager.getLogger(DireccionDAOImpl.class);

	public DireccionDAOImpl() {

	}

	@Override
	public DireccionDTO findById(Connection con, Long id) throws DataException {
		DireccionDTO direccion = null;
		Statement stmt = null;
		ResultSet rs = null;

		try {
			stmt = con.createStatement();

			rs = stmt.executeQuery(" SELECT " + " D.ID AS ID_DIRECCION, " + " D.NOMBRE_VIA, " + " D.DIR_VIA, "
					+ " D.CLIENTE_ID, " + " D.EMPLEADO_ID, " + " D.FREGUESIA_ID, " + " F.NOMBRE AS NOMBRE_FREGUESIA, "
					+ " C.ID AS ID_CONCELHO, " + " C.NOMBRE AS NOMBRE_CONCELHO, " + " DT.ID AS ID_DISTRITO, "
					+ " DT.NOMBRE AS NOMBRE_DISTRITO, " + " PA.ID AS ID_PAIS, " + " PA.NOMBRE AS NOMBRE_PAIS "
					+ " FROM DIRECCION D" + " JOIN FREGUESIA F ON F.ID = D.FREGUESIA_ID "
					+ " JOIN CONCELHO C ON C.ID = F.CONCELHO_ID " + " JOIN DISTRITO DT ON DT.ID = C.DISTRITO_ID "
					+ " JOIN PAIS PA ON PA.ID = DT.PAIS_ID " + "WHERE D.ID = " + id);

			if (rs.next()) {
				direccion = loadNext(rs);
			}

		} catch (SQLException e) {
			logger.error("ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(stmt, rs);
		}
		return direccion;
	}

	public DireccionDTO findByEmpleadoId(Connection con, Long empleadoId) throws DataException {

		DireccionDTO d = null;
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {

			StringBuilder query = new StringBuilder(
					" SELECT D.ID AS ID_DIRECCION, D.NOMBRE_VIA, D.DIR_VIA, D.CLIENTE_ID, D.EMPLEADO_ID, D.FREGUESIA_ID, F.NOMBRE AS NOMBRE_FREGUESIA, "
							+ " C.ID AS ID_CONCELHO, C.NOMBRE AS NOMBRE_CONCELHO, DT.ID AS ID_DISTRITO, DT.NOMBRE AS NOMBRE_DISTRITO ,PA.ID AS ID_PAIS, PA.NOMBRE AS NOMBRE_PAIS ")
					.append(" FROM DIRECCION D ").append(" INNER JOIN FREGUESIA F ON F.ID = D.FREGUESIA_ID ")
					.append(" INNER JOIN CONCELHO C ON C.ID = F.CONCELHO_ID ")
					.append(" INNER JOIN DISTRITO DT ON DT.ID = C.DISTRITO_ID ")
					.append(" INNER JOIN PAIS PA ON PA.ID = DT.PAIS_ID ").append(" WHERE D.EMPLEADO_ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			pst.setLong(i++, empleadoId);

			rs = pst.executeQuery();

			if (rs.next()) {
				d = loadNext(rs);
			}

		} catch (SQLException e) {
			logger.error("EmpleadoID: " + empleadoId, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return d;
	}

	public boolean delete(Connection con, Long id) throws DataException {

		PreparedStatement pst = null;

		try {

			pst = con.prepareStatement(" DELETE FROM DIRECCION WHERE ID = ? ");

			int i = 1;

			pst.setLong(i++, id);

			int deletedRows = pst.executeUpdate();

			if (deletedRows == 0) {
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

	public boolean update(Connection con, DireccionDTO d) throws DataException {

		PreparedStatement pst = null;

		try {

			pst = con.prepareStatement(
					" UPDATE DIRECCION SET NOMBRE_VIA = ?, DIR_VIA = ?, FREGUESIA_ID = ?, CLIENTE_ID = ?, EMPLEADO_ID = ? "
							+ " WHERE ID = ?");

			int i = 1;
			pst.setString(i++, d.getNombreVia());
			pst.setString(i++, d.getDirVia());
			pst.setInt(i++, d.getFreguesiaId());
			JDBCUtils.setNullable(pst, i++, d.getClienteId());
			JDBCUtils.setNullable(pst, i++, d.getEmpleadoId());
			pst.setLong(i++, d.getId());

			int updatedRows = pst.executeUpdate();

			if (updatedRows == 0) {
				return false;
			}

		} catch (SQLException e) {
			logger.error("DireccionDTO: " + d, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
		return true;
	}

	public Long create(Connection con, DireccionDTO d) throws DataException {

		PreparedStatement pst = null;
		ResultSet rs = null;

		try {

			pst = con.prepareStatement(
					" INSERT INTO DIRECCION (NOMBRE_VIA, DIR_VIA, FREGUESIA_ID, CLIENTE_ID, EMPLEADO_ID)"
							+ " VALUES(?,?,?,?,?)",
					Statement.RETURN_GENERATED_KEYS);

			int i = 1;
			JDBCUtils.setNullable(pst, i++, d.getNombreVia());
			JDBCUtils.setNullable(pst, i++, d.getDirVia());
			JDBCUtils.setNullable(pst, i++, d.getFreguesiaId());
			JDBCUtils.setNullable(pst, i++, d.getClienteId());
			JDBCUtils.setNullable(pst, i++, d.getEmpleadoId());

			int insertedRows = pst.executeUpdate();

			if (insertedRows != 1) {

			}

			rs = pst.getGeneratedKeys();

			if (rs.next()) {
				Long id = rs.getLong(1);
				d.setId(id);
				return id;
			}

		} catch (SQLException e) {
			logger.error("DireccionDTO: " + d, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}

		return null;
	}

	public boolean deleteByEmpleado(Connection con, Long empleadoId) throws DataException {

		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			pst = con.prepareStatement(" DELETE FROM DIRECCION WHERE EMPLEADO_ID = ? ");

			int i = 1;
			pst.setLong(i++, empleadoId);

			int deletedRows = pst.executeUpdate();

			if (deletedRows == 0) {
				return false;
			}

		} catch (SQLException e) {
			logger.error("EmpleadoID: " + empleadoId, e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(pst, rs);
		}
		return true;
	}

	public List<DireccionDTO> findByClienteId(Connection con, Long clienteId) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		List<DireccionDTO> direcciones = new ArrayList<>();

		try {
			StringBuilder query = new StringBuilder(
					" SELECT D.ID AS ID_DIRECCION, D.NOMBRE_VIA, D.DIR_VIA, D.CLIENTE_ID, D.EMPLEADO_ID, D.FREGUESIA_ID, F.NOMBRE AS NOMBRE_FREGUESIA, "
							+ " C.ID AS ID_CONCELHO, C.NOMBRE AS NOMBRE_CONCELHO, DT.ID AS ID_DISTRITO, DT.NOMBRE AS NOMBRE_DISTRITO ,PA.ID AS ID_PAIS, PA.NOMBRE AS NOMBRE_PAIS ")
					.append(" FROM DIRECCION D ").append(" INNER JOIN FREGUESIA F ON F.ID = D.FREGUESIA_ID ")
					.append(" INNER JOIN CONCELHO C ON C.ID = F.CONCELHO_ID ")
					.append(" INNER JOIN DISTRITO DT ON DT.ID = C.DISTRITO_ID ")
					.append(" INNER JOIN PAIS PA ON PA.ID = DT.PAIS_ID ").append(" WHERE D.CLIENTE_ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			pst.setLong(i++, clienteId);

			rs = pst.executeQuery();

			while (rs.next()) {
				DireccionDTO d = loadNext(rs);
				direcciones.add(d);
			}

		} catch (SQLException e) {
			logger.error("ClienteID: " + clienteId, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return direcciones;
	}

	protected DireccionDTO loadNext(ResultSet rs) throws SQLException {

		int i = 1;

		DireccionDTO d = new DireccionDTO();

		d.setId(rs.getLong(i++));
		d.setNombreVia(rs.getString(i++));
		d.setDirVia(rs.getString(i++));
		d.setClienteId(JDBCUtils.getNullableLong(rs, i++));
		d.setEmpleadoId(JDBCUtils.getNullableLong(rs, i++));
		d.setFreguesiaId(rs.getInt(i++));
		d.setFreguesiaNombre(rs.getString(i++));
		d.setConcelhoId(rs.getInt(i++));
		d.setConcelhoNombre(rs.getString(i++));
		d.setDistritoId(rs.getInt(i++));
		d.setDistritoNombre(rs.getString(i++));
		d.setPaisId(rs.getInt(i++));
		d.setPaisNombre(rs.getString(i++));

		return d;
	}
}
