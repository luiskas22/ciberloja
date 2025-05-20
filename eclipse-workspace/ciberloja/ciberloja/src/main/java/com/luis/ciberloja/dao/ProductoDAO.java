package com.luis.ciberloja.dao;

import java.sql.Connection;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.Results;


public interface ProductoDAO {
	public ProductoDTO findById(Connection con, String id) throws DataException;

	public String create(Connection con, ProductoDTO p) throws DataException;

	public Results<ProductoDTO> findBy(Connection con, ProductoCriteria criteria, int pos, int pageSize)
			throws DataException;
	

	public boolean update(Connection con, ProductoDTO p) throws DataException;

	public boolean delete(Connection con, String id) throws DataException;
}
