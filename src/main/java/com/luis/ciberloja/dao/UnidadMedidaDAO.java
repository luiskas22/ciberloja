package com.luis.ciberloja.dao;

import java.sql.Connection;
import java.util.List;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.UnidadMedida;

public interface UnidadMedidaDAO {
	public List<UnidadMedida> findAll(Connection con) throws DataException;

}
