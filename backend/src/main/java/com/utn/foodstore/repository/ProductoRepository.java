package com.utn.foodstore.repository;

import com.utn.foodstore.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de acceso a datos para la entidad {@link Producto}.
 * <p>
 * Proporciona los métodos necesarios para interactuar con la tabla de productos
 * en la base de datos, heredando las operaciones CRUD básicas de {@link JpaRepository}.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Recupera una lista de todos los productos que están activos en el sistema.
     * <p>
     * Filtra los registros utilizando el campo de borrado lógico (Soft Delete),
     * excluyendo aquellos cuyo atributo {@code eliminado} sea {@code true}.
     *
     * @return Una colección {@link List} de entidades {@link Producto} activas.
     */
    List<Producto> findAllByEliminadoFalse();
}