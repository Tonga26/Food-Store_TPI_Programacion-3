package com.utn.foodstore.model;

import com.utn.foodstore.enums.Estado;
import com.utn.foodstore.enums.FormaPago;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa un pedido o transacción de compra realizada en el sistema.
 * <p>
 * Mapea la tabla {@code pedidos} en la base de datos y extiende de {@link Base} para
 * heredar propiedades de auditoría. Implementa la interfaz {@link Calculable} para
 * gestionar dinámicamente la sumatoria de sus montos.
 * Mantiene una relación de composición estricta (One-to-Many con eliminación de huérfanos)
 * con la entidad {@link DetallePedido}.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder
@Entity
@Table(name = "pedidos")
public class Pedido extends Base implements Calculable {

    /**
     * Fecha exacta en la que se generó el pedido.
     * Este campo es obligatorio para el registro histórico y la facturación.
     */
    @Column(nullable = false)
    private LocalDate fecha;

    /**
     * Estado actual del pedido dentro del flujo de negocio (ej. PENDIENTE, PREPARACION, ENTREGADO).
     * Se persiste como una cadena de texto (STRING) y se utiliza para calcular
     * la igualdad del objeto.
     */
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Estado estado;

    /**
     * Monto total acumulado a abonar por este pedido.
     * Su valor por defecto es 0.0 y se actualiza dinámicamente al agregar o quitar detalles.
     */
    @EqualsAndHashCode.Include
    @Column(nullable = false)
    @Builder.Default
    private Double total = 0.0;

    /**
     * Medio seleccionado por el cliente para abonar el pedido (ej. EFECTIVO, TRANSFERENCIA).
     * Se persiste como cadena de texto y forma parte de la identidad del objeto.
     */
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pago", nullable = false, length = 30)
    private FormaPago formaPago;

    /**
     * Colección de líneas o detalles que componen el pedido.
     * <p>
     * Emplea una estrategia de persistencia en cascada total (ALL) y eliminación de huérfanos
     * (orphanRemoval = true). Si un detalle se desvincula de esta colección,
     * será eliminado físicamente de la base de datos.
     */
    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    @Builder.Default
    private Set<DetallePedido> detallesPedido = new HashSet<>();

    /**
     * Calcula y actualiza el atributo {@code total} del pedido iterando sobre su colección
     * de detalles y sumando los subtotales individuales.
     * Utiliza la API de Streams para procesar la reducción funcionalmente.
     */
    @Override
    public void calcularTotal() {
        this.total = detallesPedido.stream()
                .map(DetallePedido::getSubtotal)
                .reduce(0.0, Double::sum);
    }

    /**
     * Construye y asocia un nuevo detalle al pedido, vinculándolo con un producto
     * y su respectiva cantidad.
     * Tras la inserción exitosa en la colección, invoca automáticamente a {@link #calcularTotal()}
     * para mantener la consistencia del monto final.
     *
     * @param cantidad Unidades del producto a adquirir.
     * @param producto Entidad {@link Producto} que se agregará al pedido.
     */
    // Método para agregar detalles (Composición)
    public void addDetallePedido (int cantidad, Producto producto){

        DetallePedido nuevoDetalle = DetallePedido.builder()
                .cantidad(cantidad)
                .producto(producto)
                .subtotal(cantidad * producto.getPrecio())
                .build();

        this.detallesPedido.add(nuevoDetalle);

        calcularTotal();
    }

    /**
     * Busca en la colección interna de detalles aquel que contenga un producto específico.
     *
     * @param producto El objeto {@link Producto} a buscar dentro de los detalles.
     * @return El {@link DetallePedido} correspondiente si existe, o {@code null} en caso contrario.
     */
    // Método para buscar detalles por producto
    public DetallePedido findDetallePedidoByProducto (Producto producto) {

        return this.detallesPedido
                .stream()
                .filter(detalle -> detalle.getProducto().equals(producto))
                .findFirst()
                .orElse(null);
    }

    /**
     * Busca y remueve de la colección interna el detalle asociado a un producto específico.
     * Tras una eliminación exitosa, invoca automáticamente a {@link #calcularTotal()}
     * para descontar el subtotal correspondiente del monto final.
     *
     * @param producto El objeto {@link Producto} cuyo detalle asociado se desea eliminar.
     */
    // Método para eliminar detalles por producto
    public void deleteDetallePedidoByProducto (Producto producto) {

        DetallePedido detalleAEliminar = findDetallePedidoByProducto(producto);

        if (detalleAEliminar != null){
            this.detallesPedido.remove(detalleAEliminar);
        }

        calcularTotal();
    }
}