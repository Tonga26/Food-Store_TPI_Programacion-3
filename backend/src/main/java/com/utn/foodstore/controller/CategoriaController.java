package com.utn.foodstore.controller;

import com.utn.foodstore.dto.CategoriaCreate;
import com.utn.foodstore.dto.CategoriaDto;
import com.utn.foodstore.dto.CategoriaEdit;
import com.utn.foodstore.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de gestionar las operaciones relacionadas con las categorías.
 * <p>
 * Actúa como el punto de entrada para las peticiones HTTP del cliente.
 * Delega la lógica de negocio a {@link CategoriaService} y devuelve las respuestas
 * empaquetadas en objetos {@link ResponseEntity} para manejar correctamente
 * los códigos de estado HTTP y la conversión a formato JSON.
 */
@RestController
@RequestMapping("/api/v1/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    /**
     * Recupera el listado de todas las categorías activas.
     *
     * @return Respuesta HTTP 200 (OK) con la lista de {@link CategoriaDto}.
     */
    @GetMapping
    public ResponseEntity<List<CategoriaDto>> findAll() {
        List<CategoriaDto> categoriasEncontradas = categoriaService.findAll();
        return ResponseEntity.ok(categoriasEncontradas);
    }

    /**
     * Recupera una categoría específica mediante su identificador único.
     *
     * @param id Identificador único de la categoría.
     * @return Respuesta HTTP 200 (OK) con el DTO de la categoría solicitada.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> findById(@PathVariable Long id) {
        CategoriaDto categoriaEncontrada = categoriaService.findById(id);
        return ResponseEntity.ok(categoriaEncontrada);
    }

    /**
     * Registra una nueva categoría en el sistema.
     *
     * @param dto Objeto {@link CategoriaCreate} mapeado desde el cuerpo de la petición.
     * @return Respuesta HTTP 201 (CREATED) con la categoría persistida.
     */
    @PostMapping
    public ResponseEntity<CategoriaDto> create(@Valid @RequestBody CategoriaCreate dto) {
        CategoriaDto categoriaCreada = categoriaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaCreada);
    }

    /**
     * Actualiza parcialmente los datos de una categoría existente.
     *
     * @param id  Identificador único de la categoría a actualizar.
     * @param dto Objeto con los datos a modificar.
     * @return Respuesta HTTP 200 (OK) con la categoría actualizada.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaEdit dto) {
        CategoriaDto categoriaActualizada = categoriaService.update(id, dto);
        return ResponseEntity.ok(categoriaActualizada);
    }

    /**
     * Realiza la baja lógica (Soft Delete) de una categoría en el sistema.
     *
     * @param id Identificador único de la categoría a desactivar.
     * @return Respuesta HTTP 204 (No Content) indicando éxito en la operación.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}