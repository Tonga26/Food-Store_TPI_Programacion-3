// SECCIÓN 1: CONFIGURACIÓN BASE Y VARIABLES GLOBALES
export const API_URL = "http://localhost:8080/api";

// SECCIÓN 2: FUNCIÓN ENVOLTORIO (WRAPPER) PARA FETCH
export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    } as Record<string, string>;

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
        
    } catch (error) {
        console.error(`[apiFetch] Fallo en la petición a ${endpoint}:`, error);
        throw error;
    }
};