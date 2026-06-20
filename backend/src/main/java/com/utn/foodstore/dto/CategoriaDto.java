package com.utn.foodstore.dto;

import lombok.Builder;

/**
 * Objeto de Transferencia de Datos (DTO) de solo lectura utilizado para exponer
 * la información de una categoría hacia el cliente exterior.
 * <p>
 * Actúa como un contrato de respuesta de la API, garantizando que no se filtren
 * datos sensibles o de infraestructura (como banderas de borrado lógico o metadatos
 * de base de datos) propios de la entidad de dominio.
 *
 * @param id          El identificador único y autogenerado de la categoría.
 * @param nombre      El nombre comercial asignado a la categoría.
 * @param descripcion Los detalles descriptivos asociados a la categoría.
 */
@Builder
public record CategoriaDto(
        Long id,
        String nombre,
        String descripcion
) {}