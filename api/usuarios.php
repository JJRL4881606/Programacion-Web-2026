
<?php

require_once "helpers.php";

// Rutas de los archivos
$archivoInicial = __DIR__ . "/data/usuarios.php";
$archivoJson = __DIR__ . "/data/usuarios.json";

// Cargar usuarios iniciales
$usuariosIniciales = require $archivoInicial;

// Leer usuarios registrados
$contenido = file_get_contents($archivoJson);

$usuariosNuevos = json_decode($contenido, true);

if (!is_array($usuariosNuevos)) {
    $usuariosNuevos = [];
}

// Combinar los usuarios
$usuarios = array_merge(
    $usuariosIniciales,
    $usuariosNuevos
);

// Método HTTP recibido
$metodo = $_SERVER["REQUEST_METHOD"];


// ======================================
// GET: Consultar usuarios
// ======================================

if ($metodo === "GET") {

    // Consultar usuario por ID
    if (isset($_GET["id"])) {

        $id = filter_var($_GET["id"], FILTER_VALIDATE_INT);

        if ($id === false || $id === null || $id <= 0) {
            responder(404, [
                "error" => "El usuario no existe"
            ]);
        }

        foreach ($usuarios as $usuario) {

            if ($usuario["id"] == $id) {

                unset($usuario["password"]);

                responder(200, $usuario);
            }
        }

        responder(404, [
            "error" => "El usuario no existe"
        ]);
    }

    // Devolver todos los usuarios
    // Ocultar contraseñas de todos los usuarios
    foreach ($usuarios as &$usuario) {
        unset($usuario["password"]);
    }

    unset($usuario);

    responder(200, $usuarios);
}


// ======================================
// POST: Registrar usuario
// ======================================

if ($metodo === "POST") {

    // Recibir JSON
    $datos = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($datos)) {
        responder(422, [
            "error" => "Los datos enviados no son JSON válido"
        ]);
    }

    // Obtener campos
    $nombre = trim($datos["nombre"] ?? "");
    $correo = trim($datos["correo"] ?? "");
    $nacimiento = trim($datos["nacimiento"] ?? "");
    $pais = trim($datos["pais"] ?? "");
    $sistema = trim($datos["sistema_operativo"] ?? "");

    $password = $datos["password"] ?? "";
    $confirmar = $datos["password_confirmar"] ?? "";
    $terminos = $datos["terminos"] ?? false;


    // VALIDACIÓN 1: Campos obligatorios
    if (
        $nombre === "" ||
        $correo === "" ||
        $nacimiento === "" ||
        $password === "" ||
        $confirmar === ""
    ) {
        responder(422, [
            "error" => "Completa todos los campos obligatorios"
        ]);
    }


    // VALIDACIÓN 2: Nombre mínimo de 3 caracteres
    if (strlen($nombre) < 3) {
        responder(422, [
            "error" => "El nombre debe tener al menos 3 caracteres"
        ]);
    }


    // VALIDACIÓN 3: Correo válido
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        responder(422, [
            "error" => "El correo electrónico no es válido"
        ]);
    }


    // VALIDACIÓN 4: Fecha válida
    $fecha = DateTime::createFromFormat("!Y-m-d", $nacimiento);

    if (
        !$fecha ||
        $fecha->format("Y-m-d") !== $nacimiento ||
        $fecha > new DateTime("today")
    ) {
        responder(422, [
            "error" => "La fecha de nacimiento no es válida"
        ]);
    }


    // VALIDACIÓN 5: Contraseña
    if (strlen($password) < 8) {
        responder(422, [
            "error" => "La contraseña debe tener al menos 8 caracteres"
        ]);
    }


    // VALIDACIÓN 6: Confirmar contraseña
    if ($password !== $confirmar) {
        responder(422, [
            "error" => "Las contraseñas no coinciden"
        ]);
    }


    // VALIDACIÓN 7: Aceptar términos
    if ($terminos !== true) {
        responder(422, [
            "error" => "Debes aceptar los términos y condiciones"
        ]);
    }


    // VALIDACIÓN 8: Correo duplicado
    foreach ($usuarios as $usuario) {

        if (strtolower($usuario["correo"]) === strtolower($correo)) {

            responder(422, [
                "error" => "Este correo electrónico ya está registrado"
            ]);
        }
    }


    // ======================================
    // Crear nuevo usuario
    // ======================================

    // Buscar el último ID
    $ultimoId = 0;

    foreach ($usuarios as $usuario) {
        $ultimoId = max($ultimoId, (int)$usuario["id"]);
    }

    // Crear registro
    $nuevoUsuario = [
        "id" => $ultimoId + 1,
        "nombre" => $nombre,
        "correo" => $correo,
        "nacimiento" => $nacimiento,
        "pais" => $pais,
        "sistema_operativo" => $sistema,
        "password" => password_hash($password, PASSWORD_DEFAULT)
    ];


    // Guardar en JSON
    $usuariosNuevos[] = $nuevoUsuario;

    $resultado = file_put_contents(
        $archivoJson,
        json_encode(
            $usuariosNuevos,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
        ),
        LOCK_EX
    );

    if ($resultado === false) {
        responder(500, [
            "error" => "No se pudo guardar el usuario"
        ]);
    }


    // Respuesta exitosa
    // Nunca devolver la contraseña
    unset($nuevoUsuario["password"]);

    responder(201, [
        "mensaje" => "Usuario registrado correctamente",
        "usuario" => $nuevoUsuario
    ]);
}


// ======================================
// Método no permitido
// ======================================

header("Allow: GET, POST");

responder(405, [
    "error" => "Método HTTP no permitido"
]);

