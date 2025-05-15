package com.luis.ciberloja.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto") // Map to the correct table name
public class ProductoDTO {
	@Id
	@Column(name = "artigo", nullable = false)
	private String artigo;

	@Column(name = "descricao")
	private String descricao;

	@Column(name = "familia")
	private String familia;

	@Column(name = "PVP3")
	private Double pvp3;

	@Column(name = "stock")
	private Double stock;

	// Constructor, getters, setters, and toString as before
	public ProductoDTO() {
	}

	public String getId() {
		return artigo;
	}

	public void setId(String id) {
		this.artigo = id;
	}

	public String getNombre() {
		return descricao;
	}

	public void setNombre(String nombre) {
		this.descricao = nombre;
	}

	public Double getPrecio() {
		return pvp3;
	}

	public void setPrecio(Double precio) {
		this.pvp3 = precio;
	}

	public Double getStockDisponible() {
		return stock;
	}

	public void setStockDisponible(Double stockDisponible) {
		this.stock = stockDisponible;
	}

	public String getFamilia() {
		return familia;
	}

	public void setFamilia(String familia) {
		this.familia = familia;
	}

	@Override
	public String toString() {
		return "ProductoDTO [id=" + artigo + ", nombre=" + descricao + ", precio=" + pvp3 + ", stockDisponible=" + stock
				+ "]";
	}
}