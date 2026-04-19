import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { saveUserToDatabase } from "../../../utils/localStorage";
import { mostrarToast } from "../../../utils/toast";

// 1- CAPTURA EL FORMULARIO DE REGISTRO DESDE EL DOM
const formRegistro = document.getElementById("registro-form") as HTMLFormElement;

// 2- ESCUCHA EL ENVIO DEL FORMULARIO Y BLOQUEA EL RELOAD NATIVO
formRegistro.addEventListener("submit", (event: Event) =>{
    
    event.preventDefault();

    // 3- LEE LOS VALORES INGRESADOS EN LOS CAMPOS DEL FORMULARIO
    const nombreInput = (document.getElementById("nombre") as HTMLInputElement).value;
    const apellidoInput = (document.getElementById("apellido") as HTMLInputElement).value;
    const emailInput = (document.getElementById("email") as HTMLInputElement).value;
    const celularInput = (document.getElementById("celular") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;
    
    // 4- CONSTRUYE EL NUEVO USUARIO CON ROL CLIENT Y SESION DESACTIVADA
    const nuevoUsuario: IUser = {
        id: crypto.randomUUID(),
        nombre: nombreInput,
        apellido: apellidoInput,
        email: emailInput,
        celular: celularInput,
        password: passwordInput,
        role: "client" as Rol,
        loggedIn: false
    };

    // 5- GUARDA EL USUARIO EN LOCALSTORAGE Y MUESTRA CONFIRMACION
    saveUserToDatabase(nuevoUsuario);

    mostrarToast("✅ ¡Registro exitoso! Ya podés iniciar sesión.");

    // 6- REDIRIGE AL LOGIN DESPUES DE UN BREVE RETRASO
    setTimeout(() => {
        window.location.href = "/src/pages/auth/login/login.html";
    }, 1500);
})