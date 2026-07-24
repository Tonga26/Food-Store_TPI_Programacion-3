package com.utn.foodstore.controller;

import com.utn.foodstore.dto.ProductoCreate;
import com.utn.foodstore.dto.ProductoDto;
import com.utn.foodstore.dto.ProductoEdit;
import com.utn.foodstore.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de gestionar las operaciones relacionadas con los productos.
 * <p>
 * Actúa como el punto de entrada para las peticiones HTTP del cliente.
 * Delega la lógica de negocio a {@link ProductoService} y devuelve las respuestas
 * empaquetadas en objetos {@link ResponseEntity} para manejar correctamente
 * los códigos de estado HTTP y la conversión a formato JSON.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    /**
     * Recupera el catálogo completo de productos que se encuentran activos en el sistema.
     *
     * @return Un {@link ResponseEntity} con estado 200 (OK) y la lista de {@link ProductoDto}.
     */
    @GetMapping
    public ResponseEntity<List<ProductoDto>> findAll() {
        List<ProductoDto> productosEncontrados = productoService.findAll();
        return ResponseEntity.ok(productosEncontrados);
    }

    /**
     * Busca un producto específico mediante su identificador único.
     *
     * @param id El identificador único del producto a recuperar.
     * @return Un {@link ResponseEntity} con estado 200 (OK) y el {@link ProductoDto} correspondiente.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> findById(@PathVariable Long id) {
        ProductoDto productoEncontrado = productoService.findById(id);
        return ResponseEntity.ok(productoEncontrado);
    }

    /**
     * Recupera el listado de productos filtrados por una categoría específica.
     *
     * @param categoriaId El identificador de la categoría utilizada como filtro.
     * @return Un {@link ResponseEntity} con estado 200 (OK) y la colección de {@link ProductoDto} asociados.
     */
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoDto>> findByCategoriaId(@PathVariable Long categoriaId) {
        List<ProductoDto> productosEncontrados = productoService.findByCategoriaId(categoriaId);
        return ResponseEntity.ok(productosEncontrados);
    }

    /**
     * Procesa el registro de un nuevo producto en el catálogo del sistema.
     * <p>
     * Valida de forma estricta la estructura y restricciones del payload antes de
     * delegar la persistencia del recurso.
     *
     * @param dto El objeto {@link ProductoCreate} con los datos de entrada validados.
     * @return Un {@link ResponseEntity} con estado 201 (CREATED) y el {@link ProductoDto} persistido.
     */
    @PostMapping
    public ResponseEntity<ProductoDto> create(@Valid @RequestBody ProductoCreate dto) {
        ProductoDto productoCreado = productoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoCreado);
    }

    /**
     * Aplica modificaciones parciales sobre un producto existente identificado por su ID.
     *
     * @param id  El identificador del producto que se desea modificar.
     * @param dto El objeto {@link ProductoEdit} con los campos propuestos para la actualización.
     * @return Un {@link ResponseEntity} con estado 200 (OK) y el {@link ProductoDto} actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductoEdit dto) {
        ProductoDto productoActualizado = productoService.update(id, dto);
        return ResponseEntity.ok(productoActualizado);
    }

    /**
     * Realiza la baja lógica (Soft Delete) de un producto del catálogo del sistema.
     *
     * @param id El identificador del producto que se desea desactivar.
     * @return Un {@link ResponseEntity} con estado 204 (NO CONTENT).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}