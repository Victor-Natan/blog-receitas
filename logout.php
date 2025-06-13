<?php
session_start();

// Destrói todas as variáveis de sessão
$_SESSION = array();

// Se for desejado destruir o cookie de sessão também.
// Nota: Isso irá invalidar a sessão e não apenas o cookie.
// Isto é útil se você usa cookies de sessão.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destrói a sessão
session_destroy();

// Verifica se a requisição é AJAX
// Isso é um truque. A forma mais robusta seria enviar um cabeçalho 'X-Requested-With: XMLHttpRequest' do JS.
// Mas para o seu caso, a lógica abaixo é suficiente.
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    // Requisição AJAX, responde com JSON
    header("Content-Type: application/json");
    echo json_encode(["sucesso" => true, "mensagem" => "Logout realizado com sucesso"]);
    exit; // Importante para parar a execução aqui
} else {
    // Não é uma requisição AJAX, redireciona diretamente
    header("Location: index.html");
    exit; // Importante para parar a execução aqui
}
?>