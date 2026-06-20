package com.utn.foodstore.dto;

import com.utn.foodstore.model.Categoria;
import jakarta.validation.constraints.Size;

/**
 * ============================================================================
 * RECORD: CategoriaEdit
 * ============================================================================
 * DTO utilizado para recibir actualizaciones parciales de una categoría existente.
 */
public record CategoriaEdit(

        @Size(min = 2, max = 100)
        String nombre,

        @Size(max = 500)
        String descripcion
) {
    public void appyTo(Categoria categoria){
        if (this.nombre() != null) categoria.setNombre(this.nombre());
        if (this.descripcion() != null) categoria.setDescripcion(this.descripcion());
    }
}
