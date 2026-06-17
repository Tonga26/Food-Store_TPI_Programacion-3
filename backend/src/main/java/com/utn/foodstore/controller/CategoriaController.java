package com.utn.foodstore.controller;

import com.utn.foodstore.dto.CategoriaCreate;
import com.utn.foodstore.dto.CategoriaDto;
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
 * Actúa como el punto de entrada (Capa de Presentación) para las peticiones HTTP del cliente.
 * Delega la lógica de negocio a {@link CategoriaService} y devuelve las respuestas
 * empaquetadas en objetos {@link ResponseEntity} para manejar correctamente
 * los códigos de estado HTTP y la conversión a formato JSON.
 */
@RestController
@RequestMapping("/categoria")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    /**
     * Maneja la petición GET para recuperar el listado de todas las categorías activas.
     *
     * @return Un {@link ResponseEntity} con estado 200 (OK) que contiene una lista de {@link CategoriaDto}.
     */
    @GetMapping
    public ResponseEntity<List<CategoriaDto>> findAll() {
        List<CategoriaDto> categoriasEncontradas = categoriaService.findAll();
        return ResponseEntity.ok(categoriasEncontradas);
    }

    /**
     * Maneja la petición POST para registrar una nueva categoría en el sistema.
     * <p>
     * Valida automáticamente los datos de entrada según las restricciones definidas en el DTO
     * antes de procesar la solicitud.
     *
     * @param dto Objeto {@link CategoriaCreate} mapeado desde el cuerpo de la petición (JSON).
     * @return Un {@link ResponseEntity} con estado 201 (CREATED) y el {@link CategoriaDto} persistido.
     */
    @PostMapping
    public ResponseEntity<CategoriaDto> create(@Valid @RequestBody CategoriaCreate dto) {
        CategoriaDto categoriaCreada = categoriaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaCreada);
    }
}