<?php
// Inclui o arquivo de conexão com o banco de dados
// (Verifique se 'conexao.php' existe e contém a lógica de conexão com $conn)
include 'conexao.php'; 

header("Content-Type: application/json"); // Define o tipo de conteúdo como JSON
header("Access-Control-Allow-Origin: *"); // Permite requisições de qualquer origem (útil para desenvolvimento)
header("Access-Control-Allow-Headers: Content-Type"); // Permite o cabeçalho Content-Type

// Verifica se o termo de busca foi enviado via GET
if (!isset($_GET['termo_busca']) || empty(trim($_GET['termo_busca']))) {
    // Se nenhum termo de busca for fornecido, retorna uma mensagem ou todas as receitas
    // Aqui, vamos retornar uma mensagem de erro ou uma lista vazia
    echo json_encode(["erro" => true, "mensagem" => "Termo de busca não fornecido."]);
    exit;
}

$termoBusca = trim($_GET['termo_busca']); // Pega o termo de busca e remove espaços em branco
$termoBusca = strtolower($termoBusca); // Converte para minúsculas para uma busca case-insensitive

// Prepara o termo de busca para ser usado com LIKE (adiciona os curingas %)
$termoBuscaLike = '%' . $termoBusca . '%';

// Prepara a consulta SQL para buscar no título, ingredientes ou preparo
// Usamos LOWER() nas colunas do banco de dados para comparar com o termo em minúsculas
$sql = "SELECT id, titulo, imagem, tipo, ingredientes, preparo FROM receitas 
        WHERE LOWER(titulo) LIKE ? 
        OR LOWER(ingredientes) LIKE ? 
        OR LOWER(preparo) LIKE ?";

$stmt = $conn->prepare($sql);

// Verifica se a preparação da query foi bem-sucedida
if ($stmt === false) {
    echo json_encode(["erro" => true, "mensagem" => "Erro na preparação da query: " . $conn->error]);
    exit;
}

// Associa os parâmetros (os 3 's' são para 3 strings)
$stmt->bind_param("sss", $termoBuscaLike, $termoBuscaLike, $termoBuscaLike);
$stmt->execute();
$result = $stmt->get_result();

$receitasEncontradas = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Limpeza de URL de imagem se necessário (como em minha_receita.php)
        if (isset($row['imagem']) && substr_count($row['imagem'], 'http') > 1) {
            $pos = strpos($row['imagem'], 'http', 1);
            $row['imagem'] = substr($row['imagem'], 0, $pos);
        }
        $receitasEncontradas[] = $row;
    }
}

// Retorna as receitas encontradas (ou um array vazio se não houver)
echo json_encode(["erro" => false, "receitas" => $receitasEncontradas]);

$stmt->close();
$conn->close();

?>