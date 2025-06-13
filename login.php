<?php
session_start();
header("Content-Type: application/json");

// Conecta ao banco de dados (certifique-se que sua conexão.php está incluída ou o código está aqui)
$conn = new mysqli("localhost", "root", "", "receitas_db");
if ($conn->connect_error) {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro na conexão com o banco de dados."]);
    exit;
}

// Supondo que você recebe email e senha do POST
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';

// 1. Busca o usuário pelo email
// SELECT id, nome, senha FROM usuarios WHERE email = ?
$stmt = $conn->prepare("SELECT id, nome, senha FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();
    // 2. Verifica a senha (usando password_verify para senhas com hash)
    if (password_verify($senha, $usuario['senha'])) { // AQUI É CRÍTICO PARA SENHAS HASHED
        // Login bem-sucedido: Armazena o ID E O NOME na sessão
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['nome']; // <-- ESTA É A LINHA CRÍTICA!
        echo json_encode(["sucesso" => true, "mensagem" => "Login realizado com sucesso!"]);
    } else {
        // Senha incorreta
        echo json_encode(["sucesso" => false, "mensagem" => "Email ou senha incorretos."]);
    }
} else {
    // Usuário não encontrado
    echo json_encode(["sucesso" => false, "mensagem" => "Email ou senha incorretos."]);
}

$stmt->close();
$conn->close();
?>