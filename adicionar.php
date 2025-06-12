<?php
header('Content-Type: application/json');
include 'conexao.php';
session_start();

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = $_POST['titulo'] ?? '';
    $tipo = $_POST['tipo'] ?? '';
    $ingredientes = $_POST['ingredientes'] ?? '';
    $modo_preparo = $_POST['modo_preparo'] ?? '';
    $imagemNome = '';

    if (!empty($_POST['imagem_url'])) {
        $url = trim($_POST['imagem_url']);
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            $url = explode('http', $url);
            $imagemNome = 'http' . $url[1];
        } else {
            echo json_encode(['success' => false, 'message' => 'URL da imagem inválida']);
            exit;
        }
    } elseif (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === 0) {
        $ext = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
        $nomeArquivo = uniqid('receita_', true) . '.' . $ext;
        $caminho = 'img/' . $nomeArquivo;

        if (!move_uploaded_file($_FILES['imagem']['tmp_name'], $caminho)) {
            echo json_encode(['success' => false, 'message' => 'Erro ao salvar imagem no servidor']);
            exit;
        }
        $imagemNome = $caminho;
    } else {
        echo json_encode(['success' => false, 'message' => 'Nenhuma imagem fornecida']);
        exit;
    }

    $usuario_id = $_SESSION['usuario_id'];
    $stmt = $conn->prepare("INSERT INTO receitas (titulo, tipo, ingredientes, preparo, imagem, usuario_id) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssi", $titulo, $tipo, $ingredientes, $modo_preparo, $imagemNome, $usuario_id);

    echo $stmt->execute()
        ? json_encode(['success' => true])
        : json_encode(['success' => false, 'message' => $stmt->error]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método inválido']);
}
