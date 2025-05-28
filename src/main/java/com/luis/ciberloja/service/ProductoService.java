package com.luis.ciberloja.service;

import java.sql.Connection;

import org.springframework.stereotype.Service;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.ProductoCriteria;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.model.Results;

@Service
public interface ProductoService {
	public ProductoDTO findById(String id) throws DataException;

	public Results<ProductoDTO> findBy(ProductoCriteria criteria, int pos, int pageSize) throws DataException;

	public Results<ProductoDTO> findByDestaques(int pos, int pageSize) throws DataException;
}
