package com.luis.ciberloja.repository;

import com.luis.ciberloja.model.ProductoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductoRepository extends JpaRepository<ProductoDTO, String> {

}