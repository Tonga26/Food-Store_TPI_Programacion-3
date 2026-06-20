package com.utn.foodstore.service;

import com.utn.foodstore.dto.ProductoCreate;
import com.utn.foodstore.dto.ProductoDto;
import com.utn.foodstore.model.Categoria;
import com.utn.foodstore.model.Producto;
import com.utn.foodstore.repository.CategoriaRepository;
import com.utn.foodstore.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public List<ProductoDto> findAll() {

        List<Producto> listaEntidades = productoRepository.findAllByEliminadoFalse();

        return listaEntidades.stream()
                .map(this::mapToDto)
                .toList();
    }

    public ProductoDto create(ProductoCreate dto) {

        Categoria categoriaEncontrada = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada."));

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