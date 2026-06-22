package com.utn.foodstore.exception;

import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Representa el formato estándar de respuesta de error para la API REST.
 * Encapsula los detalles fundamentales de una excepción capturada globalmente
 * para proporcionar un contrato consistente al cliente en las respuestas HTTP fallidas.
 */
@Builder
public record ErrorResponse(
        int status,
        String message,
        LocalDateTime timestamp
) {
}