package com.utn.foodstore.config;

import com.utn.foodstore.enums.Rol;
import com.utn.foodstore.model.Usuario;
import com.utn.foodstore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Componente de infraestructura encargado de la carga inicial de datos esenciales de seguridad.
 * <p>
 * Implementa {@link CommandLineRunner} para evaluar de forma individual la existencia de las
 * cuentas de acceso maestras durante el arranque de la aplicación, garantizando la siembra
 * automática de un perfil administrativo y un perfil de cliente de pruebas si no se encuentran
 * registrados en la base de datos.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class UserLoad implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Ejecuta la lógica de validación y siembra de los usuarios por defecto inmediatamente
     * después del inicio completo del contexto de la aplicación.
     *
     * @param args Argumentos opcionales de la línea de comandos pasados a la aplicación.
     * @throws Exception Si se produce un fallo durante la persistencia de los registros iniciales.
     */
    @Override
    public void run(String... args) throws Exception {

        // Verificación y siembra del Usuario Administrador
        if (!usuarioRepository.existsByEmail("admin@admin.com")) {
            Usuario administrador = Usuario.builder()
                    .nombre("Administrador")
                    .apellido("Sistema")
                    .email("admin@admin.com")
                    .celular("0000000000")
                    .contrasena(passwordEncoder.encode("123456"))
                    .rol(Rol.ADMIN)
                    .build();

            usuarioRepository.save(administrador);
            log.info("Carga inicial: Usuario administrador creado con éxito (admin@admin.com).");
        } else {
            log.info("Carga inicial: El usuario administrador ya se encuentra registrado.");
        }

        // Verificación y siembra del Usuario Cliente de Pruebas
        if (!usuarioRepository.existsByEmail("user@user.com")) {
            Usuario clientePrueba = Usuario.builder()
                    .nombre("Usuario")
                    .apellido("Sistema")
                    .email("user@user.com")
                    .celular("0000000000")
                    .contrasena(passwordEncoder.encode("123456"))
                    .rol(Rol.USUARIO)
                    .build();

            usuarioRepository.save(clientePrueba);
            log.info("Carga inicial: Usuario cliente de pruebas creado con éxito (user@user.com).");
        } else {
            log.info("Carga inicial: El usuario cliente de pruebas ya se encuentra registrado.");
        }
    }
}