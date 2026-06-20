package com.utn.foodstore.dto;

import jakarta.validation.constraints.*;

/**
 * Objeto de Transferencia de Datos (DTO) utilizado para encapsular la información
 * enviada por el cliente al momento de crear un nuevo producto.
 * <p>
 * Emplea validaciones de Jakarta Validation para asegurar que los datos obligatorios
 * y las reglas de negocio básicas se cumplan antes de que la información ingrese
 * a la capa de servicio, protegiendo así la integridad de la base de datos.
 */
public record ProductoCreate(

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