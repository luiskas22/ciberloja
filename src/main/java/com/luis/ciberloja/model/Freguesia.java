package com.luis.ciberloja.model;

public class Freguesia extends AbstractValueObject {

	private Integer id;

	private String nombre;

	private Integer concelhoId;

	public Freguesia() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Integer getConcelhoId() {
		return concelhoId;
	}

	public void setConcelhoId(Integer concelhoId) {
		this.concelhoId = concelhoId;
	}

}
