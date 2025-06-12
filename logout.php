<?php
// logout.php - Atualizado para retornar JSON
header('Content-Type: application/json');
session_start();

// Remove todas as variáveis de sessão
$_SESSION = [];

// Destroi a sessão
session_destroy();

// Retorna resposta JSON
echo json_encode([
    'sucesso' => true,
    'mensagem' => 'Logout realizado com sucesso'
]);
exit;
?>
