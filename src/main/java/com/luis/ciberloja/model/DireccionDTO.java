package com.luis.ciberloja.model;

public class DireccionDTO extends AbstractValueObject {

	private Long id;
	private String nombreVia;
	private String dirVia;
	private Long clienteId;
	private Long empleadoId;
	private Integer freguesiaId;
	private String freguesiaNombre;
	private Integer concelhoId;
	private String concelhoNombre;
	private Integer distritoId;
	private String distritoNombre;
	private Integer paisId;
	private String paisNombre;

	public DireccionDTO() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombreVia() {
		return nombreVia;
	}

	public void setNombreVia(String nombreVia) {
		this.nombreVia = nombreVia;
	}

	public String getDirVia() {
		return dirVia;
	}

	public void setDirVia(String dirVia) {
		this.dirVia = dirVia;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}

	public Long getEmpleadoId() {
		return empleadoId;
	}

	public void setEmpleadoId(Long empleadoId) {
		this.empleadoId = empleadoId;
	}

	public Integer getFreguesiaId() {
		return freguesiaId;
	}

	public void setFreguesiaId(Integer freguesiaId) {
		this.freguesiaId = freguesiaId;
	}

	public String getFreguesiaNombre() {
		return freguesiaNombre;
	}

	public void setFreguesiaNombre(String freguesiaNombre) {
		this.freguesiaNombre = freguesiaNombre;
	}

	public Integer getConcelhoId() {
		return concelhoId;
	}

	public void setConcelhoId(Integer concelhoId) {
		this.concelhoId = concelhoId;
	}

	public String getConcelhoNombre() {
		return concelhoNombre;
	}

	public void setConcelhoNombre(String concelhoNombre) {
		this.concelhoNombre = concelhoNombre;
	}

	public Integer getDistritoId() {
		return distritoId;
	}

	public void setDistritoId(Integer distritoId) {
		this.distritoId = distritoId;
	}

	public String getDistritoNombre() {
		return distritoNombre;
	}

	public void setDistritoNombre(String distritoNombre) {
		this.distritoNombre = distritoNombre;
	}

	public Integer getPaisId() {
		return paisId;
	}

	public void setPaisId(Integer paisId) {
		this.paisId = paisId;
	}

	public String getPaisNombre() {
		return paisNombre;
	}

	public void setPaisNombre(String paisNombre) {
		this.paisNombre = paisNombre;
	}

}
