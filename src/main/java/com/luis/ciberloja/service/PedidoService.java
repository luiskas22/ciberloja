package com.luis.ciberloja.service;

import java.sql.Connection;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.Pedido;
import com.luis.ciberloja.model.PedidoCriteria;
import com.luis.ciberloja.model.Results;

public interface PedidoService {

	public Pedido findBy(Long id)
			throws DataException;
	
	public Results<Pedido> findByCriteria (PedidoCriteria pedido, int pos, int pageSize)
			throws DataException;
	
	public Long create (Pedido p)
			throws DataException, MailException;
	
	public boolean update(Pedido p)
			throws DataException, Exception;
	
	public boolean delete(Long id)
			throws DataException;
	
	public Double calcularPrecio(Pedido p)
			throws DataException;
	
	public Results<Pedido> findPedidosByClienteId(Long clienteId) throws DataException;

}
