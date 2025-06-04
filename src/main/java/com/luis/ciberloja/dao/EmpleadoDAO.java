package com.luis.ciberloja.dao;

import java.sql.Connection;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.DireccionDTO;
import com.luis.ciberloja.model.EmpleadoDTO;
import com.luis.ciberloja.model.Results;

public interface EmpleadoDAO {
		
		public EmpleadoDTO findBy(Connection con, Long id)
			throws DataException;
		
		public Results<EmpleadoDTO> findAll(Connection con, int pos, int pageSize)
			throws DataException;
		
		public Long create(Connection con, EmpleadoDTO em)
			throws DataException;
		
		public boolean update(Connection con,EmpleadoDTO em)
			throws DataException;
		
		public boolean updatePassword(Connection con, String password, Long id)
				throws DataException;
		
		public boolean delete(Connection con,Long id)
			throws DataException;
		
		
}
