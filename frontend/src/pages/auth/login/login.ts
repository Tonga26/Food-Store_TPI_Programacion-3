import { navigate } from "../../../utils/navigate";
import { getAllUsers, saveUser } from "../../../utils/localStorage";
import { mostrarToast } from "../../../utils/toast";

// Seleccionamos el formulario del DOM
const formLogin = document.getElementById("login-form") as HTMLFormElement;

// Le agregamos un evento que valide los datos ingresados (email y password)
formLogin.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  // Obtenemos los valores ingresados en los input email y password
  const inputEmail = (document.getElementById("email") as HTMLInputElement).value;
  const inputPassword = (document.getElementById("password") as HTMLInputElement).value;

  // 1. Obtenemos TODOS los usuarios registrados en la base de datos (el array "users")
  const usersArray = getAllUsers();

  // Si el array está vacío, significa que el sistema está en cero
  if (usersArray.length === 0) {
    mostrarToast("⚠️ No se encontró ninguna cuenta. Por favor, regístrate primero.");
    return;
  }

  // 2. Buscamos en el array si hay algún usuario con ese email y esa contraseña
  const foundUser = usersArray.find(
    (user) => user.email === inputEmail && user.password === inputPassword
  );

  // 3. Validamos el resultado de la búsqueda
  if (foundUser) {

    // Si el usuario existe y las credenciales coinciden, lo activamos
    foundUser.loggedIn = true;

    // Guardamos ESTE usuario específico en la caja fuerte de sesión ("userData")
    saveUser(foundUser);

    mostrarToast(`✅ Bienvenido de vuelta, ${foundUser.nombre} ${foundUser.apellido}`);

    // Verificamos el rol que tiene el usuario logueado, y redirigimos automáticamente
    setTimeout(() => {
      if (foundUser.role === "admin") {
        navigate("/src/pages/admin/adminHome/admin.html");
      } else {
        navigate("/src/pages/store/home/home.html");
      }
    }, 1500);

  } else {
    // Si la búsqueda no encontró a nadie, los datos son erróneos
    mostrarToast("❌ El email o la contraseña son incorrectos. Intentá nuevamente.");
  }
});
