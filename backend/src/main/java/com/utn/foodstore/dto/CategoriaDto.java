package com.utn.foodstore.dto;

/**
 * ============================================================================
 * RECORD: CategoriaDto
 * ============================================================================
 * Objeto de transferencia de datos usado para devolver información al cliente.
 * Al ser un 'record', sus atributos son inmutables (final) por defecto.
 */
public record CategoriaDto(
        Long id,
        String nombre,
        String descripcion
) {}
