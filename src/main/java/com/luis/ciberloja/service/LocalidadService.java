package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Localidad;

public interface LocalidadService {

	public List<Localidad> findAll() 
			throws DataException;
	
	public Localidad findById(int id)
			throws DataException;
	
	public Localidad findByCodigoPostal (int codigoPostal)
			throws DataException;
}
