package com.utn.foodstore.service;

import com.utn.foodstore.dto.CategoriaCreate;
import com.utn.foodstore.dto.CategoriaDto;
import com.utn.foodstore.dto.CategoriaEdit;
import com.utn.foodstore.model.Categoria;
import com.utn.foodstore.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio que gestiona la lógica de negocio para la entidad {@link Categoria}.
 * <p>
 * Actúa como intermediario entre la capa de presentación y la capa de acceso a datos,
 * encargándose de procesar las reglas de negocio, validar estados relacionales y
 * transformar las entidades de dominio en Objetos de Transferencia de Datos (DTOs).
 */
@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    /**
     * Recupera una lista de todas las categorías activas que no han sido
     * eliminadas lógicamente en el sistema.
     *
     * @return Colección {@link List} de {@link CategoriaDto} con la información pública de las categorías.
     */
    public List<CategoriaDto> findAll() {
        List<Categoria> listaCategorias = categoriaRepository.findAllByEliminadoFalse();

        return listaCategorias.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Busca una categoría activa por su identificador único.
     *
     * @param id Identificador único de la categoría a buscar.
     * @return El {@link CategoriaDto} correspondiente a la categoría encontrada.
     * @throws RuntimeException Si el identificador proporcionado no coincide con ningún registro activo.
     */
    public CategoriaDto findById(Long id) {
        Categoria categoriaEncontrada = findByIdOrThrowException(id);
        return mapToDto(categoriaEncontrada);
    }

    /**
     * Registra y persiste una nueva categoría en el sistema.
     *
     * @param dto Objeto {@link CategoriaCreate} que contiene los datos de entrada validados.
     * @return Un objeto {@link CategoriaDto} que representa el nuevo registro guardado.
     */
    public CategoriaDto create(CategoriaCreate dto) {
        Categoria nuevaCategoria = Categoria.builder()
                .nombre(dto.nombre())
                .descripcion(dto.descripcion())
                .build();

        Categoria categoriaGuardada = categoriaRepository.save(nuevaCategoria);

        return mapToDto(categoriaGuardada);
    }

    /**
     * Modifica de forma parcial los datos de una categoría existente.
     * <p>
     * Evalúa las propiedades modificadas provistas por el DTO de edición para evitar
     * la sobreescritura accidental de atributos preexistentes con valores nulos.
     *
     * @param id  Identificador único de la categoría a modificar.
     * @param dto Objeto {@link CategoriaEdit} con las propiedades modificadas opcionales.
     * @return El {@link CategoriaDto} que refleja los cambios procesados y guardados.
     */
    public CategoriaDto update(Long id, CategoriaEdit dto) {
        Categoria categoriaEncontrada = findByIdOrThrowException(id);
        dto.appyTo(categoriaEncontrada);
        Categoria categoriaActualizada = categoriaRepository.save(categoriaEncontrada);

        return mapToDto(categoriaActualizada);
    }

    /**
     * Realiza la baja lógica (Soft Delete) de una categoría en el sistema.
     * <p>
     * Actualiza el estado de la bandera de visibilidad a verdadero para excluir el registro
     * de las consultas regulares del negocio, preservando la integridad referencial histórica.
     *
     * @param id Identificador único de la categoría a desactivar.
     */
    public void delete(Long id) {
        Categoria categoriaAEliminar = findByIdOrThrowException(id);
        categoriaAEliminar.setEliminado(true);
        categoriaRepository.save(categoriaAEliminar);
    }

    /**
     * Método auxiliar interno que centraliza la búsqueda de categorías activas por ID.
     *
     * @param id Identificador único del registro buscado en la base de datos.
     * @return La entidad de dominio {@link Categoria} recuperada en estado administrado.
     * @throws RuntimeException Si el registro no se encuentra o su bandera de eliminación es verdadera.
     */
    private Categoria findByIdOrThrowException(Long id) {
        return categoriaRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada."));
    }

    /**
     * Convierte una entidad de dominio {@link Categoria} en su representación de salida {@link CategoriaDto}.
     *
     * @param categoria Entidad de origen que contiene los datos del dominio.
     * @return Un nuevo registro {@link CategoriaDto} con los atributos mapeados de forma segura.
     */
    private CategoriaDto mapToDto(Categoria categoria) {
        return CategoriaDto.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .build();
    }
}