package com.utn.foodstore.model;

/**
 * Contrato que define la capacidad de una entidad o modelo para calcular un valor total.
 * <p>
 * Las clases que implementen esta interfaz (como Pedido, Carrito o Factura) deberán
 * proporcionar la lógica específica para procesar y actualizar su monto total
 * en base a sus elementos internos (por ejemplo, sumando los subtotales
 * de sus detalles o productos y aplicando los descuentos o impuestos correspondientes).
 */
public interface Calculable {

    /**
     * Ejecuta la lógica de negocio necesaria para calcular el valor total.
     * La implementación de este método debe encargarse de recorrer los elementos
     * dependientes y actualizar el estado interno del objeto con el resultado final.
     */
    void calcularTotal();
}