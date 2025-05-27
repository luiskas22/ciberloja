package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Marca;

public interface MarcaDAO {
	public List<Marca> findAll(Connection con) throws DataException;

}
