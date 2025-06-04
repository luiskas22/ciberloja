package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Distrito;


public interface DistritoDAO {

	public Distrito findById(Connection con, int id) throws DataException;
	public List<Distrito>findAll (Connection con) throws DataException;
}
