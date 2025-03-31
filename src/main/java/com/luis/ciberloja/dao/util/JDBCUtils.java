package com.luis.ciberloja.dao.util;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.Date;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.conf.ConfigurationParametersManager;
import com.mchange.v2.c3p0.ComboPooledDataSource;

public class JDBCUtils {
	private static Logger logger = LogManager.getLogger(JDBCUtils.class);
	private static final String DRIVER = "db.driver";
	private static final String DB_URL = "db.url";
	private static final String USER = "db.user";
	private static final String PASS = "db.password";
	private static ComboPooledDataSource cpds = new ComboPooledDataSource();

	static {
		try {
			String driver = ConfigurationParametersManager.getParameterValue(DRIVER);
			String url = ConfigurationParametersManager.getParameterValue(DB_URL);
			String user = ConfigurationParametersManager.getParameterValue(USER);
			String password = ConfigurationParametersManager.getParameterValue(PASS);

			if (driver == null || url == null || user == null || password == null) {
				logger.fatal("Faltan parámetros de configuración: driver={}, url={}, user={}, password={}", driver, url,
						user, password);
				throw new RuntimeException("Configuración de base de datos incompleta");
			}

			cpds = new ComboPooledDataSource();
			Class.forName(driver); // Carga manual del driver
			logger.debug("Driver {} cargado manualmente", driver);

			cpds.setDriverClass(driver);
			cpds.setJdbcUrl(url);
			cpds.setUser(user);
			cpds.setPassword(password);

			logger.debug("Configurando pool con: driver={}, url={}, user={}", driver, url, user);

			cpds.setMinPoolSize(5);
			cpds.setAcquireIncrement(5);
			cpds.setMaxPoolSize(20);
			cpds.setInitialPoolSize(5);

			cpds.setTestConnectionOnCheckout(false);
			cpds.setTestConnectionOnCheckin(true);
			cpds.setPreferredTestQuery("SELECT 1");
			cpds.setIdleConnectionTestPeriod(300);
			cpds.setMaxIdleTime(600);

			cpds.setCheckoutTimeout(10000);
			cpds.setAcquireRetryAttempts(3);
			cpds.setAcquireRetryDelay(1000);

			cpds.setUnreturnedConnectionTimeout(1800);
			cpds.setDebugUnreturnedConnectionStackTraces(true);

		} catch (ClassNotFoundException e) {
			logger.fatal("No se pudo cargar el driver JDBC", e);
			throw new RuntimeException("Driver JDBC no encontrado", e);
		} catch (PropertyVetoException e) {
			logger.fatal("Error al configurar el driver en C3P0", e);
			throw new RuntimeException("Error de configuración de C3P0", e);
		}
	}

	public static Connection getConnection() throws SQLException {
		if (cpds == null) {
			throw new SQLException("El pool de conexiones no se inicializó correctamente");
		}
		Connection conn = cpds.getConnection();
		if (logger.isDebugEnabled()) {
			logger.debug("Conexión obtenida del pool C3P0");
		}
		return conn;
	}

	public static final Long getNullableLong(ResultSet rs, int pos) throws SQLException {
		Long value = rs.getLong(pos);
		return rs.wasNull() ? null : value;
	}

	public static final Double getNullableDouble(ResultSet rs, int pos) throws SQLException {
		Double value = rs.getDouble(pos);
		return rs.wasNull() ? null : value;
	}

	public static final void setNullable(PreparedStatement ps, int i, Integer value) throws SQLException {
		if (value == null) {
			ps.setNull(i, Types.INTEGER);
		} else {
			ps.setLong(i, value);
		}
	}

	public static final void setNullable(PreparedStatement ps, int i, String value) throws SQLException {
		if (value == null) {
			ps.setNull(i, Types.VARCHAR);
		} else {
			ps.setString(i, value);
		}
	}

	public static final void setNullable(PreparedStatement ps, int i, Date value) throws SQLException {
		if (value == null) {
			ps.setNull(i, Types.DATE);
		} else {
			ps.setDate(i, new java.sql.Date(value.getTime()));
		}
	}

	public static final void setNullable(PreparedStatement ps, int i, Long value) throws SQLException {
		if (value == null) {
			ps.setNull(i, Types.INTEGER);
		} else {
			ps.setLong(i, value);
		}
	}

	public static final void setNullable(PreparedStatement ps, int i, Boolean value) throws SQLException {
		if (value == null) {
			ps.setNull(i, Types.BOOLEAN);
		} else {
			ps.setBoolean(i, value);
		}
	}

	public static final StringBuilder appendMultipleInsertParameters(StringBuilder query, String pattern, int lineas) {

		for (int i = 0; i < lineas - 1; i++) {
			query.append(pattern).append(",");
		}

		query.append(pattern);

		return query;
	}

	// TODO Lanzar exception
	public static final void close(Connection c) throws DataException {
		if (c != null) {
			try {
				c.close();
			} catch (SQLException e) {
				logger.error(e);
				throw new DataException(e);
			}
		}
	}

	// TODO Lanzar exception
	public static final void close(Statement s, ResultSet rs) throws DataException {
		if (s != null) {
			try {
				s.close();
			} catch (SQLException e) {
				logger.error(e);
				throw new DataException(e);

			}
		}
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
				logger.error(e);
				throw new DataException(e);

			}
		}
	}

	public static final void close(Statement s) throws DataException {
		if (s != null) {
			try {
				s.close();
			} catch (SQLException e) {
				logger.error(e);
				throw new DataException(e);

			}
		}

	}

	public static final void close(Connection con, boolean commitOrRollback) throws DataException {
		if (con != null) {
			try {
				if (commitOrRollback) {
					con.commit();
				} else {
					con.rollback();
				}
				con.close();
			} catch (SQLException e) {
				logger.error(e);
				throw new DataException(e);
			}
		}
	}

	/**
	 * Obtencion del total de filas de un resultSet, sin repetir consulta. Metodo
	 * orientado a implementar paginación. No existe una solución en el API estandar
	 * de JDBC. Esta es un solución para todas las BD pero NO ES LA MEJOR EN
	 * RENDIMIENTO. Por ello en este caso es habitual usar soluciones propietarias
	 * de cada BD (rownum de Oracle, y similar en MySQL). (En Hibernate, con
	 * ScrollableResults, no lo vemos porque lo implementa con el dialecto de cada
	 * DB).
	 * 
	 * Encantado de recibir mensajes son soluciones mejores (válidas para todas las
	 * BD):
	 * 
	 * @author https://www.linkedin.com/in/joseantoniolopezperez
	 * @version 0.2
	 */
	public static final int getTotalRows(ResultSet resultSet) throws SQLException {
		int totalRows = 0;
		if (resultSet.last()) {
			totalRows = resultSet.getRow();
		}
		resultSet.beforeFirst();
		return totalRows;
	}
}
