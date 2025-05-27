package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.LineaPedido;



public interface LineaPedidoDAO {

	public LineaPedido findById (Connection c, Long lineaPedidoId) throws DataException;
	
	public List<LineaPedido> findByPedido(Connection c, Long pedidoId) throws DataException;
	
	public void create(Connection c, Long idPedido, List<LineaPedido> lineas) throws DataException;
	
	public boolean deleteByPedido(Connection c, Long idPedido) throws DataException;
	
	public boolean deleteFromPedido (Connection c, Long lineaId, Long pedidoId) throws DataException;
}
