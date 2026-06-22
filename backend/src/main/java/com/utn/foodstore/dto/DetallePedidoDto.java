package com.utn.foodstore.dto;

import lombok.Builder;

/**
 * Data Transfer Object (DTO) que encapsula la información de una línea de detalle procesada.
 * <p>
 * Se utiliza como objeto de transferencia de salida para exponer el subtotal calculado
 * y los datos específicos del producto, desvinculando la capa de presentación del
 * modelo de persistencia subyacente.
 *
 * @param id       Identificador único de la línea de detalle.
 * @param cantidad Volumen de unidades confirmadas en la transacción.
 * @param subtotal Monto económico parcial resultante de la cantidad por el precio unitario.
 * @param producto Información pública y consolidada del producto asociado.
 */
@Builder
public record DetallePedidoDto(
        Long id,
        Integer cantidad,
        Double subtotal,
        ProductoDto producto
) {
}