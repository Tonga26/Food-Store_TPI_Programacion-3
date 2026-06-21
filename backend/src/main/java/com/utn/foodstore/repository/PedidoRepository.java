package com.utn.foodstore.repository;

import com.utn.foodstore.model.Pedido;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de persistencia para la entidad {@link Pedido}.
 * <p>
 * Al extender de {@link BaseRepository}, hereda de forma automática todas las
 * operaciones CRUD estándar, el manejo unificado de excepciones por identificador
 * y los mecanismos automatizados de baja lógica (Soft Delete) definidos para el sistema.
 */
@Repository
public interface PedidoRepository extends BaseRepository<Pedido, Long> {
}