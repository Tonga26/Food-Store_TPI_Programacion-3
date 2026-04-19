// 1- LÓGICA DEL CONTENEDOR DE NOTIFICACIONES
const getToastContainer = (): HTMLDivElement => {
    let container = document.querySelector(".toast-container") as HTMLDivElement;
    
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    
    return container;
};

// 2- FUNCIÓN PRINCIPAL PARA MOSTRAR EL MENSAJE
export const mostrarToast = (mensaje: string) => {
    const container = getToastContainer();
    
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = mensaje;
    
    container.appendChild(toast);
    
    // 3- LÓGICA DE DESAPARICIÓN Y LIMPIEZA
    setTimeout(() => {
        toast.classList.add("fade-out");
        
        setTimeout(() => {
            toast.remove();
        }, 300); 
    }, 3000); 
};