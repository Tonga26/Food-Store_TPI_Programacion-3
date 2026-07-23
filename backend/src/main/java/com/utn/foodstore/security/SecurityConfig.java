package com.utn.foodstore.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración central de seguridad de la aplicación.
 * <p>
 * Esta clase define la arquitectura de seguridad basada en Spring Security 6.
 * Utiliza la anotación {@link Configuration} para declarar beans de Spring,
 * {@link EnableWebSecurity} para habilitar la seguridad web personalizada, y
 * {@link RequiredArgsConstructor} de Lombok para la inyección de dependencias.
 * Gestiona la cadena de filtros HTTP, la política de sesiones Stateless,
 * y los componentes necesarios para la autenticación y encriptación.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /**
     * Filtro personalizado que intercepta las peticiones HTTP para extraer y validar
     * el token JWT antes de permitir el acceso a los recursos protegidos.
     */
    private final JwtAuthenticationFilter jwtAuthFilter;

    /**
     * Servicio central de Spring Security utilizado para recuperar los datos del usuario
     * (credenciales y roles) desde la base de datos durante el proceso de autenticación.
     */
    private final UserDetailsService userDetailsService;

    /**
     * Registra el algoritmo de encriptación utilizado en el sistema.
     * <p>
     * Instancia y devuelve un {@link BCryptPasswordEncoder}, que implementa la interfaz
     * {@link PasswordEncoder}. Este algoritmo aplica una función hash fuerte para almacenar
     * y validar contraseñas de forma segura.
     *
     * @return Implementación de {@link PasswordEncoder} basada en BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura y provee el motor de validación de credenciales (Data Access Object Provider).
     * <p>
     * Crea una instancia de {@link DaoAuthenticationProvider}, inyectándole el
     * {@link UserDetailsService} para la búsqueda de usuarios y el {@link PasswordEncoder}
     * para la validación de la contraseña cifrada contra la proporcionada por el cliente.
     *
     * @return {@link AuthenticationProvider} completamente configurado para la validación de usuarios.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Expone el administrador principal de autenticación de Spring Security.
     * <p>
     * Este bean es requerido por los controladores (ej. AuthController) para iniciar
     * de forma programática el proceso de login. Se obtiene directamente de la
     * configuración de seguridad exportada de la aplicación.
     *
     * @param config Objeto {@link AuthenticationConfiguration} que provee la configuración actual.
     * @return El {@link AuthenticationManager} global de la aplicación.
     * @throws Exception Si ocurre un error al construir o recuperar el administrador.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Define la cadena de filtros de seguridad (Security Filter Chain) para las peticiones HTTP.
     * <p>
     * Configura de manera fluida las siguientes políticas:
     * <ul>
     *   <li>Desactiva la protección CSRF (necesario en arquitecturas REST Stateless con JWT).</li>
     *   <li>Define las reglas de autorización (Access Control) por ruta y verbo HTTP, desde las
     *       rutas públicas de acceso global, hasta las operaciones restringidas según los permisos
     *       "USUARIO" y "ADMIN".</li>
     *   <li>Establece una política de creación de sesiones {@link SessionCreationPolicy#STATELESS},
     *       indicando que no se utilizarán HttpSession del lado del servidor.</li>
     *   <li>Inyecta el {@link AuthenticationProvider} definido en la clase.</li>
     *   <li>Registra el {@link JwtAuthenticationFilter} para que se ejecute antes del filtro
     *       estándar de validación de usuario y contraseña.</li>
     * </ul>
     *
     * @param http Objeto {@link HttpSecurity} utilizado para construir las políticas de seguridad web.
     * @return La configuración consolidada en un objeto {@link SecurityFilterChain}.
     * @throws Exception Si existe algún error en la declaración de las reglas de seguridad.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api-docs/**", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**", "/api/products/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/categories/**", "/api/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**", "/api/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**", "/api/products/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/orders/**").hasAnyAuthority("USUARIO", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/orders/user/**", "/api/orders/{id}").hasAnyAuthority("USUARIO", "ADMIN")

                        .requestMatchers("/api/orders/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/users/**").hasAuthority("ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}