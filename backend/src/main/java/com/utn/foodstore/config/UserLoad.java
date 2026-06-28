package com.utn.foodstore.config;

import com.utn.foodstore.enums.Rol;
import com.utn.foodstore.model.Categoria;
import com.utn.foodstore.model.Producto;
import com.utn.foodstore.model.Usuario;
import com.utn.foodstore.repository.CategoriaRepository;
import com.utn.foodstore.repository.ProductoRepository;
import com.utn.foodstore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Componente de infraestructura encargado de la carga inicial y siembra de datos (Data Seeding).
 * <p>
 * Implementa {@link CommandLineRunner} para ejecutar la lógica de verificación y persistencia
 * de usuarios maestros, categorías base y el catálogo inicial de productos durante el arranque
 * de la aplicación, garantizando la existencia de datos mínimos para entornos de prueba o evaluación.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class UserLoad implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    /**
     * Coordina la ejecución secuencial de la siembra de datos una vez que el contexto
     * de la aplicación se ha iniciado por completo.
     *
     * @param args Argumentos de la línea de comandos pasados a la aplicación.
     * @throws Exception Si se produce un fallo de restricción o persistencia en la base de datos.
     */
    @Override
    public void run(String... args) throws Exception {
        sembrarUsuarios();
        sembrarCatalogo();
    }

    /**
     * Verifica la existencia de las cuentas maestras de acceso y procede a su creación
     * en caso de no encontrarse registradas en el sistema. Si los perfiles ya coexisten,
     * se reporta su estado actual en la consola de auditoría.
     */
    private void sembrarUsuarios() {
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
            log.info("Carga inicial: Usuario administrador creado (admin@admin.com).");
        } else {
            log.info("Carga inicial: El usuario administrador ya se encuentra registrado.");
        }

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
            log.info("Carga inicial: Usuario cliente de pruebas creado (user@user.com).");
        } else {
            log.info("Carga inicial: El usuario cliente de pruebas ya se encuentra registrado.");
        }
    }

    /**
     * Gestiona la siembra relacional de las categorías base y sus respectivos productos asociados
     * si las tablas correspondientes se encuentran vacías.
     */
    private void sembrarCatalogo() {
        if (categoriaRepository.count() == 0) {
            log.info("Iniciando siembra de categorías y productos...");

            Categoria catPizzas = Categoria.builder().nombre("Pizzas").descripcion("Pizzas artesanales con masa fresca").imagen("pizza-muzarella.png").build();
            Categoria catHamburguesas = Categoria.builder().nombre("Hamburguesas").descripcion("Hamburguesas gourmet con ingredientes frescos").imagen("hamburguesa-clasica.png").build();
            Categoria catBebidas = Categoria.builder().nombre("Bebidas").descripcion("Gaseosas, jugos y bebidas frías").imagen("coca-500-ml.png").build();
            Categoria catPostres = Categoria.builder().nombre("Postres").descripcion("Tortas, helados y dulces artesanales").imagen("torta-rogel.png").build();
            Categoria catEmpanadas = Categoria.builder().nombre("Empanadas").descripcion("Empanadas horneadas y fritas de distintos sabores").imagen("empanadas-carne.png").build();
            Categoria catEnsaladas = Categoria.builder().nombre("Ensaladas").descripcion("Ensaladas frescas y saludables").imagen("ensalada-cesar.png").build();

            List<Categoria> categoriasGuardadas = categoriaRepository.saveAll(
                    List.of(catPizzas, catHamburguesas, catBebidas, catPostres, catEmpanadas, catEnsaladas)
            );

            catPizzas = categoriasGuardadas.get(0);
            catHamburguesas = categoriasGuardadas.get(1);
            catBebidas = categoriasGuardadas.get(2);
            catPostres = categoriasGuardadas.get(3);
            catEmpanadas = categoriasGuardadas.get(4);
            catEnsaladas = categoriasGuardadas.get(5);

            log.info("Carga inicial: 6 categorías base guardadas correctamente.");

            if (productoRepository.count() == 0) {
                Producto p1 = Producto.builder().nombre("Pizza Muzzarella").precio(4500.0).descripcion("Pizza clásica con salsa de tomate y muzzarella derretida").stock(20).imagen("pizza-muzarella.png").disponible(true).categoria(catPizzas).build();
                Producto p2 = Producto.builder().nombre("Pizza Napolitana").precio(5200.0).descripcion("Pizza con rodajas de tomate fresco, ajo y albahaca").stock(15).imagen("pizza-napolitana.png").disponible(true).categoria(catPizzas).build();
                Producto p3 = Producto.builder().nombre("Pizza Especial 4 Quesos").precio(6800.0).descripcion("Muzzarella, provolone, roquefort y parmesano").stock(10).imagen("pizza-4-quesos.jpg").disponible(true).categoria(catPizzas).build();

                Producto p4 = Producto.builder().nombre("Hamburguesa Clásica").precio(3800.0).descripcion("Medallón de carne, lechuga, tomate, cebolla y mayo").stock(30).imagen("hamburguesa-clasica.png").disponible(true).categoria(catHamburguesas).build();
                Producto p5 = Producto.builder().nombre("Hamburguesa BBQ Bacon").precio(5100.0).descripcion("Doble medallón, bacon crocante y salsa barbacoa ahumada").stock(25).imagen("hamburguesa-bbq-bacon.png").disponible(true).categoria(catHamburguesas).build();
                Producto p6 = Producto.builder().nombre("Hamburguesa Veggie").precio(4200.0).descripcion("Medallón de lentejas y garbanzo, cheddar vegano y rúcula").stock(0).imagen("hamburguesa-veggie.png").disponible(false).categoria(catHamburguesas).build();

                Producto p7 = Producto.builder().nombre("Coca-Cola 500ml").precio(1200.0).descripcion("Gaseosa Coca-Cola fría, botella personal").stock(100).imagen("coca-500-ml.png").disponible(true).categoria(catBebidas).build();
                Producto p8 = Producto.builder().nombre("Jugo de Naranja Natural").precio(1800.0).descripcion("Jugo exprimido en el momento, vaso 400ml").stock(40).imagen("jugo-naranja.png").disponible(true).categoria(catBebidas).build();
                Producto p9 = Producto.builder().nombre("Agua Mineral 500ml").precio(800.0).descripcion("Agua mineral sin gas, botella personal").stock(150).imagen("agua-mineral-500-ml.png").disponible(true).categoria(catBebidas).build();

                Producto p10 = Producto.builder().nombre("Torta Rogel").precio(3500.0).descripcion("Torta rogel tradicional con dulce de leche y merengue").stock(12).imagen("torta-rogel.png").disponible(true).categoria(catPostres).build();
                Producto p11 = Producto.builder().nombre("Helado Artesanal 2 gustos").precio(2800.0).descripcion("Pote de 250g, elegí 2 gustos entre 12 opciones").stock(30).imagen("helado-artesanal.png").disponible(true).categoria(catPostres).build();
                Producto p12 = Producto.builder().nombre("Brownie con Helado").precio(2200.0).descripcion("Brownie de chocolate tibio con bocha de vainilla").stock(0).imagen("brownie-helado.png").disponible(false).categoria(catPostres).build();

                Producto p13 = Producto.builder().nombre("Empanadas de Carne x6").precio(3000.0).descripcion("Empanadas criollas de carne cortada a cuchillo, horneadas").stock(50).imagen("empanadas-carne.png").disponible(true).categoria(catEmpanadas).build();
                Producto p14 = Producto.builder().nombre("Empanadas de Pollo x6").precio(2800.0).descripcion("Empanadas de pollo con morrón y verdeo, horneadas").stock(45).imagen("empanadas-pollo.png").disponible(true).categoria(catEmpanadas).build();
                Producto p15 = Producto.builder().nombre("Empanadas de Jamón y Queso x6").precio(2500.0).descripcion("Empanadas fritas con jamón cocido y queso fundido").stock(60).imagen("empanadas-jamon-queso.png").disponible(true).categoria(catEmpanadas).build();

                Producto p16 = Producto.builder().nombre("Ensalada César").precio(3200.0).descripcion("Lechuga romana, crutones, parmesano y aderezo césar").stock(20).imagen("ensalada-cesar.png").disponible(true).categoria(catEnsaladas).build();
                Producto p17 = Producto.builder().nombre("Ensalada Caprese").precio(2900.0).descripcion("Tomate, muzzarella fresca, albahaca y aceite de oliva").stock(18).imagen("ensalada-caprese.png").disponible(true).categoria(catEnsaladas).build();
                Producto p18 = Producto.builder().nombre("Pizza Fugazzeta").precio(5500.0).descripcion("Pizza rellena de muzzarella con cebolla caramelizada").stock(10).imagen("pizza-fugazetta.png").disponible(true).categoria(catPizzas).build();
                Producto p19 = Producto.builder().nombre("Hamburguesa Crispy Chicken").precio(4600.0).descripcion("Pollo apanado crocante, coleslaw y salsa honey mustard").stock(0).imagen("hamburguesa-crispy-chicken.png").disponible(false).categoria(catHamburguesas).build();
                Producto p20 = Producto.builder().nombre("Ensalada Mixta").precio(2400.0).descripcion("Lechuga, tomate, zanahoria rallada y aceitunas").stock(25).imagen("ensalada-mixta.png").disponible(true).categoria(catEnsaladas).build();

                productoRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20));
                log.info("Carga inicial: Se sembraron los 20 productos del catálogo exitosamente.");
            }
        } else {
            log.info("Carga inicial: El catálogo e inventarios ya contienen datos en MySQL.");
        }
    }
}