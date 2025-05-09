package com.luis.ciberloja.model;

public class ProductoDTO {
	private String id;
	private String nombre;
	private Double precio;
	private Double stockDisponible;
	private String familia;

	public ProductoDTO() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Double getPrecio() {
		return precio;
	}

	public void setPrecio(Double precio) {
		this.precio = precio;
	}

	public Double getStockDisponible() {
		return stockDisponible;
	}

	public void setStockDisponible(Double stockDisponible) {
		this.stockDisponible = stockDisponible;
	}

	public String getFamilia() {
		return familia;
	}

	public void setFamilia(String familia) {
		this.familia = familia;
	}

	@Override
	public String toString() {
		return "ProductoDTO [id=" + id + ", nombre=" + nombre + ", precio=" + precio + ", stockDisponible="
				+ stockDisponible + "]";
	}

}
