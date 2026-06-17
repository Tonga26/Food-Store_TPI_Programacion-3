package com.utn.foodstore.repository;

import com.utn.foodstore.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de acceso a datos para la entidad {@link Categoria}.
 * <p>
 * Al extender de {@link JpaRepository}, Spring Data JPA provee automáticamente
 * en tiempo de ejecución las implementaciones estándar para las operaciones CRUD
 * (Crear, Leer, Actualizar, Borrar) directas sobre la base de datos.
 * Actúa como la capa de integración de datos (DAO) aislando la lógica de
 * acceso de la capa de servicio.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    /**
     * Recupera una lista con todas las categorías que no han sido eliminadas lógicamente.
     * <p>
     * Utiliza la convención de "Query Methods" de Spring Data JPA para generar
     * automáticamente la consulta SQL equivalente a:
     * {@code SELECT * FROM categorias WHERE eliminado = false}.
     *
     * @return Una colección {@link List} que contiene las entidades {@link Categoria} activas.
     */
    List<Categoria> findAllByEliminadoFalse();
}