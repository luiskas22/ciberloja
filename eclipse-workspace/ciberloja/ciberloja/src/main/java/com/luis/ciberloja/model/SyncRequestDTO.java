package com.luis.ciberloja.model;

public class SyncRequestDTO {
	private String empresa;
	private String utilizador;
	private String password;

	public SyncRequestDTO() {
	}

	public SyncRequestDTO(String empresa, String utilizador, String password) {
		this.empresa = empresa;
		this.utilizador = utilizador;
		this.password = password;
	}

	public String getEmpresa() {
		return empresa;
	}

	public void setEmpresa(String empresa) {
		this.empresa = empresa;
	}

	public String getUtilizador() {
		return utilizador;
	}

	public void setUtilizador(String utilizador) {
		this.utilizador = utilizador;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}