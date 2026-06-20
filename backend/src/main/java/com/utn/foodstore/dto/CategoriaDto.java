package com.utn.foodstore.dto;

import lombok.Builder;

/**
 * ============================================================================
 * RECORD: CategoriaDto
 * ============================================================================
 * Objeto de transferencia de datos usado para devolver información al cliente.
 * Al ser un 'record', sus atributos son inmutables (final) por defecto.
 */
@Builder
public record CategoriaDto(
        Long id,
        String nombre,
        String descripcion
) {}
