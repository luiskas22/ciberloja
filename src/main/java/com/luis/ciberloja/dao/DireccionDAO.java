package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.DireccionDTO;

public interface DireccionDAO {

	public DireccionDTO findById(Connection con, Long Id) throws DataException;

	public DireccionDTO findByEmpleadoId(Connection con, Long empleadoId) throws DataException;

	public boolean delete(Connection con, Long id) throws DataException;

	public boolean deleteByEmpleado(Connection con, Long empleadoId) throws DataException;

	public boolean update(Connection con, DireccionDTO d) throws DataException;

	public Long create(Connection con, DireccionDTO d) throws DataException;

	public List<DireccionDTO> findByClienteId(Connection con, Long clienteId) throws DataException;
}
