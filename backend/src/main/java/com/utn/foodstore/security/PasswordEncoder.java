package com.utn.foodstore.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Componente de seguridad encargado de la gestión criptográfica de credenciales.
 * Proporciona mecanismos de encriptación unidireccional utilizando el algoritmo BCrypt,
 * garantizando que las contraseñas no se almacenen en texto plano para proteger
 * la información sensible del sistema.
 */
@Component
public class PasswordEncoder {

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    /**
     * Encripta una contraseña en texto plano aplicando un algoritmo de hash con salt aleatorio.
     *
     * @param password La contraseña original en texto plano proporcionada por el usuario.
     * @return La cadena de texto cifrada (hash) generada mediante BCrypt.
     */
    public String encode(String password) {
        return bCryptPasswordEncoder.encode(password);
    }

    /**
     * Verifica criptográficamente si una contraseña en texto plano corresponde a un hash almacenado.
     *
     * @param raw La contraseña en texto plano capturada durante el proceso de autenticación.
     * @param encoded El hash seguro recuperado de la base de datos para su comparación.
     * @return {@code true} si la contraseña coincide con el hash almacenado; {@code false} en caso contrario.
     */
    public boolean matches(String raw, String encoded) {
        return bCryptPasswordEncoder.matches(raw, encoded);
    }
}