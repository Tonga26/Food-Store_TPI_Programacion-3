package com.utn.foodstore.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.utn.foodstore.enums.Rol;
import lombok.Builder;

/**
 * Objeto de Transferencia de Datos (DTO) de respuesta, utilizado para exponer
 * la información de un usuario de forma segura hacia el exterior.
 * <p>
 * Omite intencionalmente atributos sensibles como la contraseña, garantizando
 * que los hashes de seguridad nunca abandonen la capa del servidor. Utiliza
 * {@link JsonInclude} para excluir propiedades nulas de la serialización JSON
 * (específicamente útil para el manejo del token en consultas de solo lectura).
 *
 * @param id       El identificador único del usuario en la base de datos.
 * @param nombre   El nombre de pila del usuario.
 * @param apellido El apellido del usuario.
 * @param email    La dirección de correo electrónico registrada.
 * @param celular  El número de contacto del usuario.
 * @param rol      El nivel de autorización y acceso asignado en el sistema.
 * @param token    El token de seguridad JWT emitido exclusivamente tras una autenticación exitosa.
 */
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UsuarioDto(
        Long id,
        String nombre,
        String apellido,
        String email,
        String celular,
        Rol rol,
        String token
) {}