package com.utn.foodstore.service;

import com.utn.foodstore.dto.UsuarioCreate;
import com.utn.foodstore.dto.UsuarioDto;
import com.utn.foodstore.dto.UsuarioEdit;
import com.utn.foodstore.enums.Rol;
import com.utn.foodstore.model.Usuario;
import com.utn.foodstore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio de aplicación encargado de orquestar la lógica de negocio para la entidad {@link Usuario}.
 * <p>
 * Gestiona el ciclo de vida de las cuentas de usuario, garantizando la unicidad de las
 * credenciales (email), la asignación de roles y la correcta transformación de la
 * información hacia la capa de presentación mediante DTOs.
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    /**
     * Recupera el listado completo de usuarios activos en el sistema.
     *
     * @return Una colección de {@link UsuarioDto} con la información pública de los usuarios.
     */
    public List<UsuarioDto> findAll() {
        return usuarioRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Busca un usuario específico mediante su identificador único.
     *
     * @param id El identificador de la entidad a recuperar.
     * @return El registro {@link UsuarioDto} correspondiente.
     */
    public UsuarioDto findById(Long id) {
        Usuario usuarioEncontrado = usuarioRepository.findByIdOrThrow(id);
        return mapToDto(usuarioEncontrado);
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * Valida la unicidad del correo electrónico y asigna el rol por defecto.
     *
     * @param dto El objeto {@link UsuarioCreate} con los datos de registro.
     * @return El {@link UsuarioDto} del usuario recién creado.
     * @throws RuntimeException Si el email proporcionado ya se encuentra registrado.
     */
    public UsuarioDto create(UsuarioCreate dto) {

        if (usuarioRepository.existsByEmail(dto.email())){
            throw new RuntimeException("Ya existe un usuario registrado con el email: " + dto.email());
        }

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .email(dto.email())
                .celular(dto.celular())
                .contrasena(dto.password())
                .rol(Rol.USUARIO) // TODO: Aplicar BCryptPasswordEncoder en la Épica de Seguridad
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        return mapToDto(usuarioGuardado);
    }

    /**
     * Aplica una modificación parcial sobre los datos de un usuario existente.
     * Valida que, en caso de modificación del email, el nuevo no colisione con otro usuario.
     *
     * @param id  El identificador del usuario a modificar.
     * @param dto El objeto {@link UsuarioEdit} con los campos a sobrescribir.
     * @return El {@link UsuarioDto} con el estado final de la cuenta.
     * @throws RuntimeException Si el nuevo email ya está en uso.
     */
    public UsuarioDto update(Long id, UsuarioEdit dto) {

        Usuario usuarioEncontrado = usuarioRepository.findByIdOrThrow(id);

        if (dto.email() != null && !dto.email().equalsIgnoreCase(usuarioEncontrado.getEmail())){
            if (usuarioRepository.existsByEmail(dto.email())){
                throw new RuntimeException("Ya existe otro usuario registrado con el email: " + dto.email());
            };
        }

        dto.applyTo(usuarioEncontrado);

        if (dto.password() != null){
            usuarioEncontrado.setContrasena(dto.password());
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuarioEncontrado);

        return mapToDto(usuarioActualizado);
    }

    /**
     * Ejecuta la baja lógica (Soft Delete) de un usuario delegando
     * la operación al repositorio base unificado.
     *
     * @param id El identificador del usuario a desactivar.
     */
    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }

    /**
     * Transforma una entidad de dominio en un DTO de respuesta seguro,
     * excluyendo intencionalmente campos sensibles como la contraseña.
     *
     * @param usuario La entidad original.
     * @return El registro {@link UsuarioDto} seguro para exponer.
     */
    private UsuarioDto mapToDto(Usuario usuario) {
        return UsuarioDto.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .celular(usuario.getCelular())
                .rol(usuario.getRol())
                .build();
    }
}