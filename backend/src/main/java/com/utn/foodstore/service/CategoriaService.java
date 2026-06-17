package com.utn.foodstore.service;

import com.utn.foodstore.dto.CategoriaCreate;
import com.utn.foodstore.dto.CategoriaDto;
import com.utn.foodstore.model.Categoria;
import com.utn.foodstore.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio que gestiona la lógica de negocio para la entidad {@link Categoria}.
 * <p>
 * Actúa como intermediario entre la capa de presentación (Controladores) y la
 * capa de acceso a datos (Repositorios). Se encarga de aislar el modelo interno,
 * procesar las reglas de negocio y transformar las entidades de dominio en
 * Objetos de Transferencia de Datos (DTOs) antes de devolver la información.
 */
@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    /**
     * Recupera una lista de todas las categorías activas en el sistema.
     * <p>
     * Filtra automáticamente aquellas categorías que han sido marcadas como eliminadas
     * mediante borrado lógico (Soft Delete) y transforma las entidades recuperadas
     * en DTOs de solo lectura.
     *
     * @return Una colección {@link List} de {@link CategoriaDto} con la información pública de las categorías.
     */
    public List<CategoriaDto> findAll() {

        List<Categoria> listaEntidades = categoriaRepository.findAllByEliminadoFalse();

        return listaEntidades.stream()
                .map(this::mapToDto) // El Stream ejecuta mapToDto por cada entidad que pasa
                .toList();
    }

    /**
     * Crea y persiste una nueva categoría en el sistema.
     * <p>
     * Recibe los datos de creación validados, construye una nueva entidad de dominio
     * utilizando el patrón Builder, la persiste en la base de datos y retorna su
     * representación final incluyendo el ID generado automáticamente.
     *
     * @param dto Objeto {@link CategoriaCreate} que contiene los datos de entrada validados.
     * @return Un objeto {@link CategoriaDto} inmutable que representa la categoría guardada.
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
     * Convierte internamente una entidad de dominio {@link Categoria} en su
     * respectiva representación de transferencia {@link CategoriaDto}.
     * <p>
     * Centraliza la lógica de mapeo para asegurar la consistencia de los datos expuestos
     * a la capa de presentación y evitar la filtración directa de entidades JPA.
     *
     * @param categoria La entidad de origen recuperada o persistida en la base de datos.
     * @return Un nuevo registro {@link CategoriaDto} con los atributos mapeados.
     */
    private CategoriaDto mapToDto(Categoria categoria) {
        return new CategoriaDto(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion());
    }
}