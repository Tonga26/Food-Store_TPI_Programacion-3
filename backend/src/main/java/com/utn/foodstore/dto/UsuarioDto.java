package com.utn.foodstore.dto;

import com.utn.foodstore.enums.Rol;
import lombok.Builder;

/**
 * Objeto de Transferencia de Datos (DTO) de respuesta, utilizado para exponer
 * la información de un usuario de forma segura hacia el exterior.
 * <p>
 * Omite intencionalmente atributos sensibles como la contraseña, garantizando
 * que los hashes de seguridad nunca abandonen la capa del servidor.
 *
 * @param id       El identificador único del usuario en la base de datos.
 * @param nombre   El nombre de pila del usuario.
 * @param apellido El apellido del usuario.
 * @param email    La dirección de correo electrónico registrada.
 * @param celular  El número de contacto del usuario.
 * @param rol      El nivel de autorización y acceso asignado en el sistema.
 */
@Builder
public record UsuarioDto(
        Long id,
        String nombre,
        String apellido,
        String email,
        String celular,
        Rol rol
) {}