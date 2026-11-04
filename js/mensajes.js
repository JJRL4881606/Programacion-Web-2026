
// Funciones para mostrar y limpiar mensajes de error

export function mostrarError(id, mensaje) {
    const elemento = document.getElementById(id);

    elemento.textContent = mensaje;
}

export function limpiarErrores() {
    const errores = document.querySelectorAll(".error");

    errores.forEach(error => {
        error.textContent = "";
    });
}
