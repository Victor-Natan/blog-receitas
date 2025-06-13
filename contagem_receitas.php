<?php
include 'conexao.php'; // Inclui seu arquivo de conexão com o banco de dados
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["erro" => true, "mensagem" => "Erro na conexão com o banco de dados."]);
    exit;
}

$contagens = [];

// Consulta para obter a contagem de receitas por tipo (categoria)
$sql = "SELECT tipo, COUNT(*) as total FROM receitas GROUP BY tipo";
$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Normaliza o nome da categoria para usar como chave (ex: 'massas' em vez de 'Massa')
        $contagens[strtolower($row['tipo'])] = $row['total'];
    }
}

// Consulta para obter a contagem total de receitas
$sqlTotal = "SELECT COUNT(*) as total_geral FROM receitas";
$resultTotal = $conn->query($sqlTotal);
$totalGeral = 0;
if ($resultTotal && $rowTotal = $resultTotal->fetch_assoc()) {
    $totalGeral = $rowTotal['total_geral'];
}

echo json_encode(["erro" => false, "contagens_categorias" => $contagens, "total_geral" => $totalGeral]);

$conn->close();
?>