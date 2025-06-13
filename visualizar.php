<?php
header("Content-Type: application/json");

if (!isset($_GET['id'])) {
  echo json_encode(["erro" => true, "mensagem" => "ID não fornecido."]);
  exit;
}

$id = intval($_GET['id']);

$conn = new mysqli("localhost", "root", "", "receitas_db");
if ($conn->connect_error) {
  echo json_encode(["erro" => true, "mensagem" => "Erro na conexão com o banco de dados."]);
  exit;
}

$stmt = $conn->prepare("SELECT titulo, imagem, ingredientes, preparo FROM receitas WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo json_encode(["erro" => true, "mensagem" => "Receita não encontrada."]);
  exit;
}

$receita = $result->fetch_assoc();
echo json_encode($receita);
?>
