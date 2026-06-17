package com.utn.foodstore.dto;

import jakarta.validation.constraints.Size;

/**
 * ============================================================================
 * RECORD: CategoriaEdit
 * ============================================================================
 * DTO utilizado para recibir actualizaciones parciales de una categoría existente.
 * Cumple con la Historia de Usuario HU-004.
 */
public record CategoriaEdit(

        @Size(min = 2, max = 100)
        String nombre,

        @Size(max = 500)
        String descripcion
) {}
