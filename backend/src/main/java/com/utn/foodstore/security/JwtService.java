package com.utn.foodstore.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Servicio encargado de la gestión criptográfica de los JSON Web Tokens (JWT).
 * <p>
 * Centraliza la creación, firma, validación y extracción de datos (Claims) de los tokens
 * de autenticación, utilizando la especificación de io.jsonwebtoken.
 * Las credenciales de seguridad se inyectan dinámicamente desde el entorno de configuración.
 */
@Service
public class JwtService {

    /**
     * Clave criptográfica utilizada para firmar digitalmente los tokens.
     * Inyectada desde application.properties (security.jwt.secret-key).
     */
    @Value("${security.jwt.secret-key}")
    private String secretKey;

    /**
     * Tiempo de validez del token expresado en milisegundos.
     * Inyectado desde application.properties (security.jwt.expiration-time).
     */
    @Value("${security.jwt.expiration-time}")
    private long expirationTime;

    /**
     * Genera un token estándar sin reclamaciones (claims) adicionales.
     *
     * @param userDetails Objeto que contiene los datos del principal autenticado.
     * @return El token JWT generado en formato String.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Genera un token JWT firmado y encapsulado con datos adicionales.
     *
     * @param extraClaims Mapa con propiedades adicionales a incrustar en el payload del token.
     * @param userDetails Objeto que contiene los datos del principal autenticado.
     * @return El token JWT generado, firmado y compactado.
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Extrae el identificador principal (subject) desde el payload del token.
     *
     * @param token El JSON Web Token a procesar.
     * @return El nombre de usuario (email) incrustado en el token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Evalúa la autenticidad y vigencia temporal de un token respecto a un perfil de usuario.
     *
     * @param token El JSON Web Token a validar.
     * @param userDetails El perfil de usuario contra el cual se contrastará el token.
     * @return {@code true} si el token pertenece al usuario y no ha expirado, de lo contrario {@code false}.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Extrae un valor específico del payload del token aplicando una función de resolución.
     *
     * @param token El JSON Web Token a procesar.
     * @param claimsResolver Función de orden superior que determina el dato a extraer.
     * @param <T> El tipo de dato esperado como resultado de la extracción.
     * @return El valor resuelto desde el cuerpo de los claims.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Desencripta y verifica la firma del token para acceder a la totalidad de sus claims.
     *
     * @param token El JSON Web Token a analizar.
     * @return Un objeto {@link Claims} con el cuerpo completo del token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Convierte la clave secreta en un objeto criptográfico compatible con el algoritmo de firma.
     *
     * @return Una instancia de {@link SecretKey} para la firma y verificación de tokens.
     */
    private SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Comprueba si la fecha de caducidad del token es anterior a la fecha y hora actuales.
     *
     * @param token El JSON Web Token a evaluar.
     * @return {@code true} si el token ha expirado, de lo contrario {@code false}.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrae la fecha límite de validez configurada en el token.
     *
     * @param token El JSON Web Token a analizar.
     * @return Un objeto {@link Date} representando el momento exacto de expiración.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}