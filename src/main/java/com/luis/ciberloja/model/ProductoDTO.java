package com.luis.ciberloja.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class ProductoDTO {

    @Id
    private String artigo; // Este es el ID del producto (e.g., "artigo")

    private String descricao;

    private Double pvp3;

    private Double stock;

    @ManyToOne
    @JoinColumn(name = "familia", referencedColumnName = "familia") // La columna 'familia' en 'producto' referencia la columna 'familia' en 'familia'
    private Familia familia;

    // Getters y setters
    public String getId() {
        return artigo;
    }

    public void setId(String artigo) {
        this.artigo = artigo;
    }

    public String getNombre() {
        return descricao;
    }

    public void setNombre(String descricao) {
        this.descricao = descricao;
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

    public Familia getFamilia() {
        return familia;
    }

    public void setFamilia(Familia familia) {
        this.familia = familia;
    }
}