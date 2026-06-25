package com.utn.foodstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Clase de configuración global encargada de instanciar y administrar los componentes
 * de seguridad y criptografía de la aplicación.
 * <p>
 * Centraliza la definición de los Beans relacionados con Spring Security, garantizando
 * que estén disponibles en el contenedor de Inyección de Dependencias (ApplicationContext)
 * para ser utilizados por cualquier servicio que los requiera.
 */
@Configuration
public class SecurityConfig {

    /**
     * Instancia y expone el componente encargado del hashing de contraseñas.
     * <p>
     * Se utiliza el algoritmo BCrypt, el cual es el estándar de la industria debido
     * a su resistencia a ataques de fuerza bruta mediante la incorporación automática
     * de un "salt" dinámico en cada encriptación.
     *
     * @return Una implementación de {@link PasswordEncoder} basada en {@link BCryptPasswordEncoder}.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}