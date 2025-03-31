package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.TipoEmpleado;

public interface TipoEmpleadoService {
	
	public List<TipoEmpleado> findAll() 
			throws DataException;
}
