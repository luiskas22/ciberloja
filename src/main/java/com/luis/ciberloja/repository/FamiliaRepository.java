package com.luis.ciberloja.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luis.ciberloja.model.Familia;
import com.luis.ciberloja.model.ProductoDTO;

@Repository
public interface FamiliaRepository extends JpaRepository<Familia, String> {

}
