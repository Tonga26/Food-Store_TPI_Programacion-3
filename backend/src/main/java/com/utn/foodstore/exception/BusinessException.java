package com.utn.foodstore.exception;

/**
 * Excepción lanzada cuando se viola una regla de negocio o de dominio de la aplicación.
 * Extiende de RuntimeException para delegar su manejo al manejador global de excepciones,
 * el cual traducirá este evento en una respuesta HTTP 400 (Bad Request).
 */
public class BusinessException extends RuntimeException {

    /**
     * Construye una nueva instancia de la excepción con un mensaje explicativo.
     *
     * @param message El mensaje que detalla la regla de negocio que fue incumplida.
     */
    public BusinessException(String message) {
        super(message);
    }
}