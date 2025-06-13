<?php
header("Content-Type: application/json");
session_start();
include 'conexao.php';

// Campos obrigatórios
$campos = ["id", "titulo", "tipo", "ingredientes", "preparo"];
foreach ($campos as $campo) {
  if (!isset($_POST[$campo]) || empty(trim($_POST[$campo]))) {
    echo json_encode(["sucesso" => false, "mensagem" => "Campo '$campo' é obrigatório."]);
    exit;
  }
}

$id = intval($_POST['id']);
$titulo = trim($_POST['titulo']);
$tipo = trim($_POST['tipo']);
$ingredientes = trim($_POST['ingredientes']);
$preparo = trim($_POST['preparo']);
$imagemFinal = "";

if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === 0) {
  $ext = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
  $imagemNome = uniqid('receita_', true) . "." . $ext;
  $destino = "img/" . $imagemNome;

  if (!move_uploaded_file($_FILES['imagem']['tmp_name'], $destino)) {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro ao salvar imagem."]);
    exit;
  }

  $imagemFinal = $destino;
} elseif (!empty($_POST['imagem_url'])) {
  $imagemFinal = trim($_POST['imagem_url']);
} else {
  echo json_encode(["sucesso" => false, "mensagem" => "É necessário fornecer uma imagem (upload ou URL)."]);
  exit;
}

$stmt = $conn->prepare("UPDATE receitas SET titulo = ?, imagem = ?, tipo = ?, ingredientes = ?, preparo = ? WHERE id = ?");
$stmt->bind_param("sssssi", $titulo, $imagemFinal, $tipo, $ingredientes, $preparo, $id);

if ($stmt->execute()) {
  echo json_encode(["sucesso" => true]);
} else {
  echo json_encode(["sucesso" => false, "mensagem" => "Erro ao atualizar a receita."]);
}

$stmt->close();
$conn->close();
?>
