package com.utn.foodstore.entities;

import com.utn.foodstore.enums.Estado;
import com.utn.foodstore.enums.FormaPago;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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

    @Column(nullable = false)
    private LocalDate fecha;

    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Estado estado;

    @EqualsAndHashCode.Include
    @Column(nullable = false)
    @Builder.Default
    private Double total = 0.0;

    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pago", nullable = false, length = 30)
    private FormaPago formaPago;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    @Builder.Default
    private Set<DetallePedido> detallesPedido = new HashSet<>();

    @Override
    public void calcularTotal() {
        this.total = detallesPedido.stream()
                .map(DetallePedido::getSubtotal)
                .reduce(0.0, Double::sum);
    }

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

    // Método para buscar detalles por producto
    public DetallePedido findDetallePedidoByProducto (Producto producto) {

        return this.detallesPedido
                .stream()
                .filter(detalle -> detalle.getProducto().equals(producto))
                .findFirst()
                .orElse(null);
    }

    // Método para eliminar detalles por producto
    public void deleteDetallePedidoByProducto (Producto producto) {

        DetallePedido detalleAEliminar = findDetallePedidoByProducto(producto);

        if (detalleAEliminar != null){
            this.detallesPedido.remove(detalleAEliminar);
        }

        calcularTotal();
    }
}

