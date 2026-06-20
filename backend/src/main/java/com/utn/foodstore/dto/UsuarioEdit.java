package com.utn.foodstore.dto;

import com.utn.foodstore.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Objeto de Transferencia de Datos (DTO) utilizado para aplicar modificaciones
 * parciales sobre los datos de un usuario existente.
 * <p>
 * Todos los campos son opcionales, permitiendo al cliente enviar únicamente
 * la información que desea actualizar.
 *
 * @param nombre   El nuevo nombre propuesto para el usuario.
 * @param apellido El nuevo apellido propuesto para el usuario.
 * @param email    La nueva dirección de correo electrónico.
 * @param celular  El nuevo número de contacto.
 * @param password La nueva contraseña en texto plano.
 */
public record UsuarioEdit(

        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
        String nombre,

        @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
        String apellido,

        @Email(message = "El formato del email es inválido")
        @Size(max = 100, message = "El email no puede superar los 100 caracteres")
        String email,

        @Size(max = 20, message = "El celular no puede superar los 20 caracteres")
        String celular,

        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        String password
) {
    /**
     * Aplica los valores transportados por este DTO a una entidad persistida existente.
     * Evalúa uno a uno los campos; si el DTO contiene un valor no nulo, sobreescribe
     * el estado de la entidad original.
     * <p>
     * Nota Arquitectónica: La actualización del campo 'password' se excluye intencionalmente
     * de este método. Su mutación debe orquestarse en la capa de Servicio para garantizar
     * la correcta aplicación del algoritmo de encriptación (BCrypt).
     *
     * @param usuario La entidad de dominio recuperada de la base de datos que será mutada.
     */
    public void applyTo(Usuario usuario) {
        if (this.nombre() != null) usuario.setNombre(this.nombre());
        if (this.apellido() != null) usuario.setApellido(this.apellido());
        if (this.email() != null) usuario.setEmail(this.email());
        if (this.celular() != null) usuario.setCelular(this.celular());
    }
}