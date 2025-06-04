package com.luis.ciberloja.service;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.DireccionDTO;

public interface DireccionService {

	public DireccionDTO findById(Long id) throws DataException;

	public boolean delete(Long id) throws DataException;

	public boolean update(DireccionDTO d) throws DataException;

	public Long create(DireccionDTO d) throws DataException;

	public List<DireccionDTO> findByClienteId(Long clienteId) throws DataException;


}