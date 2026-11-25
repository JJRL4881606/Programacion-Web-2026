<?php
function conectar(): PDO
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $config = require __DIR__ . '/config.php';
    $dsn = "mysql:host={$config['host']};port={$config['port']};"
         . "dbname={$config['db']};charset=utf8mb4";

    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    return $pdo;
}