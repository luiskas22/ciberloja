package com.luis.ciberloja.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jasypt.util.password.StrongPasswordEncryptor;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.ClienteDAO;
import com.luis.ciberloja.dao.PasswordResetTokenDAO;
import com.luis.ciberloja.dao.impl.ClienteDAOImpl;
import com.luis.ciberloja.dao.impl.PasswordResetTokenDAOImpl;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.PasswordResetTokenDTO;
import com.luis.ciberloja.model.Results;
import com.luis.ciberloja.service.ClienteService;
import com.luis.ciberloja.service.MailException;
import com.luis.ciberloja.service.MailService;
import com.luis.ciberloja.service.ServiceException;


public class ClienteServiceImpl implements ClienteService {

	/**
	 * Es un objeto stateless, no tiene sentido instanciarlo multiples veces. (NOTA:
	 * Para segundo curso de DAW: Será un atributo, no una constante, para que
	 * podamos inyectarlo, y si queremos, cambiar el Encryptor).
	 */
	public static final StrongPasswordEncryptor PASSWORD_ENCRYPTOR = new StrongPasswordEncryptor();

	private ClienteDAO clienteDAO = null;
	private MailService mailService = null;
	private PasswordResetTokenDAO tokenDAO = null;
	private static Logger logger = LogManager.getLogger(ClienteServiceImpl.class);

	public ClienteServiceImpl() {
		clienteDAO = new ClienteDAOImpl();
		mailService = new MailServiceImpl();
		tokenDAO = new PasswordResetTokenDAOImpl();
	}

	public ClienteDTO findById(Long id) throws DataException {

		Connection con = null;
		ClienteDTO cliente = new ClienteDTO();
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			cliente = clienteDAO.findById(con, id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException();
		} finally {
			JDBCUtils.close(con, commit);
		}
		return cliente;

	}

	public ClienteDTO findByNick(String nick) throws DataException {

		Connection con = null;
		ClienteDTO cliente = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			cliente = clienteDAO.findByNick(con, nick);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return cliente;
	}

	public ClienteDTO findByEmail(String mail) throws DataException {

		Connection con = null;
		ClienteDTO cliente = new ClienteDTO();
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(commit);
			cliente = clienteDAO.findByEmail(con, mail);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException();
		} finally {
			JDBCUtils.close(con, commit);
		}
		return cliente;
	}

	public Results<ClienteDTO> findAll(int pos, int pageSize) throws DataException {

		Connection con = null;
		boolean commit = false;
		Results<ClienteDTO> resultados = null;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			resultados = clienteDAO.findAll(con, pos, pageSize);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return resultados;
	}

	public Long registrar(ClienteDTO c) throws DataException, ServiceException {

		c.setPassword(PASSWORD_ENCRYPTOR.encryptPassword(c.getPassword()));

		Long id = null;
		Connection con = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			id = clienteDAO.create(con, c);
			mailService.sendBienvenida(c.getEmail(), c);

			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return id;
	}

	public boolean delete(Long id) throws DataException, ServiceException {

		Connection con = null;
		boolean c = false;
		ClienteDTO cliente = null;
		boolean commit = false;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);
			cliente = clienteDAO.findById(con, id);
			c = clienteDAO.delete(con, id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);

		} finally {
			JDBCUtils.close(con, commit);
		}
		return c;

	}

	public boolean updatePassword(String password, Long id) throws DataException {
		Connection con = null;
		boolean cliente = false;
		boolean commit = false;
		try {

			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);

			cliente = clienteDAO.updatePassword(con, PASSWORD_ENCRYPTOR.encryptPassword(password), id);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return cliente;
	}

	public boolean update(ClienteDTO c) throws DataException {

		Connection con = null;
		boolean cliente = false;
		boolean commit = false;
		try {

			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);

			cliente = clienteDAO.update(con, c);
			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
		return cliente;
	}

	@Override
	public ClienteDTO autenticar(String mail, String password) throws DataException {

		Connection con = null;
		boolean commit = false;
		ClienteDTO cliente = null;

		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);

			cliente = clienteDAO.findByEmail(con, mail);
			if (cliente == null) {
				return null;
			}
			if (!PASSWORD_ENCRYPTOR.checkPassword(password, cliente.getPassword())) {
				cliente = null;
			}

			commit = true;

		} catch (SQLException e) {
			logger.error(e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}

		return cliente;
	}

	@Override
	public String generatePasswordResetToken(String email) throws DataException {
		Connection con = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);

			// Verify if email exists
			ClienteDTO cliente = clienteDAO.findByEmail(con, email);
			if (cliente == null) {
				throw new DataException("No user found with email: " + email);
			}

			// Generate a unique token
			String token = UUID.randomUUID().toString();

			// Store token in the database
			PasswordResetTokenDTO resetToken = new PasswordResetTokenDTO();
			resetToken.setEmail(email);
			resetToken.setToken(token);
			resetToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Valid for 24 hours
			resetToken.setUsed(false);
			tokenDAO.create(con, resetToken);

			// Send reset email
			try {
				mailService.sendPasswordResetEmail(email, token, cliente.getId());
			} catch (MailException e) {
				throw new DataException("Failed to send reset email: " + e.getMessage());
			}

			commit = true;
			return token;
		} catch (SQLException e) {
			logger.error("Error generating password reset token: {}", e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
	}

	@Override
	public boolean validateAndUpdatePassword(String token, String newPassword) throws DataException {
		Connection con = null;
		boolean commit = false;
		try {
			con = JDBCUtils.getConnection();
			con.setAutoCommit(false);

			// Find token
			PasswordResetTokenDTO resetToken = tokenDAO.findByToken(con, token);
			if (resetToken == null) {
				throw new DataException("Invalid token");
			}

			// Check if token is expired or used
			if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
				throw new DataException("Token is expired or already used");
			}

			// Find client by email
			ClienteDTO cliente = clienteDAO.findByEmail(con, resetToken.getEmail());
			if (cliente == null) {
				throw new DataException("No user found for token");
			}

			// Update password
			boolean updated = clienteDAO.updatePassword(con, PASSWORD_ENCRYPTOR.encryptPassword(newPassword),
					cliente.getId());
			if (!updated) {
				throw new DataException("Failed to update password");
			}

			// Mark token as used
			resetToken.setUsed(true);
			tokenDAO.update(con, resetToken);

			commit = true;
			return true;
		} catch (SQLException e) {
			logger.error("Error validating and updating password: {}", e.getMessage(), e);
			throw new DataException(e);
		} finally {
			JDBCUtils.close(con, commit);
		}
	}

}
