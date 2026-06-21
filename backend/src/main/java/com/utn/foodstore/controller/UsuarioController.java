package com.utn.foodstore.controller;

import com.utn.foodstore.dto.UsuarioCreate;
import com.utn.foodstore.dto.UsuarioDto;
import com.utn.foodstore.dto.UsuarioEdit;
import com.utn.foodstore.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de exponer los endpoints (API) para la gestión de usuarios.
 * <p>
 * Intercepta las peticiones HTTP del cliente (Frontend, Postman), delega el procesamiento
 * de las reglas de negocio al {@link UsuarioService} y retorna las respuestas en formato JSON
 * encapsuladas en objetos {@link ResponseEntity} con sus respectivos códigos de estado.
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * Endpoint para obtener el listado de todos los usuarios activos.
     *
     * @return Una respuesta HTTP 200 (OK) con la lista de usuarios en el cuerpo.
     */
    @GetMapping
    public ResponseEntity<List<UsuarioDto>> findAll() {
        List<UsuarioDto> usuariosEncontrados = usuarioService.findAll();
        return ResponseEntity.ok(usuariosEncontrados);
    }

    /**
     * Endpoint para obtener los detalles de un usuario específico por su ID.
     *
     * @param id Identificador único del usuario, extraído de la URL.
     * @return Una respuesta HTTP 200 (OK) con el DTO del usuario encontrado.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> findById(@PathVariable Long id) {
        UsuarioDto usuarioEncontrado = usuarioService.findById(id);
        return ResponseEntity.ok(usuarioEncontrado);
    }

    /**
     * Endpoint para registrar un nuevo usuario en el sistema.
     *
     * @param dto El paquete de datos JSON que envía el cliente, ya validado.
     * @return Una respuesta HTTP 201 (CREATED) con el DTO del usuario recién creado.
     */
    @PostMapping
    public ResponseEntity<UsuarioDto> create(@Valid @RequestBody UsuarioCreate dto) {
        UsuarioDto nuevoUsuario = usuarioService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    /**
     * Endpoint para modificar parcialmente un usuario existente.
     *
     * @param id  Identificador único del usuario a modificar, extraído de la URL.
     * @param dto El paquete de datos JSON con las modificaciones, ya validado.
     * @return Una respuesta HTTP 200 (OK) con el DTO del usuario actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> update(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioEdit dto) {
        UsuarioDto usuarioActualizado = usuarioService.update(id, dto);
        return ResponseEntity.ok(usuarioActualizado);
    }

    /**
     * Endpoint para realizar la baja lógica (Soft Delete) de un usuario.
     *
     * @param id Identificador único del usuario a eliminar, extraído de la URL.
     * @return Una respuesta HTTP 204 (NO CONTENT) indicando éxito sin cuerpo de respuesta.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
