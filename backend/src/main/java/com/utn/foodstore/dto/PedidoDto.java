package com.utn.foodstore.dto;

import com.utn.foodstore.enums.Estado;
import com.utn.foodstore.enums.FormaPago;

import java.time.LocalDate;
import java.util.List;

/**
 * Data Transfer Object (DTO) que representa la información consolidada de un pedido.
 * <p>
 * Se utiliza como respuesta (Response) en la capa de presentación para exponer
 * de manera segura los datos de la transacción, incluyendo detalles del comprador
 * y los ítems adquiridos.
 *
 * @param id        Identificador único del pedido en el sistema.
 * @param fecha     Fecha en la que se generó la transacción.
 * @param estado    Estado operativo actual del pedido.
 * @param formaPago Método de pago registrado.
 * @param total     Monto económico total calculado para la orden.
 * @param usuario   Información pública y detallada del cliente asociado.
 * @param detalles  Colección de líneas de detalle que componen el pedido.
 */
public record PedidoDto(
        Long id,
        LocalDate fecha,
        Estado estado,
        FormaPago formaPago,
        Double total,
        UsuarioDto usuario,
        List<DetallePedidoDto> detalles
) {
}