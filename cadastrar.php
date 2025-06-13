
<?php
include 'conexao.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$senha = $data['senha'] ?? '';
$response = ['success' => false];
if($email && $senha){
    $sql = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $senha);
    if($stmt->execute()){
        $response['success'] = true;
    } else {
        $response['message'] = "Erro ao cadastrar: " . $conn->error;
    }
} else {
    $response['message'] = "Dados incompletos.";
}
echo json_encode($response);
?>
