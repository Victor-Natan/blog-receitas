<?php
header("Content-Type: application/json");

// Verifica se os dados foram enviados
if (!isset($_POST['nome'], $_POST['email'], $_POST['senha'])) {
  echo json_encode(["sucesso" => false, "mensagem" => "Todos os campos são obrigatórios."]);
  exit;
}

$nome = trim($_POST['nome']);
$email = trim($_POST['email']);
$senha = trim($_POST['senha']);

// Validação básica
if (empty($nome) || empty($email) || empty($senha)) {
  echo json_encode(["sucesso" => false, "mensagem" => "Preencha todos os campos."]);
  exit;
}

// Conecta ao banco de dados
$conn = new mysqli("localhost", "root", "", "receitas_db");
if ($conn->connect_error) {
  echo json_encode(["sucesso" => false, "mensagem" => "Erro na conexão com o banco de dados."]);
  exit;
}

// Verifica se o email já está cadastrado
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
  echo json_encode(["sucesso" => false, "mensagem" => "Email já cadastrado."]);
  $stmt->close();
  $conn->close();
  exit;
}
$stmt->close();

// Criptografa a senha
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Insere novo usuário
$stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nome, $email, $senha_hash);

if ($stmt->execute()) {
  echo json_encode(["sucesso" => true]);
} else {
  echo json_encode(["sucesso" => false, "mensagem" => "Erro ao cadastrar usuário."]);
}

$stmt->close();
$conn->close();
?>
