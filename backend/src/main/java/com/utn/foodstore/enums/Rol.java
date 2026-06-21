package com.utn.foodstore.enums;

/**
 * Enumeración que define los niveles de autorización y acceso dentro del sistema.
 * <p>
 * Se asocia a la entidad Usuario y será la pieza fundamental cuando se implemente
 * la capa de seguridad (Spring Security / JWT) para determinar qué endpoints
 * o recursos puede consumir cada persona.
 */
public enum Rol {

    /**
     * Nivel de acceso máximo. Permite gestionar todo el sistema:
     * crear productos, modificar categorías, ver todos los pedidos globales,
     * cambiar estados de órdenes y realizar bajas lógicas.
     */
    ADMIN,

    /**
     * Nivel de acceso estándar para los clientes de la tienda.
     * Está restringido a operaciones personales: ver productos disponibles,
     * crear sus propios pedidos y consultar únicamente su historial de compras.
     */
    USUARIO
}