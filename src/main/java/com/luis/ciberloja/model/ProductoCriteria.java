package com.luis.ciberloja.model;

public class ProductoCriteria {
	private String artigo;
	private String descripcion;
	private Double pvp3Min;
	private Double pvp3Max;
	private Double stockMin;
	private Double stockMax;
	private String familiaNombre;
	private Boolean destaques;

	public ProductoCriteria() {
	}

	public String getArtigo() {
		return artigo;
	}

	public void setArtigo(String artigo) {
		this.artigo = artigo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Double getPvp3Min() {
		return pvp3Min;
	}

	public void setPvp3Min(Double pvp3Min) {
		this.pvp3Min = pvp3Min;
	}

	public Double getPvp3Max() {
		return pvp3Max;
	}

	public void setPvp3Max(Double pvp3Max) {
		this.pvp3Max = pvp3Max;
	}

	public Double getStockMin() {
		return stockMin;
	}

	public void setStockMin(Double stockMin) {
		this.stockMin = stockMin;
	}

	public Double getStockMax() {
		return stockMax;
	}

	public void setStockMax(Double stockMax) {
		this.stockMax = stockMax;
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

	public void setDestaques(Boolean destaques) {
		this.destaques = destaques;
	}
 
}