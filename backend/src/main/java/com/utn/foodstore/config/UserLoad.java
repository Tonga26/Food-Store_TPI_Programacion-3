package com.utn.foodstore.config;

import com.utn.foodstore.enums.Rol;
import com.utn.foodstore.model.Usuario;
import com.utn.foodstore.repository.UsuarioRepository;
import com.utn.foodstore.security.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Componente de infraestructura encargado de la carga inicial de datos esenciales de seguridad.
 * Implementa {@link CommandLineRunner} para evaluar la existencia de usuarios durante el arranque
 * de la aplicación, garantizando la creación de una cuenta administrativa por defecto si el
 * sistema se encuentra vacío.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class UserLoad implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Ejecuta la lógica de validación y siembra del usuario administrador por defecto
     * inmediatamente después del inicio completo del contexto de la aplicación.
     *
     * @param args Argumentos opcionales de la línea de comandos pasados a la aplicación.
     * @throws Exception Si se produce un fallo durante la persistencia del registro inicial.
     */
    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario nuevoUsuario = Usuario.builder()
                    .nombre("Administrador")
                    .apellido("Sistema")
                    .email("admin@admin.com")
                    .celular("0000000000")
                    .contrasena(passwordEncoder.encode("123456"))
                    .rol(Rol.ADMIN)
                    .build();

            usuarioRepository.save(nuevoUsuario);

            log.info("Carga inicial exitosa: Usuario administrador creado por defecto con email admin@admin.com");
        } else {
            log.info("Omitiendo carga inicial: Ya existen usuarios registrados en el sistema.");
        }
    }
}