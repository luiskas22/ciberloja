package com.luis.ciberloja.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "familia")
public class Familia {

    @Id
    @Column(name = "familia", nullable = false)
    private String familia;

    @Column(name = "descricao")
    private String descricao;

    // Constructor
    public Familia() {
    }

    // Getters and Setters
    public String getId() {
        return familia;
    }

    public void setId(String id) {
        this.familia = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @Override
    public String toString() {
        return "Familia [id=" + familia + ", descricao=" + descricao + "]";
    }
}