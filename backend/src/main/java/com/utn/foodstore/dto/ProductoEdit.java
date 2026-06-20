package com.utn.foodstore.dto;

import jakarta.validation.constraints.*;

/**
 * Objeto de Transferencia de Datos (DTO) utilizado para encapsular la información
 * enviada por el cliente al momento de modificar un producto existente.
 * <p>
 * Emplea validaciones de Jakarta Validation para asegurar que los datos obligatorios
 * mantengan la consistencia y las reglas de negocio antes de aplicar la actualización
 * en la base de datos. Estructuralmente similar a la creación, pero destinado
 * semánticamente a operaciones de actualización (PUT/PATCH).
 */
public record ProductoEdit(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        String nombre,

        @NotNull
        @Positive(message = "El precio debe ser mayor a cero.")
        Double precio,

        @Size(max = 500, message = "La descripción no puede superar los 500 caracteres.")
        String descripcion,

        @NotNull(message = "El stock es obligatorio.")
        @PositiveOrZero(message = "El stock no puede tener valores negativos.")
        Integer stock,

        @Size(max = 500)
        String imagen,

        @NotNull(message = "Debe especificar si el producto está disponible.")
        Boolean disponible,

        @NotNull
        @Positive(message = "Debe seleccionar una categoría válida.")
        Long categoriaId
) {
}