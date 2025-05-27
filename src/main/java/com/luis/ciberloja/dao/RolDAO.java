package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Rol;

public interface RolDAO {
	public List<Rol> findAll(Connection con) throws DataException;

}
