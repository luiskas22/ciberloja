package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Distrito;

public interface ProvinciaService {

	public List<Distrito>findAll() throws DataException;
	
	public Distrito findById(int id) throws DataException;
}
