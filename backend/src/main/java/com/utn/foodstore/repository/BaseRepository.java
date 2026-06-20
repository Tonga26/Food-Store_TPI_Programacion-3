package com.utn.foodstore.repository;

import com.utn.foodstore.model.Base;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio base que centraliza las operaciones de acceso a datos para todas las
 * entidades del dominio que heredan de {@link Base}.
 * <p>
 * Implementa automáticamente el patrón de borrado lógico (Soft Delete) y provee
 * métodos utilitarios por defecto para la búsqueda y filtrado de registros activos,
 * evitando la duplicación de lógica de negocio en la capa de servicios.
 *
 * @param <E>  El tipo de la entidad de dominio que extiende de Base.
 * @param <ID> El tipo de dato del identificador primario de la entidad.
 */
@NoRepositoryBean
public interface BaseRepository<E extends Base, ID> extends JpaRepository<E, ID> {

    /**
     * Recupera todas las entidades cuyo flag de eliminación lógica sea falso.
     *
     * @return Colección de entidades activas.
     */
    List<E> findAllByEliminadoFalse();

    /**
     * Recupera una entidad específica por su identificador, asegurando que se
     * encuentre activa.
     *
     * @param id El identificador único de la entidad.
     * @return Un {@link Optional} con la entidad si existe y está activa.
     */
    Optional<E> findByIdAndEliminadoFalse(ID id);

    /**
     * Sobrescribe el comportamiento estándar de Spring Data para asegurar que
     * las consultas generales omitan los registros eliminados lógicamente.
     *
     * @return Colección de entidades activas.
     */
    @Override
    default List<E> findAll() {
        return findAllByEliminadoFalse();
    }

    /**
     * Ejecuta la búsqueda de una entidad activa y lanza una excepción estandarizada
     * si no se encuentra, centralizando el manejo de errores.
     *
     * @param id El identificador único de la entidad.
     * @return La entidad recuperada.
     * @throws RuntimeException Si la entidad no existe o se encuentra inactiva.
     */
    default E findByIdOrThrow(ID id) {
        return findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new RuntimeException("Entidad con id " + id + " no encontrado"));
    }

    /**
     * Sobrescribe el borrado físico estándar de JPA transformándolo en un
     * borrado lógico (Soft Delete) a nivel de base de datos.
     * <p>
     * Utiliza SpEL (Spring Expression Language) para inyectar dinámicamente
     * el nombre de la tabla de la entidad concreta que invoca el método.
     *
     * @param id El identificador único de la entidad a desactivar.
     */
    @Override
    @Transactional
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.eliminado = true WHERE e.id = :id")
    void deleteById(@Param("id") ID id);
}