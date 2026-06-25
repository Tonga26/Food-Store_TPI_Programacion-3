package com.utn.foodstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

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

        @NotNull(message = "El identificador del producto es obligatorio.")
        @Positive(message = "El identificador del producto debe ser mayor a cero.")
        Long productoId,

        @NotNull(message = "La cantidad es obligatoria.")
        @Min(value = 1, message = "La cantidad mínima a solicitar es de 1 unidad.")
        Integer cantidad
) {
}