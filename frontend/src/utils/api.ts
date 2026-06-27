// SECCIÓN 1: CONFIGURACIÓN BASE Y VARIABLES GLOBALES
export const API_URL = "http://localhost:8080/api";

// SECCIÓN 2: FUNCIÓN ENVOLTORIO (WRAPPER) PARA FETCH
// Introducción: 'apiFetch' es una función asíncrona que estandariza todas las 
// peticiones al servidor. Configura automáticamente el formato JSON y maneja 
// los errores HTTP de forma centralizada sin necesidad de inyectar tokens JWT.
// ============================================================================

// 'export const apiFetch': Declara la función pública y constante.
// 'async (endpoint: string, options?: RequestInit = {})': Recibe la ruta final (ej. "/productos") y opciones de configuración HTTP (method, body, etc).
// ': Promise<any>': Retorna una Promesa que se resolverá con los datos del backend.
export const apiFetch = async (endpoint: string, options?: RequestInit = {}): Promise<any> => {
    
    // 'const headers': Define las cabeceras estándar de la petición.
    // '"Content-Type": "application/json"': Indica a Spring Boot que enviaremos y esperamos recibir datos en formato JSON.
    // '...options.headers': Combina las cabeceras por defecto con cualquier cabecera extra que se pase en las opciones.
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    } as Record<string, string>;

    try {
        // 'const response': Ejecuta la petición nativa fetch concatenando la URL base con el endpoint específico.
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // 'if (!response.ok)': Verifica si el código HTTP está fuera del rango de éxito (200-299).
        // Maneja errores como 400 Bad Request o 404 Not Found exigidos en las historias de usuario.
        if (!response.ok) {
            // 'const errorData': Intenta extraer el cuerpo del error (ErrorResponse o ValidationErrorResponse) enviado por el @RestControllerAdvice del backend.
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(errorMessage);
        }

        // 'if (response.status === 204)': Manejo especial para operaciones DELETE (Soft Delete) que retornan "204 No Content" sin cuerpo JSON.
        if (response.status === 204) {
            return null;
        }

        // 'return await response.json()': Parsea la respuesta JSON exitosa y la devuelve al controlador que hizo la llamada.
        return await response.json();
        
    } catch (error) {
        // 'console.error': Imprime el error en consola para debugging.
        console.error(`[apiFetch] Fallo en la petición a ${endpoint}:`, error);
        // 'throw error': Propaga el error para que sea capturado y mostrado visualmente (ej. un Toast) por la vista que originó la petición.
        throw error;
    }
};