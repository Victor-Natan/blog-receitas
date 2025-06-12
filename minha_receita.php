<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["erro" => true, "mensagem" => "Usuário não autenticado."]);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

$conn = new mysqli("localhost", "root", "", "receitas_db");
if ($conn->connect_error) {
    echo json_encode(["erro" => true, "mensagem" => "Erro de conexão com o banco de dados."]);
    exit;
}

$stmt = $conn->prepare("SELECT id, titulo, imagem, tipo, ingredientes FROM receitas WHERE usuario_id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$receitas = [];
while ($row = $result->fetch_assoc()) {
    if (isset($row['imagem']) && substr_count($row['imagem'], 'http') > 1) {
        $pos = strpos($row['imagem'], 'http', 1);
        $row['imagem'] = substr($row['imagem'], 0, $pos);
    }
    $receitas[] = $row;
}

echo json_encode(["erro" => false, "receitas" => $receitas]);

$stmt->close();
$conn->close();
