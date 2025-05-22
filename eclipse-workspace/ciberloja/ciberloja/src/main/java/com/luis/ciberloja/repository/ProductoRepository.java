package com.luis.ciberloja.repository;

import com.luis.ciberloja.model.ProductoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductoRepository extends JpaRepository<ProductoDTO, String> {

    @Query("SELECT p FROM ProductoDTO p WHERE p.artigo = :artigo")
    ProductoDTO findByArtigo(@Param("artigo") String artigo);

    @Query("SELECT p FROM ProductoDTO p")
    Page<ProductoDTO> findAllWithFamilia(Pageable pageable);

    @Query("SELECT p FROM ProductoDTO p " +
           "WHERE (:artigo IS NULL OR p.artigo = :artigo) " +
           "AND (:descricao IS NULL OR UPPER(p.descricao) LIKE UPPER(CONCAT('%', :descricao, '%'))) " +
           "AND (:pvp3Min IS NULL OR p.pvp3 >= :pvp3Min) " +
           "AND (:pvp3Max IS NULL OR p.pvp3 <= :pvp3Max) " +
           "AND (:stockMin IS NULL OR p.stock >= :stockMin) " +
           "AND (:stockMax IS NULL OR p.stock <= :stockMax) " +
           "AND (:familia IS NULL OR p.familia = :familia)")
    Page<ProductoDTO> findByCriteria(
            @Param("artigo") String artigo,
            @Param("descricao") String descricao,
            @Param("pvp3Min") Double pvp3Min,
            @Param("pvp3Max") Double pvp3Max,
            @Param("stockMin") Double stockMin,
            @Param("stockMax") Double stockMax,
            @Param("familia") String familia,
            Pageable pageable);
}