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

        @NotBlank(message = "El nombre es obligatorio y no puede estar en blanco.")
        @Size(min = 2, max = 100, message = "Debe contener entre 2 y 100 caracteres.")
        String nombre,

        @Size(max = 500)
        String descripcion
) {}
