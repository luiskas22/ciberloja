package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Provincia;

public interface ProvinciaService {

	public List<Provincia>findAll() throws DataException;
	
	public Provincia findById(int id) throws DataException;
}
