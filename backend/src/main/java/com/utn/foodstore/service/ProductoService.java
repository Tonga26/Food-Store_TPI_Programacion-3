package com.utn.foodstore.service;

import com.utn.foodstore.dto.ProductoCreate;
import com.utn.foodstore.dto.ProductoDto;
import com.utn.foodstore.dto.ProductoEdit;
import com.utn.foodstore.model.Categoria;
import com.utn.foodstore.model.Producto;
import com.utn.foodstore.repository.CategoriaRepository;
import com.utn.foodstore.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio de aplicación encargado de orquestar la lógica de negocio para la entidad {@link Producto}.
 * <p>
 * Actúa como intermediario transaccional entre la capa de presentación (Controladores)
 * y la capa de acceso a datos (Repositorios). Garantiza la integridad referencial
 * con la entidad {@link Categoria} y gestiona las transformaciones entre entidades
 * de dominio y Objetos de Transferencia de Datos (DTOs).
 */
@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    /**
     * Recupera el catálogo completo de productos activos en el sistema.
     *
     * @return Una colección {@link List} de {@link ProductoDto} con la información pública de los productos.
     */
    public List<ProductoDto> findAll() {
        List<Producto> listaEntidades = productoRepository.findAllByEliminadoFalse();

        return listaEntidades.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Busca un producto específico mediante su identificador único.
     *
     * @param id El identificador de la entidad a recuperar.
     * @return El registro {@link ProductoDto} correspondiente.
     * @throws RuntimeException Si el producto no existe o se encuentra inactivo.
     */
    public ProductoDto findById(Long id) {
        Producto productoEncontrado = findProductoByIdOrThrowException(id);
        return mapToDto(productoEncontrado);
    }

    /**
     * Procesa el alta de un nuevo producto en el sistema, validando previamente
     * la existencia y disponibilidad de la categoría asociada.
     *
     * @param dto El objeto {@link ProductoCreate} con los datos validados de entrada.
     * @return El {@link ProductoDto} representativo del nuevo registro persistido.
     * @throws RuntimeException Si la categoría referenciada no existe o está dada de baja.
     */
    public ProductoDto create(ProductoCreate dto) {
        Categoria categoriaEncontrada = findCategoriaByIdOrThrowException(dto.categoriaId());

        Producto nuevoProducto = Producto.builder()
                .nombre(dto.nombre())
                .precio(dto.precio())
                .descripcion(dto.descripcion())
                .stock(dto.stock())
                .imagen(dto.imagen())
                .disponible(dto.disponible())
                .categoria(categoriaEncontrada)
                .build();

        Producto productoGuardado = productoRepository.save(nuevoProducto);

        return mapToDto(productoGuardado);
    }

    /**
     * Aplica una modificación parcial sobre un producto existente.
     * <p>
     * Delega la mutación de campos escalares al DTO y orquesta la validación
     * e inyección de una nueva categoría en caso de que el cliente solicite su actualización.
     *
     * @param id  El identificador del producto a modificar.
     * @param dto El objeto {@link ProductoEdit} con los campos a sobrescribir.
     * @return El {@link ProductoDto} con el estado final de la entidad.
     * @throws RuntimeException Si el producto, o la nueva categoría referenciada, no existen o están inactivos.
     */
    public ProductoDto update(Long id, ProductoEdit dto) {
        Producto productoEncontrado = findProductoByIdOrThrowException(id);

        dto.applyTo(productoEncontrado);

        if (dto.categoriaId() != null) {
            Categoria nuevaCategoria = findCategoriaByIdOrThrowException(dto.categoriaId());
            productoEncontrado.setCategoria(nuevaCategoria);
        }

        Producto productoActualizado = productoRepository.save(productoEncontrado);

        return mapToDto(productoActualizado);
    }

    /**
     * Ejecuta la baja lógica (Soft Delete) de un producto, ocultándolo del catálogo
     * sin destruir el registro físico en la base de datos.
     *
     * @param id El identificador del producto a eliminar.
     * @throws RuntimeException Si el producto no existe o ya se encuentra inactivo.
     */
    public void delete(Long id) {
        Producto productoAEliminar = findProductoByIdOrThrowException(id);
        productoAEliminar.setEliminado(true);
        productoRepository.save(productoAEliminar);
    }

    /**
     * Método utilitario interno para centralizar la búsqueda segura de productos.
     *
     * @param id El identificador del producto.
     * @return La entidad {@link Producto} recuperada.
     * @throws RuntimeException Si la entidad no se encuentra o está marcada como eliminada.
     */
    private Producto findProductoByIdOrThrowException(Long id) {
        return productoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado."));
    }

    /**
     * Método utilitario interno para centralizar la búsqueda segura de categorías.
     *
     * @param id El identificador de la categoría.
     * @return La entidad {@link Categoria} recuperada.
     * @throws RuntimeException Si la entidad no se encuentra o está inactiva.
     */
    private Categoria findCategoriaByIdOrThrowException(Long id) {
        return categoriaRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada."));
    }

    /**
     * Transforma una entidad de dominio en un DTO de respuesta, aplanando
     * la relación con la entidad Categoría para optimizar el payload.
     *
     * @param producto La entidad original.
     * @return El registro {@link ProductoDto} mapeado.
     */
    private ProductoDto mapToDto(Producto producto) {
        return ProductoDto.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .precio(producto.getPrecio())
                .descripcion(producto.getDescripcion())
                .stock(producto.getStock())
                .imagen(producto.getImagen())
                .disponible(producto.getDisponible())
                .categoriaId(producto.getCategoria().getId())
                .categoriaNombre(producto.getCategoria().getNombre())
                .build();
    }
}