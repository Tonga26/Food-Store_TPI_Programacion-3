package com.utn.foodstore.service;

import com.utn.foodstore.dto.*;
import com.utn.foodstore.enums.Estado;
import com.utn.foodstore.exception.BusinessException;
import com.utn.foodstore.model.DetallePedido;
import com.utn.foodstore.model.Pedido;
import com.utn.foodstore.model.Producto;
import com.utn.foodstore.model.Usuario;
import com.utn.foodstore.repository.PedidoRepository;
import com.utn.foodstore.repository.ProductoRepository;
import com.utn.foodstore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Servicio encargado de gestionar la lógica de negocio central de las ventas (Pedidos).
 * <p>
 * Orquesta la interacción entre Usuarios, Productos y la creación de transacciones.
 * Implementa el manejo de transaccionalidad para asegurar la consistencia de los datos
 * (ej. si falla la creación de un detalle, no se descuenta el stock ni se guarda el pedido).
 */
@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    /**
     * Recupera la totalidad de los pedidos registrados en el sistema.
     *
     * @return Una colección de tipo {@link List} que contiene los DTOs de representación de todos los pedidos.
     */
    @Transactional(readOnly = true)
    public List<PedidoDto> findAll() {
        List<Pedido> pedidosEncontrados = pedidoRepository.findAll();
        return pedidosEncontrados.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Recupera un pedido específico mediante su identificador único.
     *
     * @param id Identificador numérico del pedido buscado.
     * @return El DTO de representación del pedido asociado al identificador provisto.
     */
    @Transactional(readOnly = true)
    public PedidoDto findById(Long id) {
        Pedido pedidoEncontrado = pedidoRepository.findByIdOrThrow(id);
        return mapToDto(pedidoEncontrado);
    }

    /**
     * Recupera el historial transaccional de pedidos asociados a un cliente específico.
     *
     * @param usuarioId Identificador único del usuario del cual se desea consultar el historial.
     * @return Una lista de objetos {@link PedidoDto} vinculados al usuario, excluyendo registros eliminados.
     */
    @Transactional(readOnly = true)
    public List<PedidoDto> findByUsuarioId(Long usuarioId) {
        usuarioRepository.findByIdOrThrow(usuarioId);
        List<Pedido> pedidosEncontrados = pedidoRepository.findAllByUsuarioIdAndEliminadoFalse(usuarioId);

        return pedidosEncontrados.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Orquesta la creación de un nuevo pedido en el sistema, validando la integridad del negocio.
     * <p>
     * Modifica de manera atómica el inventario físico de los productos involucrados en la transacción.
     * Si el volumen solicitado supera las existencias o el producto no está habilitado, revierte
     * los cambios en el contexto de persistencia.
     *
     * @param dto El objeto de transferencia de datos con la solicitud del cliente.
     * @return El DTO de salida unificado con identificadores y subtotales calculados en el dominio.
     * @throws BusinessException Si algún producto solicitado no se encuentra marcado como disponible.
     */
    @Transactional
    public PedidoDto create(PedidoCreate dto) {
        Usuario usuarioEncontrado = usuarioRepository.findByIdOrThrow(dto.usuarioId());

        Pedido nuevoPedido = Pedido.builder()
                .fecha(LocalDate.now())
                .estado(Estado.PENDIENTE)
                .formaPago(dto.formaPago())
                .direccion(dto.direccion())
                .telefono(dto.telefono())
                .notas(dto.notas())
                .usuario(usuarioEncontrado)
                .build();

        for (DetallePedidoCreate detalleDto : dto.detalles()) {
            Producto productoEncontrado = productoRepository.findByIdOrThrow(detalleDto.productoId());

            if (!productoEncontrado.getDisponible()) {
                throw new BusinessException("Producto no disponible para la venta: " + productoEncontrado.getNombre());
            }

            productoEncontrado.reducirStock(detalleDto.cantidad());
            nuevoPedido.addDetallePedido(detalleDto.cantidad(), productoEncontrado);
        }

        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);
        return mapToDto(pedidoGuardado);
    }

    /**
     * Aplica modificaciones operativas parciales sobre el estado o el método de pago de una orden.
     * <p>
     * El procesamiento delega la mutación de los campos al DTO de edición mediante el patrón mutator,
     * previniendo sobreescrituras accidentales en el contexto persistence.
     *
     * @param id  Identificador único del pedido a modificar.
     * @param dto Estructura con las propiedades opcionales sujetas a cambios.
     * @return El DTO de representación del estado consolidado post-modificación.
     */
    @Transactional
    public PedidoDto update(Long id, PedidoEdit dto) {
        Pedido pedidoEncontrado = pedidoRepository.findByIdOrThrow(id);

        dto.applyTo(pedidoEncontrado);

        Pedido pedidoActualizado = pedidoRepository.save(pedidoEncontrado);

        return mapToDto(pedidoActualizado);
    }

    /**
     * Ejecuta la baja lógica de un pedido dentro del sistema.
     * <p>
     * Delega la operación al repositorio base, el cual ejecuta una sentencia
     * de actualización atómica (UPDATE) sobre el flag de eliminación, excluyendo
     * el registro de las consultas operativas ordinarias sin alterar el inventario.
     *
     * @param id Identificador único del pedido sujeto a remoción.
     */
    @Transactional
    public void delete(Long id) {
        pedidoRepository.deleteById(id);
    }

    /**
     * Desacopla la entidad transaccional {@link Pedido} mapeando sus propiedades hacia un DTO inmutable.
     */
    private PedidoDto mapToDto(Pedido pedido) {
        return PedidoDto.builder()
                .id(pedido.getId())
                .fecha(pedido.getFecha())
                .estado(pedido.getEstado())
                .formaPago(pedido.getFormaPago())
                .total(pedido.getTotal())
                .direccion(pedido.getDireccion())
                .telefono(pedido.getTelefono())
                .notas(pedido.getNotas())
                .usuario(
                        UsuarioDto.builder()
                                .id(pedido.getUsuario().getId())
                                .nombre(pedido.getUsuario().getNombre())
                                .apellido(pedido.getUsuario().getApellido())
                                .email(pedido.getUsuario().getEmail())
                                .celular(pedido.getUsuario().getCelular())
                                .rol(pedido.getUsuario().getRol())
                                .build()
                )
                .detalles(pedido.getDetallesPedido().stream()
                        .map(this::mapDetalleToDto)
                        .toList()
                )
                .build();
    }

    /**
     * Desacopla la entidad composicional {@link DetallePedido} mapeando sus propiedades hacia un DTO anidado.
     */
    private DetallePedidoDto mapDetalleToDto(DetallePedido detalle) {
        return DetallePedidoDto.builder()
                .id(detalle.getId())
                .cantidad(detalle.getCantidad())
                .subtotal(detalle.getSubtotal())
                .producto(
                        ProductoDto.builder()
                                .id(detalle.getProducto().getId())
                                .nombre(detalle.getProducto().getNombre())
                                .precio(detalle.getProducto().getPrecio())
                                .build()
                )
                .build();
    }
}