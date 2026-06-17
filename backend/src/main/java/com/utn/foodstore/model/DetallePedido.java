package com.utn.foodstore.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Entidad que representa una línea de detalle o ítem específico dentro de un pedido.
 * <p>
 * Mapea la tabla {@code detalles_pedido} en la base de datos y extiende de {@link Base}
 * para heredar las propiedades de auditoría e identificación. Actúa como una relación
 * con estado entre un pedido y un producto, registrando la cantidad adquirida
 * y calculando el subtotal correspondiente a esa línea.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder
@Entity
@Table(name = "detalles_pedido")
public class DetallePedido extends Base {

    /**
     * Cantidad de unidades del producto seleccionadas para este detalle.
     * Este campo es obligatorio para calcular correctamente el subtotal.
     */
    @Column(nullable = false)
    private int cantidad;

    /**
     * Monto económico resultante de multiplicar la cantidad de unidades por el
     * precio unitario del producto.
     * Este campo es obligatorio y su sumatoria compone el total del pedido.
     */
    @Column(nullable = false)
    private Double subtotal;

    /**
     * Producto específico asociado a esta línea de detalle.
     * <p>
     * Define una relación de muchos a uno, enlazada físicamente en la base de datos
     * mediante la clave foránea {@code producto_id}. Es una asociación estrictamente
     * obligatoria (optional = false) y se utiliza como la propiedad principal para
     * determinar la igualdad del objeto (equals/hashCode) dentro de la colección de un pedido.
     */
    @EqualsAndHashCode.Include
    @ManyToOne(optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
}