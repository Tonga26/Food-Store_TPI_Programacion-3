package com.utn.foodstore.repository;

import com.utn.foodstore.model.Categoria;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de acceso a datos para la entidad {@link Categoria}.
 * <p>
 * Extiende de {@link BaseRepository} delegando las operaciones CRUD estándar
 * y la gestión automática del borrado lógico (Soft Delete).
 * Actúa como la capa de integración de datos (DAO) aislando la lógica de
 * acceso de la capa de servicio.
 */
@Repository
public interface CategoriaRepository extends BaseRepository<Categoria, Long> {
}