package com.utn.foodstore.exception;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Representa el formato de respuesta de error especializado para validaciones de entrada.
 * Proporciona, además de los datos estándar de error, un mapa detallado con los
 * atributos específicos del modelo que no cumplieron con las restricciones de validación.
 */
@Builder
public record ValidationErrorResponse(
        int status,
        String message,
        LocalDateTime timestamp,
        Map<String, String> errors
) {
}