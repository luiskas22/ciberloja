package com.luis.ciberloja.dao;

import java.sql.Connection;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Pedido;
import com.luis.ciberloja.model.PedidoCriteria;
import com.luis.ciberloja.model.Results;

public interface PedidoDAO {
	
	public Pedido findBy(Connection c, Long id)
			throws DataException;
	
	public Results<Pedido> findByCriteria (Connection c, PedidoCriteria pedido, int pos, int pageSize)
			throws DataException;
	
	public Long create (Connection c, Pedido p)
			throws DataException;
	
	public boolean update(Connection c, Pedido p)
			throws DataException;
	
	public boolean delete(Connection c, Long id)
			throws DataException;
	
	public Results<Pedido> findPedidosByClienteId(Connection c, Long clienteId) throws DataException;
}
