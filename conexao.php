
<?php
$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "receitas_db";
$conn = new mysqli($host, $usuario, $senha, $banco);
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
