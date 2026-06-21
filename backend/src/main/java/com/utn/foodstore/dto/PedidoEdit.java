package com.utn.foodstore.dto;

import com.utn.foodstore.enums.Estado;
import com.utn.foodstore.enums.FormaPago;

/**
 * Data Transfer Object (DTO) destinado a la actualización parcial de un pedido existente.
 * <p>
 * Permite la modificación de atributos operativos de la transacción, como su estado
 * o forma de pago. Al ser concebido para operaciones de actualización parcial (PATCH/PUT),
 * los atributos no provistos (nulos) son ignorados durante el procesamiento.
 *
 * @param estado    Nuevo estado operativo a asignar al pedido.
 * @param formaPago Nuevo método de pago a registrar.
 */
public record PedidoEdit(
        Estado estado,
        FormaPago formaPago
) {
}