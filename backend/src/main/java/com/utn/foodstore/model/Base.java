package com.utn.foodstore.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Clase base abstracta que proporciona atributos comunes de persistencia y auditoría
 * para todas las entidades del dominio.
 * <p>
 * Al utilizar {@link MappedSuperclass}, esta clase no genera una tabla propia en la
 * base de datos, sino que sus atributos son heredados y mapeados directamente como
 * columnas en las tablas de las entidades hijas. Centraliza la gestión de la clave
 * primaria, el borrado lógico (Soft Delete), los metadatos de auditoría y el
 * control de concurrencia optimista.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@SuperBuilder
@MappedSuperclass
public abstract class Base {

    /**
     * Identificador único de la entidad (Clave Primaria).
     * Su valor es autogenerado por el motor de la base de datos
     * utilizando la estrategia de incremento de identidad (IDENTITY).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Bandera lógica que determina si el registro está activo o eliminado (Soft Delete).
     * {@code false} indica que el registro está activo.
     * {@code true} indica que el registro fue eliminado lógicamente y debe ser
     * excluido de las consultas estándar del sistema.
     */
    @Builder.Default
    private boolean eliminado = false;

    /**
     * Fecha y hora exacta (timestamp) en la que la entidad fue persistida
     * por primera vez en la base de datos.
     * Gestionado automáticamente por el ORM Hibernate.
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * Fecha y hora exacta en la que el registro sufrió su última modificación.
     * Gestionado automáticamente por el ORM Hibernate al ejecutar operaciones UPDATE.
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Campo de control de concurrencia mediante el patrón Optimistic Locking.
     * <p>
     * El motor de persistencia utiliza este atributo numérico para prevenir la pérdida
     * de actualizaciones (lost updates) cuando múltiples transacciones intentan modificar
     * el mismo registro simultáneamente.
     */
    @Version
    private Integer version;

}