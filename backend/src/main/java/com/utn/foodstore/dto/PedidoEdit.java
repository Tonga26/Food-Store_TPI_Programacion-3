package com.utn.foodstore.dto;

import com.utn.foodstore.enums.Estado;
import com.utn.foodstore.enums.FormaPago;
import com.utn.foodstore.model.Pedido;

/**
 * Data Transfer Object (DTO) destinado a la actualización parcial de un pedido existente.
 * <p>
 * Permite la modificación de atributos operativos de la transacción, como su estado
 * o forma de pago. Al ser concebido para operaciones de actualización parcial (PATCH/PUT),
 * los atributos no provistos (nulos) son ignorados durante el procesamiento.
 * <p>
 * Implementa el patrón Mutator a través del método {@link #applyTo(Pedido)} para delegar
 * la responsabilidad de la inyección de datos a este mismo objeto.
 *
 * @param estado    Nuevo estado operativo a asignar al pedido.
 * @param formaPago Nuevo método de pago a registrar.
 */
public record PedidoEdit(
        Estado estado,
        FormaPago formaPago
) {
    /**
     * Aplica los valores transportados por este DTO a una entidad persistida existente.
     * Evalúa uno a uno los campos; si el DTO contiene un valor no nulo, sobreescribe
     * el estado de la entidad original garantizando la persistencia de los datos previos.
     *
     * @param pedido La entidad de dominio recuperada de la base de datos que será mutada.
     */
    public void applyTo(Pedido pedido) {
        if (this.estado() != null) pedido.setEstado(this.estado());
        if (this.formaPago() != null) pedido.setFormaPago(this.formaPago());
    }
}