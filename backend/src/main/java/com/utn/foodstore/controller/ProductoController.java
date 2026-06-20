package com.utn.foodstore.controller;

import com.utn.foodstore.dto.ProductoCreate;
import com.utn.foodstore.dto.ProductoDto;
import com.utn.foodstore.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de gestionar las operaciones del catálogo de productos.
 * <p>
 * Actúa como punto de entrada para las peticiones HTTP relacionadas con la entidad Producto,
 * delegando las reglas de negocio y transacciones a {@link ProductoService}.
 */
@RestController
@RequestMapping("/producto")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    /**
     * Maneja la petición GET para recuperar el listado de todos los productos activos.
     *
     * @return Un {@link ResponseEntity} con estado 200 (OK) y la lista de {@link ProductoDto}.
     */
    @GetMapping
    public ResponseEntity<List<ProductoDto>> findAll() {
        List<ProductoDto> productosEncontrados = productoService.findAll();
        return ResponseEntity.ok(productosEncontrados);
    }

    /**
     * Maneja la petición POST para registrar un nuevo producto en el catálogo.
     * Valida la estructura del payload antes de procesar la creación.
     *
     * @param dto Datos de entrada validados provenientes del cuerpo de la petición.
     * @return Un {@link ResponseEntity} con estado 201 (CREATED) y el producto persistido.
     */
    @PostMapping
    public ResponseEntity<ProductoDto> create(@Valid @RequestBody ProductoCreate dto) {
        ProductoDto productoCreado = productoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoCreado);
    }
}