package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Pais;


public interface PaisDAO {
	
	public List<Pais> findAll(Connection con) throws DataException;
	public Pais findById (Connection con, int id) throws DataException;
}
