import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { saveUserToDatabase } from "../../../utils/localStorage";

const formRegistro = document.getElementById("registro-form") as HTMLFormElement;

formRegistro.addEventListener("submit", (event: Event) =>{
    
    event.preventDefault();

    const nombreInput = (document.getElementById("nombre") as HTMLInputElement).value;
    const apellidoInput = (document.getElementById("apellido") as HTMLInputElement).value;
    const emailInput = (document.getElementById("email") as HTMLInputElement).value;
    const celularInput = (document.getElementById("celular") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;
    
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

    saveUserToDatabase(nuevoUsuario);

    alert("¡Registro exitoso! Ya podés iniciar sesión.");

    window.location.href = "/src/pages/auth/login/login.html";
})