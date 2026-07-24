package com.utn.foodstore.controller;

import com.utn.foodstore.dto.PedidoCreate;
import com.utn.foodstore.dto.PedidoDto;
import com.utn.foodstore.dto.PedidoEdit;
import com.utn.foodstore.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de exponer la interfaz de comunicación para la gestión de Pedidos.
 * <p>
 * Implementa las operaciones del ciclo de vida transaccional del e-commerce (creación,
 * consulta, modificación parcial y baja lógica), garantizando el cumplimiento de los
 * principios de la arquitectura REST y delegando la lógica compleja a la capa de servicios.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    /**
     * Recupera el listado completo de las transacciones registradas en el sistema.
     *
     * @return Una colección de objetos {@link PedidoDto} junto con el estado HTTP 200 OK.
     */
    @GetMapping
    public ResponseEntity<List<PedidoDto>> findAll() {
        List<PedidoDto> pedidosEncontrados = pedidoService.findAll();
        return ResponseEntity.ok(pedidosEncontrados);
    }

    /**
     * Consulta una orden individual a partir de su identificador primario.
     *
     * @param id Identificador numérico único del pedido a consultar.
     * @return El DTO consolidado de la transacción junto con el estado HTTP 200 OK.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> findById(@PathVariable Long id) {
        PedidoDto pedidoEncontrado = pedidoService.findById(id);
        return ResponseEntity.ok(pedidoEncontrado);
    }

    /**
     * Retorna el historial histórico de órdenes asociadas a un cliente particular.
     *
     * @param usuarioId Identificador del cliente extraído de la variable de ruta.
     * @return Una lista de DTOs correspondientes a las compras del usuario (HTTP 200 OK).
     */
    @GetMapping("/user/{usuarioId}")
    public ResponseEntity<List<PedidoDto>> findByUsuarioId(@PathVariable Long usuarioId) {
        List<PedidoDto> pedidosEncontrados = pedidoService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(pedidosEncontrados);
    }

    /**
     * Recepciona e inicia el procesamiento de una nueva solicitud de compra.
     * <p>
     * Aplica validaciones de integridad de datos (Jakarta Validation) previas a la
     * delegación transaccional para asegurar la correcta deducción de inventario.
     *
     * @param dto Estructura de transferencia (Request Body) con los datos del carrito.
     * @return El ticket generado exitosamente con su ID definitivo y el estado HTTP 201 Created.
     */
    @PostMapping
    public ResponseEntity<PedidoDto> create(@Valid @RequestBody PedidoCreate dto) {
        PedidoDto pedidoCreado = pedidoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCreado);
    }

    /**
     * Modifica atributos operativos específicos de un pedido existente.
     * <p>
     * Diseñado para actualizaciones parciales (estado y/o forma de pago), ignorando
     * propiedades nulas y preservando la inmutabilidad de los ítems adquiridos.
     *
     * @param id  Identificador de la orden a actualizar.
     * @param dto Objeto con las propiedades opcionales a sobrescribir.
     * @return El recurso consolidado post-modificación con estado HTTP 200 OK.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PedidoDto> update(
            @PathVariable Long id,
            @Valid @RequestBody PedidoEdit dto) {
        PedidoDto pedidoActualizado = pedidoService.update(id, dto);
        return ResponseEntity.ok(pedidoActualizado);
    }

    /**
     * Remueve lógicamente una orden del flujo operativo del sistema.
     * <p>
     * La operation garantiza la preservación de los registros con fines de auditoría,
     * informando el éxito de la petición mediante un código de estado vacío.
     *
     * @param id Identificador de la orden sujeta a remoción.
     * @return Respuesta vacía confirmando la ejecución mediante el estado HTTP 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}