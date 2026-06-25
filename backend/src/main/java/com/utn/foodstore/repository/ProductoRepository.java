package com.utn.foodstore.repository;

import com.utn.foodstore.model.Producto;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de acceso a datos (Data Access Layer) para la entidad {@link Producto}.
 * <p>
 * Extiende de {@link BaseRepository} para heredar las operaciones de persistencia
 * de forma unificada, garantizando que el tratamiento de registros activos e
 * inactivos se resuelva transparentemente a nivel de base de datos.
 */
@Repository
public interface ProductoRepository extends BaseRepository<Producto, Long> {
    List<Producto> findByCategoriaId(Long categoriaId);
}