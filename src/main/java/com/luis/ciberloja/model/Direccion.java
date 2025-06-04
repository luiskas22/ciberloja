package com.luis.ciberloja.model;

import jakarta.persistence.*;

@Entity
@Table(name = "direccion")
public class Direccion extends AbstractValueObject {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nombre_via", nullable = false, length = 255)
	private String nombreVia;

	@Column(name = "dir_via", nullable = false, length = 255)
	private String dirVia;

	@Column(name = "cliente_id")
	private Long clienteId;

	@Column(name = "empleado_id")
	private Long empleadoId;

	@Column(name = "freguesia_id", nullable = false)
	private Integer freguesiaId;

	public Direccion() {
	}

	public Direccion(String nombreVia, String dirVia, Long clienteId, Long empleadoId, Integer freguesiaId) {
		this.nombreVia = nombreVia;
		this.dirVia = dirVia;
		this.clienteId = clienteId;
		this.empleadoId = empleadoId;
		this.freguesiaId = freguesiaId;
	}

	// Getters y setters
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
}