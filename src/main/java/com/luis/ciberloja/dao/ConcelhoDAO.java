package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Concelho;

public interface ConcelhoDAO {

	public Concelho findById(Connection con, int id) throws DataException;

	public List<Concelho> findAll(Connection con) throws DataException;

}
