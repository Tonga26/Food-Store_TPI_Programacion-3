package com.utn.foodstore.exception;

/**
 * Excepción lanzada cuando no se encuentra un recurso solicitado en el sistema.
 * Extiende de RuntimeException para delegar su manejo al manejador global de excepciones,
 * el cual traducirá este evento en una respuesta HTTP 404 (Not Found).
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Construye una nueva instancia de la excepción con un mensaje detallado.
     *
     * @param message El mensaje descriptivo que indica qué recurso específico no fue hallado.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}