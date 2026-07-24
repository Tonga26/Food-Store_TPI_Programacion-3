package com.utn.foodstore.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuración central de seguridad de la aplicación.
 * <p>
 * Define la arquitectura de seguridad basada en Spring Security 6.
 * Utiliza la anotación {@link Configuration} para declarar beans de infraestructura,
 * {@link EnableWebSecurity} para habilitar la personalización de seguridad web, y
 * {@link RequiredArgsConstructor} para la inyección de dependencias obligatorias.
 * Gestiona la cadena de filtros HTTP, la política de sesiones, la configuración de
 * orígenes cruzados (CORS) y los componentes de autenticación.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /**
     * Filtro personalizado encargado de interceptar las peticiones HTTP para extraer
     * y validar los tokens JWT previo al acceso de recursos protegidos.
     */
    private final JwtAuthenticationFilter jwtAuthFilter;

    /**
     * Servicio de Spring Security utilizado para recuperar los detalles y autoridades
     * de los usuarios desde la capa de persistencia.
     */
    private final UserDetailsService userDetailsService;

    /**
     * Configura y expone el algoritmo criptográfico del sistema.
     * <p>
     * Provee una implementación basada en BCrypt para el cifrado unidireccional
     * y la validación segura de contraseñas.
     *
     * @return Instancia de {@link PasswordEncoder} configurada.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Expone el administrador principal de autenticación de Spring Security.
     * <p>
     * NOTA ARQUITECTÓNICA: En versiones modernas de Spring Security, no es necesario
     * declarar explícitamente el DaoAuthenticationProvider. Al invocar este bean,
     * el AuthenticationConfiguration escanea el contexto de la aplicación, detecta
     * nuestros beans de UserDetailsService y PasswordEncoder, y ensambla automáticamente
     * el proveedor de autenticación por detrás, inyectándolo en la cadena de filtros.
     *
     * @param config Objeto {@link AuthenticationConfiguration} que provee la configuración actual.
     * @return El {@link AuthenticationManager} global de la aplicación.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Consolida y define la cadena de filtros de seguridad (Security Filter Chain).
     * <p>
     * Establece las políticas fundamentales de protección para el tráfico HTTP:
     * <ul>
     *   <li>Inhabilita la protección CSRF en favor de esquemas basados en tokens.</li>
     *   <li>Aplica las políticas CORS establecidas en el contexto.</li>
     *   <li>Implementa Control de Acceso Basado en Roles (RBAC) con coincidencia estricta de rutas.</li>
     *   <li>Fuerza la gestión de sesiones bajo la política {@link SessionCreationPolicy#STATELESS}.</li>
     *   <li>Registra el filtro JWT en la jerarquía para ejecutarse antes del filtro de validación estándar.</li>
     * </ul>
     *
     * @param http Instancia de {@link HttpSecurity} para construir el flujo de seguridad.
     * @return Objeto {@link SecurityFilterChain} configurado.
     * @throws Exception Si se presenta un error estructural durante la configuración.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api-docs/**", "/swagger-ui/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/**", "/api/products", "/api/products/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/categories", "/api/categories/**", "/api/products", "/api/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**", "/api/products/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**", "/api/products/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/orders", "/api/orders/**").hasAnyAuthority("USUARIO", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/orders/user/**", "/api/orders/{id}").hasAnyAuthority("USUARIO", "ADMIN")

                        .requestMatchers("/api/orders", "/api/orders/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/users", "/api/users/**").hasAuthority("ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Define las directivas de Intercambio de Recursos de Origen Cruzado (CORS).
     * <p>
     * Autoriza explícitamente orígenes cliente, métodos de interacción HTTP,
     * y la transmisión de cabeceras de autorización necesarias para el flujo JWT.
     *
     * @return Implementación de {@link CorsConfigurationSource} con las reglas definidas.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}