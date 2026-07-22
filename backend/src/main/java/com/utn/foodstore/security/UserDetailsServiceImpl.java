package com.utn.foodstore.security;

import com.utn.foodstore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Servicio de detalles de usuario personalizado para el ecosistema de Spring Security.
 * <p>
 * Implementa la interfaz {@link UserDetailsService} para proporcionar el mecanismo
 * de recuperación de credenciales y estado del usuario desde la base de datos local
 * durante el proceso de autenticación.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    /**
     * Repositorio de usuarios utilizado para la consulta de persistencia.
     */
    private final UsuarioRepository usuarioRepository;

    /**
     * Localiza a un usuario en base a su identificador principal de negocio.
     * En el contexto de este sistema, el identificador de acceso (username)
     * corresponde a la dirección de correo electrónico.
     * <p>
     * La consulta discrimina automáticamente a los usuarios que poseen una
     * baja lógica (soft delete) en el sistema.
     *
     * @param username El correo electrónico del usuario que solicita autenticación.
     * @return Una instancia poblada de {@link UserDetails} asociada al correo provisto.
     * @throws UsernameNotFoundException Si no existe un registro activo asociado al correo provisto.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByEmailAndEliminadoFalse(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}