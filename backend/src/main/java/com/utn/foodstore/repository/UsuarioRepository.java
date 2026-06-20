package com.utn.foodstore.repository;

import com.utn.foodstore.model.Usuario;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio de acceso a datos para la entidad {@link Usuario}.
 * <p>
 * Extiende de {@link BaseRepository} para heredar las operaciones estándar de
 * persistencia y la gestión automática del borrado lógico.
 * Proporciona métodos de consulta específicos para las reglas de negocio
 * relacionadas con la gestión de cuentas y validación de identidades.
 */
@Repository
public interface UsuarioRepository extends BaseRepository<Usuario, Long> {

    /**
     * Verifica la existencia de un registro en el sistema utilizando la dirección
     * de correo electrónico.
     * <p>
     * Empleado en el proceso de registro para garantizar la unicidad del identificador
     * principal de acceso y evitar la duplicación de cuentas.
     *
     * @param email La dirección de correo electrónico a consultar.
     * @return {@code true} si existe un usuario registrado con dicho email,
     * {@code false} en caso contrario.
     */
    boolean existsByEmail(String email);

    /**
     * Recupera un usuario activo del sistema mediante su dirección de correo electrónico.
     * <p>
     * Diseñado para el proceso de inicio de sesión (Login) o recuperación de credenciales,
     * filtrando automáticamente aquellas cuentas que han sufrido una baja lógica.
     *
     * @param email La dirección de correo electrónico del usuario a buscar.
     * @return Un objeto {@link Optional} que contiene la entidad {@link Usuario} si
     * fue encontrada y está activa, o vacío en caso de no existir o estar eliminada.
     */
    Optional<Usuario> findByEmailAndEliminadoFalse(String email);
}