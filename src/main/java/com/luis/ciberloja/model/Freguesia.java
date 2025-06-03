package com.luis.ciberloja.model;

import org.springframework.data.annotation.Id;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "freguesia")
public class Freguesia extends AbstractValueObject {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "nombre", nullable = false, length = 255)
	private String nombre;

	@Column(name = "codigo_postal", nullable = false, length = 7)
	private String codigoPostal;

	@Column(name = "concelho_id", nullable = false)
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

	public String getCodigoPostal() {
		return codigoPostal;
	}

	public void setCodigoPostal(String codigoPostal) {
		this.codigoPostal = codigoPostal;
	}

	public Integer getConcelhoId() {
		return concelhoId;
	}

	public void setConcelhoId(Integer concelhoId) {
		this.concelhoId = concelhoId;
	}

}
