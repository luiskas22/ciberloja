package com.luis.ciberloja.dao;

import java.sql.Connection;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.DireccionDTO;

public interface DireccionDAO {
	
	public boolean delete (Connection con, Long id) throws DataException;
	public boolean update (Connection con,DireccionDTO d) throws DataException;
	public Long create (Connection con, DireccionDTO d) throws DataException;
}
