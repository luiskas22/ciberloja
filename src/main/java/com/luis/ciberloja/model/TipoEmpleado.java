package com.luis.ciberloja.model;

public class TipoEmpleado extends AbstractValueObject{
	
	private Integer id;
	private String nombre;
	
	public TipoEmpleado() {
		
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
	
	
}
