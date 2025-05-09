package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.Results;

public interface ProductoService {
	public ProductoDTO findById(Long id) throws DataException;

	public Long create(ProductoDTO p) throws DataException;
	
	public Results<ProductoDTO> findBy(ProductoCriteria criteria, int pos, int pageSize) throws DataException;

	public boolean update(ProductoDTO p) throws DataException;

	public boolean delete(Long id) throws DataException;
	

}
