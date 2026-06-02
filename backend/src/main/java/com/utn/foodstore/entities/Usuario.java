package com.utn.foodstore.entities;

import com.utn.foodstore.enums.Rol;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = {"celular", "contrasena", "pedidos"})
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder
@Entity
@Table(name = "usuarios")
public class Usuario extends Base {

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String apellido;

    @EqualsAndHashCode.Include
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String celular;

    @Column(nullable = false)
    private String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @OneToMany(
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
            fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @Builder.Default
    private Set<Pedido> pedidos = new HashSet<>();

    // Métodos helper para sincronizar entidades (en caso de crear bidireccionalidad)
    public void addPedido(Pedido pedido){
        if (pedido != null){
            this.pedidos.add(pedido);
        }
    }

    public void removePedido(Pedido pedido){
        if (pedido != null){
            this.pedidos.remove(pedido);
        }
    }
}
