package com.utn.foodstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) que representa un ítem individual a procesar
 * en la creación de un pedido.
 * <p>
 * Diseñado para operar de forma anidada dentro de la estructura de solicitud de órdenes.
 * Incluye restricciones de validación para asegurar la consistencia del identificador
 * del producto y el requerimiento de un volumen mínimo de compra.
 *
 * @param productoId Identificador único del producto a adquirir.
 * @param cantidad   Unidades solicitadas del producto (requiere un mínimo de 1).
 */
public record DetallePedidoCreate(

        @NotNull
        Long productoId,

        @NotNull
        @Min(1)
        Integer cantidad
) {
}