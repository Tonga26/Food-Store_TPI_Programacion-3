package com.utn.foodstore.enums;

/**
 * Enumeración que centraliza los métodos de pago aceptados por el sistema.
 * <p>
 * Se utiliza en la entidad Pedido para registrar cómo el cliente decidió o logró
 * abonar su compra. Facilita futuras integraciones con pasarelas de pago (como MercadoPago).
 */
public enum FormaPago {

    /**
     * Pago realizado mediante tarjeta de crédito o débito.
     * Generalmente implica una validación automática a través de una pasarela externa.
     */
    TARJETA,

    /**
     * Pago realizado mediante transferencia bancaria o billetera virtual (ej. alias/CBU).
     * En la vida real, suele requerir que un administrador verifique el comprobante
     * antes de pasar el pedido a estado CONFIRMADO.
     */
    TRANSFERENCIA,

    /**
     * Pago a realizarse en moneda física al momento de retirar el pedido en el local
     * o al recibirlo mediante el repartidor.
     */
    EFECTIVO
}