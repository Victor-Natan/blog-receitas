
<?php
include 'conexao.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
$tipo = $_GET['tipo'] ?? '';
if($tipo){
    $sql = "SELECT * FROM receitas WHERE tipo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $tipo);
} else {
    $sql = "SELECT * FROM receitas";
    $stmt = $conn->prepare($sql);
}
$stmt->execute();
$result = $stmt->get_result();
$receitas = [];
while($row = $result->fetch_assoc()){
    $receitas[] = $row;
}
echo json_encode($receitas);
?>
