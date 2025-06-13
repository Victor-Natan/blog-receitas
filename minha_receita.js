// Função principal para carregar e exibir as receitas do usuário
function carregarMinhasReceitas() {
  fetch("minha_receita.php")
    .then(res => {
      // Verifica se a resposta HTTP foi bem-sucedida
      if (!res.ok) {
        // Lança um erro se o status HTTP não for 200 OK
        throw new Error(`Erro de rede ou servidor! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const container = document.getElementById("lista-receitas");
      const mensagemVazia = document.getElementById("sem-receitas");

      container.innerHTML = ""; // Limpa o conteúdo atual do container de receitas

      // Verifica se houve um erro retornado pelo PHP ou se não há receitas
      if (data.erro || !data.receitas || data.receitas.length === 0) {
        mensagemVazia.style.display = "block"; // Exibe a mensagem de "nenhuma receita"
        return; // Sai da função, pois não há receitas para exibir
      } else {
        mensagemVazia.style.display = "none"; // Esconde a mensagem de "nenhuma receita"
      }

      // Adiciona a classe de grid ao container, se ainda não tiver
      container.classList.add('receitas-grid');

      data.receitas.forEach(receita => {
        const card = document.createElement("div");
        card.className = "receita-card";
        card.setAttribute('data-categoria', receita.tipo.toLowerCase()); // Adiciona atributo para linhas coloridas do CSS

        // Lógica para corrigir a URL da imagem se houver URLs duplicadas
        let imagemSrc = receita.imagem;
        if (imagemSrc && typeof imagemSrc === 'string' && imagemSrc.includes('http') && substrCount(imagemSrc, 'http') > 1) {
            let pos = imagemSrc.indexOf('http', 1);
            imagemSrc = imagemSrc.substring(0, pos);
        }

        card.innerHTML = `
          <img src="${imagemSrc}" alt="${receita.titulo}" class="receita-card-imagem">
          <div class="receita-card-content">
            <span class="receita-card-categoria">${receita.tipo}</span>
            <h3 class="receita-card-titulo">${receita.titulo}</h3>
            <p class="receita-card-ingredientes">${receita.ingredientes}</p>
            <div class="receita-card-actions">
              <a class="receita-card-btn visualizar" href="visualizar.html?id=${receita.id}">Visualizar</a>
              <a class="receita-card-btn editar" href="editar.html?id=${receita.id}">Editar</a>
              <button class="receita-card-btn excluir" onclick="excluirReceita(${receita.id})">Excluir</button>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar receitas:", err);
      // Exibe uma mensagem de erro mais amigável ao usuário
      const container = document.getElementById("lista-receitas");
      container.innerHTML = '<p class="text-center">Erro ao carregar suas receitas. Por favor, tente novamente mais tarde.</p>';
      document.getElementById("sem-receitas").style.display = "none"; // Garante que a mensagem vazia não apareça junto com o erro
    });
}

// Função auxiliar para contar substrings (útil para a correção de URL de imagem)
function substrCount(str, substring) {
    let count = 0;
    let startIndex = 0;
    while ((startIndex = str.indexOf(substring, startIndex)) !== -1) {
        count++;
        startIndex += substring.length;
    }
    return count;
}

// Função para excluir uma receita (global para ser chamada pelo onclick)
function excluirReceita(id) {
  if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

  fetch(`excluir.php?id=${id}`, { method: "GET" })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro de rede ou servidor! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.sucesso) {
        alert("Receita excluída com sucesso.");
        carregarMinhasReceitas(); // Atualiza lista de receitas após exclusão
      } else {
        alert("Erro ao excluir receita: " + (data.mensagem || "Tente novamente."));
      }
    })
    .catch(err => {
      console.error("Erro ao excluir receita:", err);
      alert("Erro de conexão ao tentar excluir a receita.");
    });
}

// Evento para carregar as receitas quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", carregarMinhasReceitas);

// Funcionalidade do botão Sair (logout)
document.addEventListener("DOMContentLoaded", function() {
  const btnSair = document.getElementById("btn-sair");
  
  if (btnSair) {
    btnSair.addEventListener("click", function() {
      if (confirm("Tem certeza que deseja sair?")) {
        // Idealmente, o logout deve ser feito no servidor via POST para logout.php
        // A limpeza do localStorage é um complemento para o frontend
        localStorage.removeItem("usuario_logado");
        localStorage.removeItem("usuario_id");
        localStorage.removeItem("usuario_nome");
        
        // Redirecionar para logout.php para limpar sessão do servidor
        window.location.href = "logout.php";
      }
    });
  }
});