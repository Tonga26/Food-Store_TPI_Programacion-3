package com.utn.foodstore.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa una categoría de productos dentro del sistema.
 * <p>
 * Mapea la tabla {@code categorias} en la base de datos y extiende de {@link Base}
 * para heredar las propiedades comunes de persistencia y auditoría (como ID, borrado lógico y fecha de creación).
 * Gestiona una relación bidireccional de uno a muchos con la entidad {@link Producto}.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = "productos")
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder
@Entity
@Table(name = "categorias")
public class Categoria extends Base {

    /**
     * Nombre descriptivo de la categoría.
     * Este campo es obligatorio, debe ser único en la base de datos y tiene un límite máximo de 50 caracteres.
     * Se utiliza como la propiedad principal para calcular la igualdad (equals y hashCode) del objeto.
     */
    @EqualsAndHashCode.Include
    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    /**
     * Descripción detallada u opcional sobre el tipo de productos que engloba esta categoría.
     */
    private String descripcion;

    /**
     * Colección de productos asociados a la categoría.
     * <p>
     * La relación es gestionada por el atributo {@code categoria} en la entidad {@link Producto}.
     * Emplea una estrategia de carga diferida (LAZY) para optimizar el rendimiento de las consultas,
     * y propaga en cascada las operaciones de guardado, actualización y refresco hacia los productos asociados.
     */
    @OneToMany(
            mappedBy = "categoria",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
            fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Producto> productos = new HashSet<>();

    /**
     * Método auxiliar (helper) para mantener la consistencia del modelo bidireccional en memoria
     * al asociar un nuevo producto a esta categoría.
     *
     * @param producto El objeto {@link Producto} que se desea agregar a la colección.
     */
    public void addProducto(Producto producto){
        this.productos.add(producto);
        producto.setCategoria(this);
    }

    /**
     * Método auxiliar (helper) para mantener la consistencia del modelo bidireccional en memoria
     * al desvincular un producto existente de esta categoría.
     *
     * @param producto El objeto {@link Producto} que se desea remover de la colección.
     */
    public void removeProducto(Producto producto){
        this.productos.remove(producto);
        producto.setCategoria(null);
    }
}