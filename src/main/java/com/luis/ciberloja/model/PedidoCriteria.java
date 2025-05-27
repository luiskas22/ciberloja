package com.luis.ciberloja.model;

import java.util.Date;

public class PedidoCriteria extends AbstractCriteria {

	private Long id;
	private Date fechaDesde;
	private Date fechaHasta;
	private Double precioDesde;
	private Double precioHasta;
	private Long clienteId;
	private Integer tipoEstadoPedidoId;
	private String productoId;
	private String descripcionProducto;

	public PedidoCriteria() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getFechaDesde() {
		return fechaDesde;
	}

	public void setFechaDesde(Date fechaDesde) {
		this.fechaDesde = fechaDesde;
	}

	public Date getFechaHasta() {
		return fechaHasta;
	}

	public void setFechaHasta(Date fechaHasta) {
		this.fechaHasta = fechaHasta;
	}

	public Double getPrecioDesde() {
		return precioDesde;
	}

	public void setPrecioDesde(Double precioDesde) {
		this.precioDesde = precioDesde;
	}

	public Double getPrecioHasta() {
		return precioHasta;
	}

	public void setPrecioHasta(Double precioHasta) {
		this.precioHasta = precioHasta;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}

	public Integer getTipoEstadoPedidoId() {
		return tipoEstadoPedidoId;
	}

	public void setTipoEstadoPedidoId(Integer tipoEstadoPedidoId) {
		this.tipoEstadoPedidoId = tipoEstadoPedidoId;
	}

	public String getProductoId() {
		return productoId;
	}

	public void setProductoId(String productoId) {
		this.productoId = productoId;
	}

	public String getDescripcionProducto() {
		return descripcionProducto;
	}

	public void setDescripcionProducto(String descripcionProducto) {
		this.descripcionProducto = descripcionProducto;
	}

}
