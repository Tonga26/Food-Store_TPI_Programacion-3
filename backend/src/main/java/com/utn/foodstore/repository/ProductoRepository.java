package com.utn.foodstore.repository;

import com.utn.foodstore.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio de acceso a datos (Data Access Layer) para la entidad {@link Producto}.
 * <p>
 * Extiende de {@link JpaRepository} para heredar las operaciones de persistencia
 * estándar y proporciona firmas de métodos de consulta (Query Methods) personalizados
 * para gestionar la recuperación de registros considerando su estado de borrado lógico.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Recupera el catálogo completo de productos que se encuentran activos en el sistema.
     * <p>
     * Excluye automáticamente aquellos registros que han sufrido una baja lógica
     * (Soft Delete), garantizando que no se expongan artículos descontinuados.
     *
     * @return Colección {@link List} de entidades {@link Producto} con estado activo.
     */
    List<Producto> findAllByEliminadoFalse();

    /**
     * Busca un producto específico por su identificador único, asegurando que
     * el registro se encuentre en estado activo.
     * <p>
     * Previene la recuperación y exposición accidental de recursos que han sido
     * dados de baja mediante el mecanismo de borrado lógico.
     *
     * @param id El identificador único (Clave Primaria) de la entidad a buscar.
     * @return Un contenedor {@link Optional} con la entidad {@link Producto} si existe
     * y está activa, o un Optional vacío en caso contrario.
     */
    Optional<Producto> findByIdAndEliminadoFalse(Long id);
}