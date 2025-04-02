package com.luis.ciberloja.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.dao.DireccionDAO;
import com.luis.ciberloja.dao.EmpleadoDAO;
import com.luis.ciberloja.dao.util.JDBCUtils;
import com.luis.ciberloja.model.EmpleadoDTO;
import com.luis.ciberloja.model.Results;

public class EmpleadoDAOImpl implements EmpleadoDAO {

    private static Logger logger = LogManager.getLogger(EmpleadoDAOImpl.class);
    private DireccionDAO direccionDAO = null;

    public EmpleadoDAOImpl() {
        direccionDAO = new DireccionDAOImpl();
    }

    public EmpleadoDTO findBy(Connection con, Long id) throws DataException {
        EmpleadoDTO em = null;
        PreparedStatement pst = null;
        ResultSet rs = null;

        try {
            StringBuilder query = new StringBuilder(
                    " SELECT E.ID, E.NOMBRE, E.APELLIDO1, E.APELLIDO2, E.DNI_NIE, E.TELEFONO, E.EMAIL, E.PASSWORD, E.TIPO_EMPLEADO_ID, t.nombre, E.ROL_ID ")
                    .append(" FROM EMPLEADO E ").append(" INNER JOIN TIPO_EMPLEADO t ON t.id = e.tipo_empleado_id ")
                    .append(" WHERE E.ID = ? ");

            logger.info(query.toString());

            pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

            int i = 1;
            pst.setLong(i++, id);

            rs = pst.executeQuery();

            if (rs.next()) {
                em = loadNext(rs, con);
            }

        } catch (SQLException e) {
            logger.error("Error al buscar empleado por ID: " + id, e);
            throw new DataException("No se pudo buscar el empleado con ID: " + id, e);
        } finally {
            JDBCUtils.close(pst, rs);
        }
        return em;
    }

    public Results<EmpleadoDTO> findAll(Connection con, int pos, int pageSize) throws DataException {
        PreparedStatement pst = null;
        ResultSet rs = null;
        Results<EmpleadoDTO> empleados = new Results<EmpleadoDTO>();

        try {
            StringBuilder query = new StringBuilder(
                    " SELECT E.ID, E.NOMBRE, E.APELLIDO1, E.APELLIDO2, E.DNI_NIE, E.TELEFONO, E.EMAIL, E.PASSWORD, E.TIPO_EMPLEADO_ID, t.nombre, E.ROL_ID ")
                    .append(" FROM EMPLEADO E ").append(" INNER JOIN TIPO_EMPLEADO t ON t.id = e.tipo_empleado_id ")
                    .append(" ORDER BY E.NOMBRE ASC");

            pst = con.prepareStatement(query.toString(), ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

            rs = pst.executeQuery();

            int count = 0;
            if ((pos >= 1) && rs.absolute(pos)) {
                do {
                    empleados.getPage().add(loadNext(rs, con));
                    count++;
                } while (count < pageSize && rs.next());
            }
            empleados.setTotal(JDBCUtils.getTotalRows(rs));

        } catch (SQLException e) {
            logger.error("Error al obtener todos los empleados", e);
            throw new DataException("No se pudieron obtener los empleados", e);
        } finally {
            JDBCUtils.close(pst, rs);
        }
        return empleados;
    }

    public Long create(Connection con, EmpleadoDTO em) throws DataException {
        ResultSet rs = null;
        PreparedStatement pst = null;

        try {
            pst = con.prepareStatement(
                    "INSERT INTO EMPLEADO (NOMBRE, APELLIDO1, APELLIDO2, DNI_NIE, TELEFONO, EMAIL, PASSWORD, TIPO_EMPLEADO_ID, ROL_ID)"
                            + " VALUES(?,?,?,?,?,?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS);

            logger.info(pst);

            int i = 1;
            pst.setString(i++, em.getNombre());
            pst.setString(i++, em.getApellido1());
            JDBCUtils.setNullable(pst, i++, em.getApellido2());
            pst.setString(i++, em.getDniNie());
            pst.setString(i++, em.getTelefono());
            pst.setString(i++, em.getEmail());
            pst.setString(i++, em.getPassword());
            pst.setInt(i++, em.getTipo_empleado_id());
            JDBCUtils.setNullable(pst, i++, em.getRol_id()); // Corregido: Usar el valor de rol_id

            int insertedRows = pst.executeUpdate();

            if (insertedRows != 1) {
                logger.warn("No se insertó ningún empleado para: {}", em);
                throw new DataException("No se pudo insertar el empleado");
            }

            rs = pst.getGeneratedKeys();

            if (rs.next()) {
                Long id = rs.getLong(1);
                em.setId(id);
                em.getDireccion().setEmpleadoId(id);
                direccionDAO.create(con, em.getDireccion());
                return id;
            }

        } catch (SQLException e) {
            logger.error("Error al crear empleado: " + em, e);
            throw new DataException("No se pudo crear el empleado", e);
        } finally {
            JDBCUtils.close(pst, rs);
        }
        return null;
    }

    public boolean updatePassword(Connection con, String password, Long id) throws DataException {
        PreparedStatement pst = null;

        try {
            pst = con.prepareStatement("UPDATE EMPLEADO SET PASSWORD = ? " + " WHERE ID = ? ");

            int i = 1;
            pst.setString(i++, password);
            pst.setLong(i++, id);

            int updatedRows = pst.executeUpdate();
            if (updatedRows != 1) { // Cambiado a != 1 para consistencia
                logger.warn("No se actualizó la contraseña para el empleado con ID: {}", id);
                return false;
            }

        } catch (SQLException e) {
            logger.error("Error al actualizar contraseña para ID: " + id, e);
            throw new DataException("No se pudo actualizar la contraseña", e);
        } finally {
            JDBCUtils.close(pst);
        }
        return true;
    }

    public boolean update(Connection con, EmpleadoDTO em) throws DataException {
        PreparedStatement pst = null;

        try {
            pst = con.prepareStatement(
                    " UPDATE EMPLEADO SET NOMBRE = ?, APELLIDO1 = ?, APELLIDO2 = ?, DNI_NIE = ?, TELEFONO = ?, EMAIL = ?, TIPO_EMPLEADO_ID = ?, ROL_ID = ? "
                            + " WHERE ID = ? ");

            logger.info(pst);

            int i = 1;
            pst.setString(i++, em.getNombre());
            pst.setString(i++, em.getApellido1());
            pst.setString(i++, em.getApellido2());
            pst.setString(i++, em.getDniNie());
            pst.setString(i++, em.getTelefono());
            pst.setString(i++, em.getEmail());
            pst.setInt(i++, em.getTipo_empleado_id());
            JDBCUtils.setNullable(pst, i++, em.getRol_id());
            pst.setLong(i++, em.getId());

            int updatedRows = pst.executeUpdate();

            if (updatedRows != 1) {
                logger.warn("No se actualizó el empleado: {}", em);
                return false;
            }

        } catch (SQLException e) {
            logger.error("Error al actualizar empleado: " + em, e);
            throw new DataException("No se pudo actualizar el empleado", e);
        } finally {
            JDBCUtils.close(pst);
        }
        return true;
    }

    public boolean delete(Connection con, Long id) throws DataException {
        PreparedStatement pst = null;

        try {
            direccionDAO.deleteByEmpleado(con, id);

            pst = con.prepareStatement(" DELETE FROM EMPLEADO WHERE ID = ? ");

            logger.info(pst);

            int i = 1;
            pst.setLong(i++, id);

            int updatedRows = pst.executeUpdate();

            if (updatedRows != 1) {
                logger.warn("No se eliminó el empleado con ID: {}", id);
                return false;
            }

        } catch (SQLException e) {
            logger.error("Error al eliminar empleado con ID: " + id, e);
            throw new DataException("No se pudo eliminar el empleado", e);
        } finally {
            JDBCUtils.close(pst);
        }
        return true;
    }

    protected EmpleadoDTO loadNext(ResultSet rs, Connection con) throws SQLException, DataException {
        EmpleadoDTO em = new EmpleadoDTO();
        int i = 1;
        em.setId(rs.getLong(i++));
        em.setNombre(rs.getString(i++));
        em.setApellido1(rs.getString(i++));
        em.setApellido2(rs.getString(i++));
        em.setDniNie(rs.getString(i++));
        em.setTelefono(rs.getString(i++));
        em.setEmail(rs.getString(i++));
        em.setPassword(rs.getString(i++));
        em.setTipo_empleado_id(rs.getInt(i++));
        em.setTipo_empleado_nombre(rs.getString(i++));
        em.setRol_id(JDBCUtils.getNullableLong(rs, i++)); // Usar getNullableLong para consistencia
        em.setDireccion(direccionDAO.findByEmpleadoId(con, em.getId()));

        return em;
    }
}