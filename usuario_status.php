<?php
// usuario_status.php  —  devolve o estado de login em JSON
header('Content-Type: application/json');
session_start();

if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'logado'   => true,
        'usuario'  => $_SESSION['usuario_nome'] ?? 'Usuário', // opcional
        'id'       => $_SESSION['usuario_id']
    ]);
} else {
    echo json_encode(['logado' => false]);
}
