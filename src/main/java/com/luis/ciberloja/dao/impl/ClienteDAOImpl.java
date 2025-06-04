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
import com.luis.ciberloja.dao.ClienteDAO;
import com.luis.ciberloja.dao.DireccionDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.DireccionDTO;
import com.luis.ciberloja.model.Results;

public class ClienteDAOImpl implements ClienteDAO {

	private DireccionDAO direccionDAO = null;
	private static Logger logger = LogManager.getLogger(ClienteDAOImpl.class);

	public ClienteDAOImpl() {
		direccionDAO = new DireccionDAOImpl();
	}

	public ClienteDTO findById(Connection con, Long id) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		ClienteDTO c = null;

		try {
			StringBuilder query = new StringBuilder(
					"SELECT c.ID, c.NICKNAME, c.NOMBRE, c.APELLIDO1, c.APELLIDO2, c.DNI_NIE, c.EMAIL, c.TELEFONO, c.PASSWORD, c.ROL_ID")
					.append(" FROM CLIENTE c ").append(" WHERE c.ID = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			int i = 1;
			pst.setLong(i++, id);
			rs = pst.executeQuery();

			if (rs.next()) {
				c = loadNext(rs, con);
			}
		} catch (SQLException e) {
			logger.error("ID: " + id, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return c;
	}

	public ClienteDTO findByEmail(Connection con, String mail) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		ClienteDTO c = null;

		try {
			StringBuilder query = new StringBuilder(
					"SELECT c.ID, c.NICKNAME, c.NOMBRE, c.APELLIDO1, c.APELLIDO2, c.DNI_NIE, c.EMAIL, c.TELEFONO, c.PASSWORD, c.ROL_ID")
					.append(" FROM CLIENTE c ").append(" WHERE c.EMAIL = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			int i = 1;
			pst.setString(i++, mail);
			rs = pst.executeQuery();

			if (rs.next()) {
				c = loadNext(rs, con);
			}
		} catch (SQLException e) {
			logger.error("Email: " + mail, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return c;
	}

	public Results<ClienteDTO> findAll(Connection con, int pos, int pageSize) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		Results<ClienteDTO> resultados = new Results<ClienteDTO>();

		try {
			StringBuilder query = new StringBuilder(
					"SELECT c.ID, c.NICKNAME, c.NOMBRE, c.APELLIDO1, c.APELLIDO2, c.DNI_NIE, c.EMAIL, c.TELEFONO, c.PASSWORD, c.ROL_ID")
					.append(" FROM CLIENTE c ").append(" ORDER BY NOMBRE ASC");

			pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			rs = pst.executeQuery();

			int count = 0;
			if ((pos >= 1) && rs.absolute(pos)) {
				do {
					resultados.getPage().add(loadNext(rs, con));
					count++;
				} while (count < pageSize && rs.next());
			}
			resultados.setTotal(JDBCUtils.getTotalRows(rs));
		} catch (SQLException e) {
			logger.error(e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return resultados;
	}

	public boolean delete(Connection conn, Long id) throws DataException {

		PreparedStatement pst = null;

		try {

			pst = conn.prepareStatement("DELETE FROM CLIENTE WHERE ID = ?");

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

	public boolean updatePassword(Connection con, String password, Long id) throws DataException {

		PreparedStatement pst = null;

		try {
			pst = con.prepareStatement("UPDATE CLIENTE SET PASSWORD = ? " + " WHERE ID = ? ");

			int i = 1;
			pst.setString(i++, password);
			pst.setLong(i++, id);

			int updatedRows = pst.executeUpdate();
			if (updatedRows == 0) {
				return false;
			}

		} catch (SQLException e) {
			logger.error(e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
		return true;
	}

	public boolean update(Connection conn, ClienteDTO c) throws DataException {
		PreparedStatement pst = null;

		try {
			pst = conn.prepareStatement(
					"UPDATE CLIENTE SET NICKNAME = ?, NOMBRE = ?, APELLIDO1 = ?, APELLIDO2 = ?, DNI_NIE = ?, EMAIL = ?, TELEFONO = ?, ROL_ID = ? "
							+ " WHERE ID = ?");

			int i = 1;
			pst.setString(i++, c.getNickname());
			pst.setString(i++, c.getNombre());
			pst.setString(i++, c.getApellido1());
			pst.setString(i++, c.getApellido2());
			pst.setString(i++, c.getDniNie());
			pst.setString(i++, c.getEmail());
			pst.setString(i++, c.getTelefono());
			JDBCUtils.setNullable(pst, i++, c.getRol_id()); // Usamos setNullable para manejar valores nulos
			pst.setLong(i++, c.getId());

			int updatedRows = pst.executeUpdate();
			if (updatedRows == 0) {
				return false;
			}
		} catch (SQLException e) {
			logger.error("ClienteDTO: " + c, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
		return true;
	}

	public Long create(Connection conn, ClienteDTO c) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;

		try {
			pst = conn.prepareStatement(
					"INSERT INTO CLIENTE(NICKNAME, NOMBRE, APELLIDO1, APELLIDO2, DNI_NIE, EMAIL, TELEFONO, PASSWORD, ROL_ID)"
							+ " VALUES(?,?,?,?,?,?,?,?,?)",
					Statement.RETURN_GENERATED_KEYS);

			int i = 1;
			pst.setString(i++, c.getNickname());
			pst.setString(i++, c.getNombre());
			pst.setString(i++, c.getApellido1());
			JDBCUtils.setNullable(pst, i++, c.getApellido2());
			pst.setString(i++, c.getDniNie());
			pst.setString(i++, c.getEmail());
			pst.setString(i++, c.getTelefono());
			pst.setString(i++, c.getPassword());
			JDBCUtils.setNullable(pst, i++, c.getRol_id()); // Usamos setNullable para manejar valores nulos

			int insertedRows = pst.executeUpdate();
			if (insertedRows != 1) {
				// manejar error
			} else {
				rs = pst.getGeneratedKeys();
				if (rs.next()) {
					Long id = rs.getLong(1);
					c.setId(id);
					return id;
				}
			}
		} catch (SQLException e) {
			logger.error("ClienteDTO: " + c, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst);
		}
		return null;
	}

	public ClienteDTO findByNick(Connection con, String nick) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		ClienteDTO c = null;

		try {
			StringBuilder query = new StringBuilder(
					"SELECT c.ID, c.NICKNAME, c.NOMBRE, c.APELLIDO1, c.APELLIDO2, c.DNI_NIE, c.EMAIL, c.TELEFONO, c.PASSWORD, c.ROL_ID")
					.append(" FROM CLIENTE c ").append(" WHERE c.NICKNAME = ? ");

			pst = con.prepareStatement(query.toString(), ResultSet.CONCUR_READ_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE);
			int i = 1;
			pst.setString(i++, nick);
			rs = pst.executeQuery();

			if (rs.next()) {
				c = loadNext(rs, con);
			}
		} catch (SQLException e) {
			logger.error("Nickname: " + nick, e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(pst, rs);
		}
		return c;
	}

	protected ClienteDTO loadNext(ResultSet rs, Connection con) throws SQLException, DataException {
		int i = 1;
		List<DireccionDTO> direcciones = new ArrayList();
		ClienteDTO c = new ClienteDTO();

		c.setId(rs.getLong(i++));
		c.setNickname(rs.getString(i++));
		c.setNombre(rs.getString(i++));
		c.setApellido1(rs.getString(i++));
		c.setApellido2(rs.getString(i++));
		c.setDniNie(rs.getString(i++));
		c.setEmail(rs.getString(i++));
		c.setTelefono(rs.getString(i++));
		c.setPassword(rs.getString(i++));
		c.setRol_id(JDBCUtils.getNullableLong(rs, i++)); // Maneja valores nulos
		c.setDirecciones(direccionDAO.findByClienteId(con, c.getId()));

		return c;
	}

	

}
