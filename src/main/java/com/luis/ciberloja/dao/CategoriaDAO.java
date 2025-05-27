package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Categoria;


public interface CategoriaDAO {
	public List<Categoria> findAll(Connection con) throws DataException;

}
