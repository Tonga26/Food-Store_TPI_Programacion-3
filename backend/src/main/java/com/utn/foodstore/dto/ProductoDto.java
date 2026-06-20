package com.utn.foodstore.dto;

import lombok.Builder;

/**
 * Objeto de Transferencia de Datos (DTO) de solo lectura utilizado para exponer
 * la información pública de un producto hacia el cliente.
 * <p>
 * Este record aplana la relación con la entidad Categoría, proporcionando
 * directamente el ID y el nombre de la misma para facilitar el renderizado
 * en la interfaz de usuario sin exponer el modelo de dominio interno.
 */
@Builder
public record ProductoDto(
        Long id,
        String nombre,
        double precio,
        String descripcion,
        int stock,
        String imagen,
        Boolean disponible,
        Long categoriaId,
        String categoriaNombre
) {
}