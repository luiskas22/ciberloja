package com.luis.ciberloja.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "producto")
public class ProductoDTO {
	@Id
	private String artigo;
	private String descricao;
	private Double pvp3;
	private Double stock;
	private String familia;
	private Boolean destaques;
	@Transient
	private String familiaNombre;

	// Getters and setters
	public String getId() {
		return artigo;
	}

	public void setId(String artigo) {
		this.artigo = artigo;
	}

	public String getNombre() {
		return descricao;
	}

	public void setNombre(String descripcion) {
		this.descricao = descripcion;
	}

	public Double getPrecio() {
		return pvp3;
	}

	public void setPrecio(Double pvp3) {
		this.pvp3 = pvp3;
	}

	public Double getStockDisponible() {
		return stock;
	}

	public void setStockDisponible(Double stock) {
		this.stock = stock;
	}

	public String getFamilia() {
		return familia;
	}

	public void setFamilia(String familia) {
		this.familia = familia;
	}

	public String getFamiliaNombre() {
		return familiaNombre;
	}

	public void setFamiliaNombre(String familiaNombre) {
		this.familiaNombre = familiaNombre;
	}

	public Boolean getDestaques() {
		return destaques;
	}

	public void setDestaques(Boolean destaqueSite) {
		this.destaques = destaqueSite;
	}

}