package com.luis.ciberloja.service;

import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.EstadoPedido;


public interface EstadoPedidoService {
	
	public List<EstadoPedido>findAll() 
			throws DataException;
}
