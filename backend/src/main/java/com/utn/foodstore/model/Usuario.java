package com.utn.foodstore.model;

import com.utn.foodstore.enums.Rol;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Entidad que representa a un usuario del sistema (cliente o administrador).
 * <p>
 * Mapea la tabla {@code usuarios} en la base de datos y extiende de {@link Base}
 * para heredar las propiedades de auditoría e identificación. Gestiona la información
 * personal, credenciales de acceso, rol de autorización y el historial de pedidos realizados.
 * <p>
 * Implementa la interfaz {@link UserDetails} para integrarse nativamente con el
 * ecosistema de Spring Security, permitiendo la autenticación y autorización basada en tokens.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = {"celular", "contrasena", "pedidos"})
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder
@Entity
@Table(name = "usuarios")
public class Usuario extends Base implements UserDetails {

    /**
     * Nombre de pila del usuario.
     * Este campo es obligatorio y tiene un límite máximo de 50 caracteres.
     */
    @Column(nullable = false, length = 50)
    private String nombre;

    /**
     * Apellido del usuario.
     * Este campo es obligatorio y tiene un límite máximo de 50 caracteres.
     */
    @Column(nullable = false, length = 50)
    private String apellido;

    /**
     * Dirección de correo electrónico del usuario.
     * Funciona como nombre de usuario para el inicio de sesión.
     * Es obligatorio, debe ser único en todo el sistema y se utiliza como
     * clave principal de negocio para establecer la igualdad del objeto (equals/hashCode).
     */
    @EqualsAndHashCode.Include
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * Número de teléfono celular o de contacto del usuario.
     * Este campo es opcional.
     */
    @Column(length = 20)
    private String celular;

    /**
     * Contraseña de acceso al sistema.
     * Se recomienda almacenar este valor encriptado mediante algoritmos de hash fuertes.
     */
    @Column(nullable = false)
    private String contrasena;

    /**
     * Rol de autorización asignado al usuario (ej. ADMIN, USUARIO).
     * Se persiste como una cadena de texto (STRING) en la base de datos para mayor legibilidad.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    /**
     * Historial de pedidos realizados por el usuario.
     * <p>
     * Define una relación de uno a muchos gestionada mediante la columna {@code usuario_id}
     * en la tabla de pedidos. Utiliza carga diferida (LAZY) y propaga operaciones de
     * persistencia, actualización y refresco.
     */
    @OneToMany(
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
            fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @Builder.Default
    private Set<Pedido> pedidos = new HashSet<>();

    /**
     * Método auxiliar (helper) para agregar de forma segura un pedido al historial del usuario.
     * Evita la inserción de valores nulos en la colección.
     *
     * @param pedido El objeto {@link Pedido} que se desea vincular al usuario.
     */
    public void addPedido(Pedido pedido){
        if (pedido != null){
            this.pedidos.add(pedido);
        }
    }

    /**
     * Método auxiliar (helper) para remover de forma segura un pedido del historial del usuario.
     *
     * @param pedido El objeto {@link Pedido} que se desea desvincular.
     */
    public void removePedido(Pedido pedido){
        if (pedido != null){
            this.pedidos.remove(pedido);
        }
    }

    /**
     * Retorna los permisos o roles otorgados al usuario.
     * Adaptado para cumplir con el formato requerido por Spring Security.
     *
     * @return Una colección que contiene el rol del usuario encapsulado en {@link SimpleGrantedAuthority}.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.rol.name()));
    }

    /**
     * Retorna la contraseña empleada para autenticar al usuario.
     *
     * @return La contraseña encriptada del usuario.
     */
    @Override
    public String getPassword() {
        return this.contrasena;
    }

    /**
     * Retorna el nombre de usuario utilizado para la autenticación.
     * En este dominio, el identificador único de acceso es el correo electrónico.
     *
     * @return El correo electrónico del usuario.
     */
    @Override
    public String getUsername() {
        return this.email;
    }

    /**
     * Indica si la cuenta del usuario ha expirado.
     * En esta implementación, la vigencia de la cuenta no expira por tiempo.
     *
     * @return {@code true} de forma constante.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indica si la cuenta del usuario se encuentra bloqueada.
     * En esta implementación no se aplican bloqueos temporales o definitivos de cuenta.
     *
     * @return {@code true} de forma constante.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indica si las credenciales (contraseña) del usuario han expirado.
     * En esta implementación no se exige rotación periódica de contraseñas.
     *
     * @return {@code true} de forma constante.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indica si el usuario está habilitado para la autenticación.
     * <p>
     * Se integra con el sistema de borrado lógico heredado de {@link Base}.
     *
     * @return {@code true} si la entidad no presenta estado de eliminación lógica.
     */
    @Override
    public boolean isEnabled() {
        return !this.isEliminado();
    }
}