package com.utn.foodstore.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Clase base abstracta que proporciona atributos comunes de persistencia y auditoría
 * para todas las entidades del dominio.
 * <p>
 * Al utilizar {@link MappedSuperclass}, esta clase no genera una tabla propia en la
 * base de datos, sino que sus atributos son heredados y mapeados directamente como
 * columnas en las tablas de las entidades hijas. Centraliza la gestión de la clave
 * primaria, el borrado lógico (Soft Delete) y los metadatos de creación.
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
    private boolean eliminado;

    /**
     * Fecha y hora exacta (timestamp) en la que la entidad fue persistida
     * por primera vez en la base de datos.
     * Utilizado para propósitos de auditoría y trazabilidad.
     */
    private LocalDateTime createdAt;
}