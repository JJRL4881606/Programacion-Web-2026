// Validaciones del formulario de registro

export function validarNombre(nombre) {
    if (!nombre) {
        return "El nombre completo es obligatorio.";
    }

    if (nombre.length < 3) {
        return "El nombre debe tener al menos 3 caracteres.";
    }

    return "";
}

export function validarCorreo(correo) {
    if (!correo) {
        return "El correo electrónico es obligatorio.";
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
        return "Introduce un correo electrónico válido.";
    }

    return "";
}

export function validarPais(pais) {
    if (!pais) {
        return "Debes seleccionar un país.";
    }

    return "";
}

export function validarNacimiento(nacimiento) {

    if (!nacimiento || nacimiento.trim() === "") {
        return "La fecha de nacimiento es obligatoria.";
    }

    const fecha = new Date(nacimiento + "T00:00:00");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha > hoy) {
        return "La fecha de nacimiento no puede ser futura.";
    }

    return "";
}

export function validarPassword(password) {
    if (!password) {
        return "La contraseña es obligatoria.";
    }

    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }

    return "";
}

export function validarConfirmacion(password, confirmar) {
    if (!confirmar) {
        return "Debes confirmar tu contraseña.";
    }

    if (password !== confirmar) {
        return "Las contraseñas no coinciden.";
    }

    return "";
}

export function validarTerminos(aceptados) {
    if (!aceptados) {
        return "Debes aceptar los términos y condiciones.";
    }

    return "";
}
