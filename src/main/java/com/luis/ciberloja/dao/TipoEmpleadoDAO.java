package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.TipoEmpleado;

public interface TipoEmpleadoDAO {
	
	public List<TipoEmpleado> findAll(Connection con) 
			throws DataException;
	
}
