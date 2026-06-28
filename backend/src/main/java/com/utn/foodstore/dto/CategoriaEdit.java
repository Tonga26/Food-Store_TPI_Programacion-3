package com.utn.foodstore.dto;

import com.utn.foodstore.model.Categoria;
import jakarta.validation.constraints.Size;

/**
 * Objeto de Transferencia de Datos (DTO) utilizado para gestionar la actualización
 * parcial de una categoría existente en el sistema.
 * <p>
 * Permite recibir únicamente los campos que el cliente desea modificar. Implementa
 * el patrón Mutator a través del método {@link #applyTo(Categoria)} para delegar
 * la responsabilidad de la inyección de datos a este mismo objeto.
 *
 * @param nombre      El nuevo nombre propuesto para la categoría.
 * @param descripcion La nueva descripción propuesta para la categoría.
 * @param imagen      La nueva ruta o identificador de imagen propuesto.
 */
public record CategoriaEdit(

        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres.")
        String nombre,

        @Size(max = 500, message = "La descripción no puede exceder de 500 caracteres.")
        String descripcion,

        String imagen
) {
    /**
     * Aplica de forma segura las modificaciones transportadas por este DTO a la
     * entidad original recuperada de la base de datos.
     * <p>
     * Evalúa cada campo; si el valor aportado por el cliente no es nulo,
     * sobrescribe el estado de la entidad. Esto previene la pérdida accidental
     * de datos preexistentes al realizar actualizaciones parciales (semántica PATCH/PUT).
     *
     * @param categoria La entidad viva y persistida cuyo estado interno será mutado.
     */
    public void applyTo(Categoria categoria) {
        if (this.nombre() != null && !this.nombre().isBlank()) categoria.setNombre(this.nombre());
        if (this.descripcion() != null) categoria.setDescripcion(this.descripcion());
        if (this.imagen() != null && !this.imagen().isBlank()) categoria.setImagen(this.imagen());
    }
}