package com.utn.foodstore.service;

import com.utn.foodstore.dto.LoginDto;
import com.utn.foodstore.dto.UsuarioCreate;
import com.utn.foodstore.dto.UsuarioDto;
import com.utn.foodstore.dto.UsuarioEdit;
import com.utn.foodstore.enums.Rol;
import com.utn.foodstore.exception.BusinessException;
import com.utn.foodstore.model.Usuario;
import com.utn.foodstore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio de aplicación encargado de orquestar la lógica de negocio para la entidad {@link Usuario}.
 * <p>
 * Gestiona el ciclo de vida de las cuentas de usuario, garantizando la unicidad de las
 * credenciales (email), la asignación de roles, la encriptación unidireccional de contraseñas
 * y la correcta transformación de la información hacia la capa de presentación mediante DTOs.
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

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
     * Autentica a un usuario mediante su correo electrónico y contraseña en texto plano.
     * Valida la existencia del usuario activo y compara el hash almacenado utilizando
     * el algoritmo de encriptación configurado.
     *
     * @param dto El objeto {@link LoginDto} con las credenciales suministradas.
     * @return El {@link UsuarioDto} del usuario si la validación es exitosa.
     * @throws BusinessException Si las credenciales no coinciden o el usuario fue eliminado (HTTP 400).
     */
    public UsuarioDto login(LoginDto dto) {
        Usuario usuario = usuarioRepository.findByEmailAndEliminadoFalse(dto.email())
                .orElseThrow(() -> new BusinessException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(dto.password(), usuario.getContrasena())) {
            throw new BusinessException("Credenciales incorrectas");
        }
        return mapToDto(usuario);
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * Valida la unicidad del correo electrónico, aplica hashing sobre la contraseña
     * y asigna el rol estándar de acceso.
     *
     * @param dto El objeto {@link UsuarioCreate} con los datos de registro validados.
     * @return El {@link UsuarioDto} del usuario recién creado.
     * @throws BusinessException Si el email proporcionado ya se encuentra registrado (Dispara HTTP 400).
     */
    public UsuarioDto create(UsuarioCreate dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Ya existe un usuario registrado con el email: " + dto.email());
        }

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .email(dto.email())
                .celular(dto.celular())
                .contrasena(passwordEncoder.encode(dto.password()))
                .rol(Rol.USUARIO)
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        return mapToDto(usuarioGuardado);
    }

    /**
     * Aplica una modificación parcial sobre los datos de un usuario existente.
     * Gestiona la re-validación de unicidad en caso de modificación del email y
     * re-encripta la contraseña si es suministrada.
     *
     * @param id  El identificador del usuario a modificar.
     * @param dto El objeto {@link UsuarioEdit} con los campos a sobrescribir.
     * @return El {@link UsuarioDto} con el estado final de la cuenta.
     * @throws BusinessException Si el nuevo email colisiona con el de otro usuario registrado (Dispara HTTP 400).
     */
    public UsuarioDto update(Long id, UsuarioEdit dto) {
        Usuario usuarioEncontrado = usuarioRepository.findByIdOrThrow(id);

        if (dto.email() != null && !dto.email().equalsIgnoreCase(usuarioEncontrado.getEmail())) {
            if (usuarioRepository.existsByEmail(dto.email())) {
                throw new BusinessException("Ya existe otro usuario registrado con el email: " + dto.email());
            }
        }

        dto.applyTo(usuarioEncontrado);

        if (dto.password() != null) {
            usuarioEncontrado.setContrasena(passwordEncoder.encode(dto.password()));
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
     * excluyendo intencionalmente campos de infraestructura y credenciales de acceso.
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