package com.luis.ciberloja.service;

import com.luis.ciberloja.PinguelaException;

public class StockException extends PinguelaException{
	public StockException() {

	}

	public StockException(String message) {
		super(message);
	}

	public StockException(Throwable cause) {
		super(cause);
	}

	public StockException(String message, Throwable cause) {
		super(message, cause);
	}
}
