
// Importar funciones de validación
import {
    validarNombre,
    validarCorreo,
    validarNacimiento,
    validarPais,
    validarPassword,
    validarConfirmacion,
    validarTerminos
} from "./validaciones.js";

// Importar funciones de mensajes
import {
    mostrarError,
    limpiarErrores
} from "./mensajes.js";

// Obtener el formulario
const formulario = document.getElementById("formRegistro");

// Escuchar el envío del formulario
formulario.addEventListener("submit", function(event) 
{

    // Evitar el envio automático
    event.preventDefault();

    // Limpiar errores anteriores
    limpiarErrores();

    // Obtener los datos del formulario
    const datos = new FormData(formulario);

    const nombre = datos.get("nombre").trim();
    const correo = datos.get("correo").trim();
    const nacimiento = datos.get("nacimiento");
    const pais = datos.get("pais");
    const password = datos.get("password");
    const confirmar = datos.get("password-confirmar");
    const terminos = datos.has("terminos");

    // Ejecutar las validaciones
    const errorNombre = validarNombre(nombre);
    const errorCorreo = validarCorreo(correo);
    const errorNacimiento = validarNacimiento(nacimiento);
    const errorPais = validarPais(pais);
    const errorPassword = validarPassword(password);
    const errorConfirmar = validarConfirmacion(
        password,
        confirmar
    );
    const errorTerminos = validarTerminos(terminos);

    // Mostrar mensajes de error
    mostrarError("error-nombre", errorNombre);
    mostrarError("error-correo", errorCorreo);
    mostrarError("error-nacimiento", errorNacimiento);
    mostrarError("error-pais", errorPais);
    mostrarError("error-contrasenia", errorPassword);
    mostrarError("error-confirmar-contrasenia", errorConfirmar);
    mostrarError("error-terminos", errorTerminos);

    // Comprobar si existe algun error
    if (
        errorNombre ||
        errorCorreo ||
        errorNacimiento ||
        errorPais ||
        errorPassword ||
        errorConfirmar ||
        errorTerminos
    ) {
        return;
    }

    // Si todas las validaciones son correctas
    console.log("Registro válido");
    console.log("Datos del usuario:", Object.fromEntries(datos));

});
