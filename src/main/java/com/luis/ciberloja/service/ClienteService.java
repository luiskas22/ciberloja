package com.luis.ciberloja.service;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.Results;

public interface ClienteService {

	public Results<ClienteDTO> findAll(int pos, int pageSize) throws DataException;

	public ClienteDTO findById(Long id) throws DataException;

	public ClienteDTO findByNick(String nick) throws DataException;

	public ClienteDTO findByEmail(String mail) throws DataException;

	public Long registrar(ClienteDTO c) throws DataException, ServiceException;

	public boolean update(ClienteDTO c) throws DataException;

	public boolean updatePassword(String password, Long id) throws DataException;

	public boolean delete(Long id) throws DataException, ServiceException;

	public ClienteDTO autenticar(String mail, String password) throws DataException;

	public String generatePasswordResetToken(String email) throws DataException;

	public boolean validateAndUpdatePassword(String token, String newPassword) throws DataException;

}
