package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Freguesia;

public interface FreguesiaService {

	public List<Freguesia> findAll() 
			throws DataException;
	
	public Freguesia findById(int id)
			throws DataException;
	
}
