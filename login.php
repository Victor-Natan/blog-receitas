<?php
session_start();
header("Content-Type: application/json");

// Verifica se os dados foram enviados
if (!isset($_POST['email']) || !isset($_POST['senha'])) {
  echo json_encode(["sucesso" => false, "mensagem" => "Dados incompletos."]);
  exit;
}

$email = trim($_POST['email']);
$senha = trim($_POST['senha']);

// Conecta ao banco
$conn = new mysqli("localhost", "root", "", "receitas_db");
if ($conn->connect_error) {
  echo json_encode(["sucesso" => false, "mensagem" => "Erro de conexão com o banco de dados."]);
  exit;
}

// Busca o usuário pelo email
$stmt = $conn->prepare("SELECT id, senha FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo json_encode(["sucesso" => false, "mensagem" => "Email não encontrado."]);
  exit;
}

$usuario = $result->fetch_assoc();

// Verifica a senha
if (!password_verify($senha, $usuario['senha'])) {
  echo json_encode(["sucesso" => false, "mensagem" => "Senha incorreta."]);
  exit;
}

// Login bem-sucedido
$_SESSION['usuario_id'] = $usuario['id'];

echo json_encode(["sucesso" => true]);

$stmt->close();
$conn->close();
?>
