package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Freguesia;

public interface FreguesiaDAO {

	public Freguesia findById(Connection con, int id) throws DataException;

	public List<Freguesia> findAll(Connection con) throws DataException;
}
