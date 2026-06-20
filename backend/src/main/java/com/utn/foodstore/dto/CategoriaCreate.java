package com.utn.foodstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * ============================================================================
 * RECORD: CategoriaCreate
 * ============================================================================
 * DTO (Data Transfer Object) utilizado exclusivamente para recibir los datos
 * desde el Frontend cuando el Administrador quiere crear una nueva categoría.
 */
public record CategoriaCreate(

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres.")
        String nombre,

        @Size(max = 500, message = "La descripción no puede exceder de 500 caracteres.")
        String descripcion
) {}
