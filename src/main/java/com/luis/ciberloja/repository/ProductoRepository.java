package com.luis.ciberloja.repository;

import com.luis.ciberloja.model.ProductoDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<ProductoDTO, String> {
}