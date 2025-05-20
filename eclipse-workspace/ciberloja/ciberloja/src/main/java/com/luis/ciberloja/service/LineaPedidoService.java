package com.luis.ciberloja.service;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.LineaPedido;

public interface LineaPedidoService {
	
	public LineaPedido findById (Long lineaPedidoId)
			throws DataException;
	
	public boolean deleteFromPedido (Long lineaId, Long pedidoId) throws DataException;
}
