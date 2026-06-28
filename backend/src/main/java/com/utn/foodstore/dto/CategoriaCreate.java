package com.utn.foodstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Objeto de Transferencia de Datos (DTO) diseñado para encapsular la carga útil
 * (payload) enviada por el cliente durante la creación de una nueva categoría.
 * <p>
 * Este registro garantiza que los datos ingresen al sistema validados desde la capa
 * de presentación (Controlador) antes de alcanzar la lógica de negocio, centralizando
 * los mensajes de error de la API.
 *
 * @param nombre      El nombre comercial de la categoría. Es de carácter obligatorio y
 * debe contener entre 2 y 100 caracteres.
 * @param descripcion Detalles adicionales sobre el tipo de productos que agrupa la categoría.
 * Es opcional, pero no puede exceder los 500 caracteres.
 * @param imagen      Ruta o nombre de archivo de la imagen. Es de carácter obligatorio.
 */
public record CategoriaCreate(

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres.")
        String nombre,

        @Size(max = 500, message = "La descripción no puede exceder de 500 caracteres.")
        String descripcion,

        @NotBlank(message = "La imagen es obligatoria.")
        String imagen
) {}