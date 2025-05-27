package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.EstadoPedido;


public interface EstadoPedidoDAO {
	
	public List<EstadoPedido> findAll(Connection con) 
			throws DataException;
}
