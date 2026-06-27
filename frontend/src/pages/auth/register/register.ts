/* ============================================================================
   SECCIÓN 1: IMPORTACIONES Y DEPENDENCIAS
   ============================================================================ */
import type { Rol } from "../../../types/Rol";
import { saveUser } from "../../../utils/localStorage";
import { mostrarToast } from "../../../utils/toast";
import { apiFetch } from "../../../utils/api";
import { navigate } from "../../../utils/navigate";

/* ============================================================================
   SECCIÓN 2: REFERENCIAS AL DOM
   ============================================================================ */
const formRegistro = document.getElementById("registro-form") as HTMLFormElement | null;

/* ============================================================================
   SECCIÓN 3: CONTROLADOR DE EVENTO Y ENVÍO AL BACKEND
   ============================================================================ */
formRegistro?.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const nombreInput = (document.getElementById("nombre") as HTMLInputElement).value.trim();
    const apellidoInput = (document.getElementById("apellido") as HTMLInputElement).value.trim();
    const emailInput = (document.getElementById("email") as HTMLInputElement).value.trim();
    const celularInput = (document.getElementById("celular") as HTMLInputElement).value.trim();
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value.trim();

    const payload = {
        nombre: nombreInput,
        apellido: apellidoInput,
        email: emailInput,
        celular: celularInput || undefined,
        password: passwordInput
    };

    try {
        const nuevoUsuario = await apiFetch("/users", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        mostrarToast("✅ ¡Registro exitoso! Iniciando sesión automáticamente...");

        const sesionUsuario = {
            id: String(nuevoUsuario.id),
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            email: nuevoUsuario.email,
            celular: nuevoUsuario.celular,
            role: nuevoUsuario.rol === "ADMIN" ? "admin" : "client" as Rol,
            loggedIn: true,
            password: "" 
        };

        saveUser(sesionUsuario);

        setTimeout(() => {
            navigate("/src/pages/store/home/home.html");
        }, 1500);

    } catch (error: any) {
        mostrarToast(`❌ Error: ${error.message || "No se pudo completar el registro."}`);
    }
});