package com.utn.foodstore.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Entidad que representa un producto disponible para la venta en el catálogo del sistema.
 * <p>
 * Mapea la tabla {@code productos} en la base de datos y extiende de {@link Base}
 * para heredar las propiedades de auditoría e identificación. Centraliza la información
 * comercial del artículo, su disponibilidad, nivel de inventario (stock) y su
 * clasificación mediante una relación de muchos a uno con la entidad {@link Categoria}.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = {"descripcion", "imagen"})
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder
@Entity
@Table(name = "productos")
public class Producto extends Base {

    /**
     * Nombre comercial o descriptivo del producto.
     * Este campo es obligatorio y tiene un límite máximo de 100 caracteres.
     * Se utiliza como propiedad principal para determinar la igualdad del objeto (equals/hashCode).
     */
    @EqualsAndHashCode.Include
    @Column(nullable = false, length = 100)
    private String nombre;

    /**
     * Precio de venta unitario del producto.
     * Este valor monetario es obligatorio para permitir transacciones en el sistema.
     */
    @Column(nullable = false)
    private Double precio;

    /**
     * Descripción ampliada que detalla las características o ingredientes del producto.
     * Este campo es opcional y permite hasta 500 caracteres.
     */
    @Column(length = 500)
    private String descripcion;

    /**
     * Cantidad de unidades físicas disponibles en el inventario actual.
     * Este campo es obligatorio para el control de disponibilidad de venta.
     */
    @Column(nullable = false)
    private int stock;

    /**
     * Ruta, nombre de archivo o URL de la imagen fotográfica que representa visualmente al producto.
     */
    private String imagen;

    /**
     * Bandera lógica que determina si el producto es visible y está habilitado para
     * ser agregado a los pedidos por los usuarios finales.
     * Es obligatorio establecer su estado.
     */
    @Column(nullable = false)
    private Boolean disponible;

    /**
     * Categoría a la que pertenece este producto dentro del catálogo.
     * <p>
     * Define una relación de muchos a uno, enlazada físicamente en la base de datos
     * mediante la clave foránea {@code categoria_id}.
     */
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    /**
     * Verifica si el producto cuenta con el stock físico necesario para
     * cubrir la demanda solicitada por un nuevo pedido.
     *
     * @param cantidadRequerida Unidades solicitadas por el cliente.
     * @return {@code true} si el stock actual es mayor o igual a la demanda, {@code false} en caso contrario.
     */
    public boolean tieneStockSuficiente(int cantidadRequerida) {
        return this.stock >= cantidadRequerida;
    }

    /**
     * Descuenta la cantidad solicitada del stock actual del producto tras confirmar una venta.
     * <p>
     * Actúa como una barrera de seguridad del dominio. Si por algún motivo de concurrencia
     * se intenta restar más stock del disponible, aborta la operación para evitar inventarios negativos.
     *
     * @param cantidadUnidades Unidades a restar del inventario.
     * @throws IllegalArgumentException Si la cantidad a reducir supera el stock disponible.
     */
    public void reducirStock(int cantidadUnidades) {
        if (!tieneStockSuficiente(cantidadUnidades)) {
            throw new IllegalArgumentException("No hay stock suficiente para el producto: " + this.nombre);
        }
        this.stock -= cantidadUnidades;
    }
}