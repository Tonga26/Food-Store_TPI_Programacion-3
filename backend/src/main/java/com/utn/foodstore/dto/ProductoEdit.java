package com.utn.foodstore.dto;

import com.utn.foodstore.model.Producto;
import jakarta.validation.constraints.*;

/**
 * Objeto de Transferencia de Datos (DTO) utilizado para encapsular la información
 * enviada por el cliente al momento de modificar un producto existente.
 * <p>
 * Emplea validaciones de Jakarta Validation para asegurar que los datos obligatorios
 * mantengan la consistencia y las reglas de negocio antes de aplicar la actualización
 * en la base de datos.
 * <p>
 * Permite recibir únicamente los campos que el cliente desea modificar. Implementa
 * el patrón Mutator a través del método {@link #applyTo(Producto)} para delegar
 * la responsabilidad de la inyección de datos a este mismo objeto.
 *
 * @param nombre      El nuevo nombre comercial propuesto para el producto.
 * @param precio      El nuevo valor monetario unitario de venta.
 * @param descripcion La nueva descripción ampliada de las características del producto.
 * @param stock       La nueva cantidad de unidades disponibles en el inventario físico.
 * @param imagen      La nueva ruta o URL de la representación visual del producto.
 * @param disponible  El nuevo estado que determina si el producto está habilitado para la venta.
 * @param categoriaId El identificador de la nueva categoría a la que se asociará el producto.
 */
public record ProductoEdit(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        String nombre,

        @NotNull
        @Positive(message = "El precio debe ser mayor a cero.")
        Double precio,

        @Size(max = 500, message = "La descripción no puede superar los 500 caracteres.")
        String descripcion,

        @NotNull(message = "El stock es obligatorio.")
        @PositiveOrZero(message = "El stock no puede tener valores negativos.")
        Integer stock,

        @Size(max = 500)
        String imagen,

        @NotNull(message = "Debe especificar si el producto está disponible.")
        Boolean disponible,

        @NotNull
        @Positive(message = "Debe seleccionar una categoría válida.")
        Long categoriaId
) {
    /**
     * Aplica los valores transportados por este DTO a una entidad persistida existente.
     * Evalúa uno a uno los campos; si el DTO contiene un valor no nulo, sobreescribe
     * el estado de la entidad original.
     * <p>
     * Nota Arquitectónica: La actualización de la relación con la entidad Categoria
     * se excluye intencionalmente de este método y debe ser orquestada exclusivamente
     * en la capa de Servicio.
     *
     * @param producto La entidad de dominio recuperada de la base de datos que será mutada.
     */
    public void applyTo(Producto producto){
        if (this.nombre() != null) producto.setNombre(this.nombre());
        if (this.precio() != null) producto.setPrecio(this.precio());
        if (this.descripcion() != null) producto.setDescripcion(this.descripcion());
        if (this.stock() != null) producto.setStock(this.stock());
        if (this.imagen() != null) producto.setImagen(this.imagen());
        if (this.disponible() != null) producto.setDisponible(this.disponible());
    }
}