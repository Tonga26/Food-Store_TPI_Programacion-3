/* ============================================================================
   SECCIÓN 1: IMPORTACIONES Y DEPENDENCIAS
   ============================================================================ */
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";
import { saveUser } from "../../../utils/localStorage";
import { mostrarToast } from "../../../utils/toast";
import { apiFetch } from "../../../utils/api";

/* ============================================================================
   SECCIÓN 2: REFERENCIAS AL DOM
   ============================================================================ */
const formLogin = document.getElementById("login-form") as HTMLFormElement | null;

/* ============================================================================
   SECCIÓN 3: CONTROLADOR DE EVENTO Y VALIDACIÓN CONTRA EL BACKEND
   ============================================================================ */
formLogin?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    
    console.log("1. Formulario interceptado. Capturando inputs...");

    const emailElement = document.getElementById("email") as HTMLInputElement | null;
    const passwordElement = document.getElementById("password") as HTMLInputElement | null;

    if (!emailElement || !passwordElement) {
        console.error("Fallo CRÍTICO: No se encontraron los IDs 'email' o 'password' en el HTML.");
        mostrarToast("Error interno: Revisa la consola.");
        return;
    }

    const payload = {
        email: emailElement.value.trim(),
        password: passwordElement.value.trim()
    };
    
    console.log("2. Datos empaquetados para enviar:", payload);

    try {
        console.log("3. Enviando petición a Spring Boot...");
        const usuarioLogueado = await apiFetch("/users/login", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        console.log("4. Respuesta exitosa del servidor:", usuarioLogueado);

        const sesionUsuario = {
            id: String(usuarioLogueado.id),
            nombre: usuarioLogueado.nombre,
            apellido: usuarioLogueado.apellido,
            email: usuarioLogueado.email,
            celular: usuarioLogueado.celular,
            role: usuarioLogueado.rol === "ADMIN" ? "admin" : "client" as Rol,
            loggedIn: true,
            password: ""
        };

        saveUser(sesionUsuario);
        mostrarToast(`✅ Bienvenido de vuelta, ${usuarioLogueado.nombre}`);

        setTimeout(() => {
            if (sesionUsuario.role === "admin") {
                navigate("/src/pages/admin/adminHome/admin.html");
            } else {
                navigate("/src/pages/store/home/home.html");
            }
        }, 1500);

    } catch (error: any) {
        console.error("Error capturado en el bloque catch:", error);
        mostrarToast(`❌ Error: ${error.message || "Credenciales incorrectas."}`);
    }
});