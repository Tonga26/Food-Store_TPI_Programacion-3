package com.utn.foodstore.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones (Controller Advice).
 * Centraliza la captura y el procesamiento de todas las excepciones lanzadas por los controladores REST.
 * Utiliza el patrón AOP para interceptar errores y convertirlos en respuestas HTTP estructuradas y consistentes,
 * mejorando la robustez y seguridad de la API.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Intercepta las excepciones de tipo ResourceNotFoundException (Error 404).
     *
     * @param ex La excepción capturada que indica qué recurso no se encontró en la base de datos.
     * @return Una respuesta HTTP 404 (Not Found) junto con el DTO ErrorResponse detallado.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Recurso no encontrado: {}", ex.getMessage());

        ErrorResponse respuesta = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    /**
     * Intercepta las excepciones de tipo BusinessException (Error 400).
     *
     * @param ex La excepción capturada por violaciones a las reglas del dominio o negocio.
     * @return Una respuesta HTTP 400 (Bad Request) con el motivo exacto del fallo.
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handlerBusinessException(BusinessException ex) {
        log.warn("Error de regla de negocio: {}", ex.getMessage());

        ErrorResponse respuesta = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    /**
     * Intercepta errores de validación de entrada cuando fallan las restricciones de Jakarta (@Valid).
     *
     * @param ex Excepción que contiene la lista completa de campos que no superaron la validación.
     * @return Una respuesta HTTP 400 (Bad Request) con un mapa detallado de los errores por campo.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> valores = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String nombre = error.getField();
            String mensaje = error.getDefaultMessage();
            valores.put(nombre, mensaje);
        });

        log.warn("Error de validación de datos de entrada: {}", valores);

        ValidationErrorResponse respuesta = ValidationErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Error de validación en los datos enviados")
                .timestamp(LocalDateTime.now())
                .errors(valores)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    /**
     * Intercepta problemas de estado inconsistente en la aplicación (Error 409).
     *
     * @param ex La excepción que alerta sobre una operación que no puede ejecutarse en el estado actual del sistema.
     * @return Una respuesta HTTP 409 (Conflict).
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateExcepcion(IllegalStateException ex) {
        log.error("Conflicto de estado detectado: {}", ex.getMessage());

        ErrorResponse respuesta = ErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
    }

    /**
     * Interceptor genérico de último recurso para atrapar cualquier excepción no controlada (Error 500).
     *
     * @param ex La excepción original de Java que provocó el fallo interno.
     * @return Una respuesta HTTP 500 (Internal Server Error) genérica, ocultando detalles sensibles del sistema.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        log.error("Error interno del servidor no controlado", ex);

        ErrorResponse respuesta = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Ocurrió un error interno en el servidor. Contacte al administrador.")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }
}