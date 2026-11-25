<?php

require_once "helpers.php";
require_once "db.php";

// Valida los datos que comparten el registro (POST) y la edición (PUT)
// Si algo está mal responde 422; si todo está bien devuelve los datos limpios
function validarUsuario(array $d): array
{
    $nombre = trim($d["nombre"] ?? "");
    $correo = trim($d["correo"] ?? "");
    $nacimiento = trim($d["nacimiento"] ?? "");
    $pais = trim($d["pais"] ?? "");
    $sistema = trim($d["sistema_operativo"] ?? "");

    if ($nombre === "" || $correo === "" || $nacimiento === "") {
        responder(422, ["error" => "Completa todos los campos obligatorios"]);
    }

    if (strlen($nombre) < 3 || strlen($nombre) > 50) {
        responder(422, ["error" => "El nombre debe tener entre 3 y 50 caracteres"]);
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL) || strlen($correo) > 100) {
        responder(422, ["error" => "El correo electrónico no es válido"]);
    }

    $fecha = DateTime::createFromFormat("!Y-m-d", $nacimiento);

    if (
        !$fecha ||
        $fecha->format("Y-m-d") !== $nacimiento ||
        $fecha > new DateTime("today")
    ) {
        responder(422, ["error" => "La fecha de nacimiento no es válida"]);
    }

    // la columna pais es CHAR(2)
    if ($pais !== "" && strlen($pais) !== 2) {
        responder(422, ["error" => "El país no es válido"]);
    }

    // la columna sistema_operativo es VARCHAR(30)
    if (strlen($sistema) > 30) {
        responder(422, ["error" => "El sistema operativo es demasiado largo"]);
    }

    return [
        $nombre,
        $correo,
        $nacimiento,
        $pais !== "" ? $pais : null,
        $sistema !== "" ? $sistema : null,
    ];
}

$metodo = $_SERVER["REQUEST_METHOD"];
$id = isset($_GET["id"]) ? (int) $_GET["id"] : null;

try {
    $pdo = conectar();

    switch ($metodo) {

        // ======================================
        // GET: leer usuarios (SELECT)
        // ======================================
        case "GET":

            // un usuario
            if ($id !== null) {
                $stmt = $pdo->prepare(
                    "SELECT id, username AS nombre, email AS correo,
                            nacimiento, pais, sistema_operativo
                     FROM users
                     WHERE id = :id"
                );
                $stmt->execute(["id" => $id]);
                $usuario = $stmt->fetch();

                if (!$usuario) {
                    responder(404, ["error" => "El usuario no existe"]);
                }
                responder(200, $usuario);
            }

            // todos los usuarios
            $stmt = $pdo->prepare(
                "SELECT id, username AS nombre, email AS correo,
                        nacimiento, pais, sistema_operativo
                 FROM users
                 ORDER BY id"
            );
            $stmt->execute();
            responder(200, $stmt->fetchAll());


        // ======================================
        // POST: registrar usuario (INSERT)
        // ======================================
        case "POST":
            $datos = leerJson();
            [$nombre, $correo, $nacimiento, $pais, $sistema] = validarUsuario($datos);

            $password = $datos["password"] ?? "";
            $confirmar = $datos["password_confirmar"] ?? "";
            $terminos = $datos["terminos"] ?? false;

            if ($password === "" || $confirmar === "") {
                responder(422, ["error" => "Completa todos los campos obligatorios"]);
            }

            if (strlen($password) < 8) {
                responder(422, ["error" => "La contraseña debe tener al menos 8 caracteres"]);
            }

            if ($password !== $confirmar) {
                responder(422, ["error" => "Las contraseñas no coinciden"]);
            }

            if ($terminos !== true) {
                responder(422, ["error" => "Debes aceptar los términos y condiciones"]);
            }

            try {
                $stmt = $pdo->prepare(
                    "INSERT INTO users (username, email, password_hash, nacimiento, pais, sistema_operativo)
                     VALUES (:nombre, :correo, :password, :nacimiento, :pais, :sistema)"
                );
                $stmt->execute([
                    "nombre" => $nombre,
                    "correo" => $correo,
                    "password" => password_hash($password, PASSWORD_DEFAULT),
                    "nacimiento" => $nacimiento,
                    "pais" => $pais,
                    "sistema" => $sistema,
                ]);
            } catch (PDOException $e) {
                if ($e->getCode() === "23000") {   // correo o nombre duplicado (UNIQUE)
                    responder(409, ["error" => "Ya existe un usuario con ese correo o ese nombre"]);
                }
                throw $e;
            }

            // nunca se devuelve la contraseña
            responder(201, [
                "mensaje" => "Usuario registrado correctamente",
                "usuario" => [
                    "id" => (int) $pdo->lastInsertId(),
                    "nombre" => $nombre,
                    "correo" => $correo,
                    "nacimiento" => $nacimiento,
                    "pais" => $pais,
                    "sistema_operativo" => $sistema,
                ],
            ]);


        // ======================================
        // PUT: actualizar usuario (UPDATE)
        // ======================================
        case "PUT":
            if ($id === null) {
                responder(400, ["error" => "Falta el id"]);
            }

            [$nombre, $correo, $nacimiento, $pais, $sistema] = validarUsuario(leerJson());

            // se verifica que exista antes de actualizar
            $existe = $pdo->prepare("SELECT id FROM users WHERE id = :id");
            $existe->execute(["id" => $id]);

            if (!$existe->fetch()) {
                responder(404, ["error" => "El usuario no existe"]);
            }

            try {
                $stmt = $pdo->prepare(
                    "UPDATE users
                     SET username = :nombre, email = :correo, nacimiento = :nacimiento,
                         pais = :pais, sistema_operativo = :sistema
                     WHERE id = :id"
                );
                $stmt->execute([
                    "nombre" => $nombre,
                    "correo" => $correo,
                    "nacimiento" => $nacimiento,
                    "pais" => $pais,
                    "sistema" => $sistema,
                    "id" => $id,
                ]);
            } catch (PDOException $e) {
                if ($e->getCode() === "23000") {
                    responder(409, ["error" => "Ya existe un usuario con ese correo o ese nombre"]);
                }
                throw $e;
            }

            responder(200, [
                "id" => $id,
                "nombre" => $nombre,
                "correo" => $correo,
                "nacimiento" => $nacimiento,
                "pais" => $pais,
                "sistema_operativo" => $sistema,
            ]);


        // ======================================
        // DELETE: eliminar usuario (DELETE)
        // ======================================
        case "DELETE":
            if ($id === null) {
                responder(400, ["error" => "Falta el id"]);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
                $stmt->execute(["id" => $id]);
            } catch (PDOException $e) {
                if ($e->getCode() === "23000") {   // llave foránea: tiene pedidos
                    responder(409, ["error" => "El usuario tiene pedidos y no se puede eliminar"]);
                }
                throw $e;
            }

            if ($stmt->rowCount() === 0) {
                responder(404, ["error" => "El usuario no existe"]);
            }

            http_response_code(204);   // éxito sin cuerpo
            exit;


        // ======================================
        // Método no permitido
        // ======================================
        default:
            header("Allow: GET, POST, PUT, DELETE");
            responder(405, ["error" => "Método HTTP no permitido"]);
    }

} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(500, ["error" => "Error interno del servidor"]);
}