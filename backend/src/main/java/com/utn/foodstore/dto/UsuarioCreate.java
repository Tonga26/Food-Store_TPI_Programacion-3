package com.utn.foodstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Objeto de Transferencia de Datos (DTO) utilizado para encapsular la información
 * recibida durante el proceso de registro de un nuevo usuario en el sistema.
 * <p>
 * Implementa las restricciones de validación requeridas para garantizar la
 * integridad de los datos antes de su persistencia.
 *
 * @param nombre   El nombre de pila del usuario. Debe tener entre 2 y 50 caracteres.
 * @param apellido El apellido del usuario. Debe tener entre 2 y 50 caracteres.
 * @param email    La dirección de correo electrónico, utilizada como credencial de acceso.
 * @param celular  El número de contacto del usuario.
 * @param password La contraseña en texto plano para el acceso al sistema. Mínimo 6 caracteres.
 */
public record UsuarioCreate(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
        String apellido,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El formato del email es inválido")
        @Size(max = 100, message = "El email no puede superar los 100 caracteres")
        String email,

        @Size(max = 20, message = "El celular no puede superar los 20 caracteres")
        String celular,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        String password
) {}