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

// direccion de la api
const API_URL = "../api/usuarios.php";

// Mensaje general del registro
const mensaje = document.getElementById("mensaje-registro");

// Escuchar el envío del formulario
formulario.addEventListener("submit", async function(event) {

    // Evitar el envío automático
    event.preventDefault();

    // Limpiar errores anteriores
    limpiarErrores();

    mensaje.textContent = "";

    // Obtener los datos del formulario
    const datos = new FormData(formulario);

    const nombre = datos.get("nombre").trim();
    const correo = datos.get("correo").trim();
    const nacimiento = datos.get("nacimiento");
    const pais = datos.get("pais");
    const password = datos.get("password");
    const confirmar = datos.get("password-confirmar");
    const terminos = datos.has("terminos");

    // Obtener el sistema operativo
    const sistema = datos.get("sistema-operativo") || "";

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

    // Comprobar si existe algún error
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

    // Preparar los datos para enviar a PHP
    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        nacimiento: nacimiento,
        pais: pais,
        sistema_operativo: sistema,
        password: password,
        password_confirmar: confirmar,
        terminos: terminos
    };

    try {
        // Enviar los datos a la API
        const respuesta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(nuevoUsuario)

        });

        // Convertir respuesta a json
        const resultado = await respuesta.json();

        // La API respondió con un error
        if (!respuesta.ok) {
            // 4xx: la API explica qué pasó. 5xx: mensaje general
            mensaje.textContent = respuesta.status >= 500
                ? "Algo salió mal de nuestro lado. Inténtalo de nuevo en un momento."
                : resultado.error || "No pudimos completar el registro.";

            mensaje.style.color = "red";
            return;
        }

        // Mostrar mensaje de éxito
        mensaje.textContent = resultado.mensaje;

        mensaje.style.color = "green";

        // Limpiar formulario
        formulario.reset();

    } catch (error) {
        // Fallo inesperado (sin conexión, respuesta que no es JSON...)
        // El detalle técnico va a la consola, y el usuario ve un mensaje amigable
        console.error("Error en el registro:", error);

        mensaje.textContent = "No pudimos completar el registro. Inténtalo de nuevo más tarde.";

        mensaje.style.color = "red";
    }
});
