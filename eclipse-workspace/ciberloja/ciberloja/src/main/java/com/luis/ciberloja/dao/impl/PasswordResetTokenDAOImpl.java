package com.luis.ciberloja.dao.impl;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.PasswordResetTokenDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.PasswordResetTokenDTO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

public class PasswordResetTokenDAOImpl implements PasswordResetTokenDAO {

	private static final Logger logger = LogManager.getLogger(PasswordResetTokenDAOImpl.class);

	@Override
	public void create(Connection connection, PasswordResetTokenDTO token) throws DataException {
		PreparedStatement pst = null;

		try {
			StringBuilder query = new StringBuilder(
					"INSERT INTO password_reset_tokens (email, token, expiry_date, used) VALUES (?, ?, ?, ?)");

			logger.info(query.toString());

			pst = connection.prepareStatement(query.toString());

			int i = 1;
			pst.setString(i++, token.getEmail());
			pst.setString(i++, token.getToken());
			pst.setTimestamp(i++, java.sql.Timestamp.valueOf(token.getExpiryDate()));
			pst.setBoolean(i++, token.isUsed());

			int insertedRows = pst.executeUpdate();

			if (insertedRows != 1) {
				logger.warn("No se insertó el token para el email: {}", token.getEmail());
				throw new DataException("No se pudo insertar el token de restablecimiento de contraseña");
			}

		} catch (SQLException e) {
			logger.error("Error al crear token para email: {}", token.getEmail(), e);
			throw new DataException("No se pudo crear el token de restablecimiento de contraseña", e);
		} finally {
			JDBCUtils.close(pst);
		}
	}

	@Override
	public PasswordResetTokenDTO findByToken(Connection connection, String token) throws DataException {
		PreparedStatement pst = null;
		ResultSet rs = null;
		PasswordResetTokenDTO resetToken = null;

		try {
			StringBuilder query = new StringBuilder(
					"SELECT id, email, token, expiry_date, used FROM password_reset_tokens WHERE token = ?");

			logger.info(query.toString());

			pst = connection.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE,
					ResultSet.CONCUR_READ_ONLY);

			int i = 1;
			pst.setString(i++, token);

			rs = pst.executeQuery();

			if (rs.next()) {
				resetToken = loadNext(rs);
			}

		} catch (SQLException e) {
			logger.error("Error al buscar token: {}", token, e);
			throw new DataException("No se pudo buscar el token de restablecimiento de contraseña", e);
		} finally {
			JDBCUtils.close(pst, rs);
		}

		return resetToken;
	}

	@Override
	public boolean update(Connection connection, PasswordResetTokenDTO token) throws DataException {
		PreparedStatement pst = null;

		try {
			StringBuilder query = new StringBuilder(
					"UPDATE password_reset_tokens SET email = ?, token = ?, expiry_date = ?, used = ? WHERE id = ?");

			logger.info(query.toString());

			pst = connection.prepareStatement(query.toString());

			int i = 1;
			pst.setString(i++, token.getEmail());
			pst.setString(i++, token.getToken());
			pst.setTimestamp(i++, java.sql.Timestamp.valueOf(token.getExpiryDate()));
			pst.setBoolean(i++, token.isUsed());
			pst.setLong(i++, token.getId());

			int updatedRows = pst.executeUpdate();

			if (updatedRows != 1) {
				logger.warn("No se actualizó el token con ID: {}", token.getId());
				return false;
			}

		} catch (SQLException e) {
			logger.error("Error al actualizar token con ID: {}", token.getId(), e);
			throw new DataException("No se pudo actualizar el token de restablecimiento de contraseña", e);
		} finally {
			JDBCUtils.close(pst);
		}

		return true;
	}

	protected PasswordResetTokenDTO loadNext(ResultSet rs) throws SQLException {
		PasswordResetTokenDTO token = new PasswordResetTokenDTO();
		int i = 1;
		token.setId(rs.getLong(i++));
		token.setEmail(rs.getString(i++));
		token.setToken(rs.getString(i++));
		token.setExpiryDate(rs.getTimestamp(i++).toLocalDateTime());
		token.setUsed(rs.getBoolean(i++));
		return token;
	}
}