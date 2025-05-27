package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Pais;


public interface PaisService {
	
	public List<Pais> findAll() throws DataException;
	public Pais findById (int id) throws DataException;
}
