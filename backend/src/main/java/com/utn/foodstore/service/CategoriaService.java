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
 * Actúa como intermediario entre la capa de presentación y la capa de acceso a datos.
 * Al utilizar el repositorio base, delega las operaciones estándar y de borrado lógico,
 * centrando su responsabilidad en la transformación de DTOs y la orquestación de
 * las reglas de negocio específicas.
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
        return categoriaRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Busca una categoría activa por su identificador único.
     *
     * @param id Identificador único de la categoría a buscar.
     * @return El {@link CategoriaDto} correspondiente a la categoría encontrada.
     */
    public CategoriaDto findById(Long id) {
        Categoria categoriaEncontrada = categoriaRepository.findByIdOrThrow(id);
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
     *
     * @param id  Identificador único de la categoría a modificar.
     * @param dto Objeto {@link CategoriaEdit} con las propiedades modificadas opcionales.
     * @return El {@link CategoriaDto} que refleja los cambios procesados y guardados.
     */
    public CategoriaDto update(Long id, CategoriaEdit dto) {
        Categoria categoriaEncontrada = categoriaRepository.findByIdOrThrow(id);
        dto.applyTo(categoriaEncontrada);
        Categoria categoriaActualizada = categoriaRepository.save(categoriaEncontrada);

        return mapToDto(categoriaActualizada);
    }

    /**
     * Realiza la baja lógica (Soft Delete) de una categoría en el sistema delegando
     * la ejecución al query unificado del repositorio base.
     *
     * @param id Identificador único de la categoría a desactivar.
     */
    public void delete(Long id) {
        categoriaRepository.deleteById(id);
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