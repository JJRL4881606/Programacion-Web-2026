<?php

function responder($codigo, $datos) 
{
    http_response_code($codigo);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT  );
    exit;
}

