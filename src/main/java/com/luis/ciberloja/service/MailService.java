package com.luis.ciberloja.service;

import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.Pedido;

public interface MailService {

	public void enviar(String para, String asunto, String msg) throws MailException;

	public void sendBienvenida(String to, ClienteDTO cliente) throws MailException;

	public void sendPedidoRealizado(String to, ClienteDTO cliente, Pedido pedido) throws MailException;

	public void sendPasswordResetEmail(String to, String token, Long clientId) throws MailException;

	public void sendEstadoPedido(String to, ClienteDTO cliente, Pedido pedido) throws Exception;
}
