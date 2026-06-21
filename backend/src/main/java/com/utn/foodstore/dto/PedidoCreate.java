package com.utn.foodstore.dto;

import com.utn.foodstore.enums.FormaPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Data Transfer Object (DTO) utilizado para la creación de un nuevo pedido.
 * <p>
 * Encapsula los datos de entrada (Request) requeridos para iniciar una transacción
 * comercial. Incorpora validaciones de integridad mediante Jakarta Validation para
 * garantizar que la solicitud contenga un cliente válido, un método de pago y
 * al menos una línea de detalle.
 *
 * @param usuarioId Identificador único del cliente que emite el pedido.
 * @param formaPago Método de pago seleccionado para la transacción.
 * @param detalles  Colección de ítems a adquirir, validada en cascada.
 */
public record PedidoCreate(

        @NotNull
        Long usuarioId,

        @NotNull
        FormaPago formaPago,

        @NotEmpty
        @Valid
        List<DetallePedidoCreate> detalles
) {
}