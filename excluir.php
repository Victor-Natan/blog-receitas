<?php
session_start();
header("Content-Type: application/json");

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
  echo json_encode(["sucesso" => false, "mensagem" => "Usuário não autenticado."]);
  exit;
}

// Verifica se o ID foi fornecido
if (!isset($_GET['id'])) {
  echo json_encode(["sucesso" => false, "mensagem" => "ID da receita não fornecido."]);
  exit;
}

$usuario_id = $_SESSION['usuario_id'];
$id = intval($_GET['id']);

$conn = new mysqli("localhost", "root", "", "receitas_db");
if ($conn->connect_error) {
  echo json_encode(["sucesso" => false, "mensagem" => "Erro na conexão com o banco de dados."]);
  exit;
}

// Exclui somente se a receita pertencer ao usuário logado
$stmt = $conn->prepare("DELETE FROM receitas WHERE id = ? AND usuario_id = ?");
$stmt->bind_param("ii", $id, $usuario_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
  echo json_encode(["sucesso" => true]);
} else {
  echo json_encode(["sucesso" => false, "mensagem" => "Receita não encontrada ou sem permissão para excluir."]);
}

$stmt->close();
$conn->close();
?>
