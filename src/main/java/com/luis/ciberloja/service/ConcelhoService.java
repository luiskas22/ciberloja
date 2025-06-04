package com.luis.ciberloja.service;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Concelho;

public interface ConcelhoService {

	public Concelho findById(int id) throws DataException;

	public List<Concelho> findAll() throws DataException;
}
