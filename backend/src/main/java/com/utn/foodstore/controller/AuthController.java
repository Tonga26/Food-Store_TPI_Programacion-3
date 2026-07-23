package com.utn.foodstore.controller;

import com.utn.foodstore.dto.LoginDto;
import com.utn.foodstore.dto.UsuarioCreate;
import com.utn.foodstore.dto.UsuarioDto;
import com.utn.foodstore.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST encargado exclusivamente de la gestión de identidad y accesos.
 * <p>
 * Agrupa los endpoints públicos de la aplicación (Registro y Login).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UsuarioService usuarioService;

    /**
     * Endpoint público para autenticar un usuario en el sistema.
     *
     * @param dto El paquete de datos JSON con las credenciales de acceso.
     * @return El DTO del usuario autenticado.
     */
    @PostMapping("/login")
    public ResponseEntity<UsuarioDto> login(@Valid @RequestBody LoginDto dto) {
        UsuarioDto usuarioLogueado = usuarioService.login(dto);
        return ResponseEntity.ok(usuarioLogueado);
    }

    /**
     * Endpoint público para registrar un nuevo cliente en el sistema.
     *
     * @param dto El paquete de datos JSON que envía el cliente.
     * @return El DTO del usuario recién creado.
     */
    @PostMapping("/register")
    public ResponseEntity<UsuarioDto> register(@Valid @RequestBody UsuarioCreate dto) {
        UsuarioDto nuevoUsuario = usuarioService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }
}