package com.luis.ciberloja.dao;

import java.sql.Connection;

import com.luis.ciberloja.DataException;
import com.luis.ciberloja.model.PasswordResetTokenDTO;

public interface PasswordResetTokenDAO {
    void create(Connection connection, PasswordResetTokenDTO token) throws DataException;
    PasswordResetTokenDTO findByToken(Connection connection, String token) throws DataException;
    boolean update(Connection connection, PasswordResetTokenDTO token) throws DataException;
}