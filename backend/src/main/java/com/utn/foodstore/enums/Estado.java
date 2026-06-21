package com.utn.foodstore.enums;

/**
 * Enumeración que define los posibles estados por los que puede transitar un Pedido.
 * <p>
 * Representa el ciclo de vida o flujo de negocio de una orden de compra dentro del sistema,
 * permitiendo controlar en qué etapa se encuentra la transacción desde que el cliente
 * la inicia hasta que finaliza (ya sea por entrega exitosa o cancelación).
 */
public enum Estado {

    /**
     * Estado inicial por defecto cuando el usuario crea el pedido.
     * Indica que la orden ha sido registrada en el sistema pero aún no ha sido
     * procesada, validada o preparada por el personal del local.
     */
    PENDIENTE,

    /**
     * Indica que el pedido ha sido validado (ej. pago aprobado o datos correctos).
     * La orden entra en la cola de trabajo de la cocina para comenzar su preparación.
     */
    CONFIRMADO,

    /**
     * Estado final de éxito. Indica que el pedido ya fue preparado y entregado
     * al cliente satisfactoriamente. Cierra el ciclo de vida operativo de la transacción.
     */
    TERMINADO,

    /**
     * Estado final de fallo o aborto. Indica que la orden fue detenida, ya sea por el cliente,
     * por falta de stock o por problemas con el pago. Un pedido cancelado
     * no se elimina físicamente, sino que se conserva para el historial y auditoría.
     */
    CANCELADO
}