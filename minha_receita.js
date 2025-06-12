function carregarMinhasReceitas() {
  fetch("minha_receita.php")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("lista-receitas");
      const mensagemVazia = document.getElementById("sem-receitas");

      container.innerHTML = "";

      if (!data.receitas || data.receitas.length === 0) {
        mensagemVazia.style.display = "block";
        return;
      } else {
        mensagemVazia.style.display = "none";
      }

      data.receitas.forEach(receita => {
        const card = document.createElement("div");
        card.className = "receita-card";

        card.innerHTML = `
          <div class="receita-card-image">
            <img src="${receita.imagem}" alt="${receita.titulo}">
          </div>
          <div class="receita-card-content">
            <span class="tipo">${receita.tipo}</span>
            <h3>${receita.titulo}</h3>
            <p class="ingredientes">${receita.ingredientes}</p>
            <div class="receita-card-actions">
              <a class="btn btn-visualizar" href="visualizar.html?id=${receita.id}">Visualizar</a>
              <a class="btn btn-editar" href="editar.html?id=${receita.id}">Editar</a>
              <button class="btn btn-excluir" onclick="excluirReceita(${receita.id})">Excluir</button>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar receitas:", err);
      alert("Erro ao buscar suas receitas.");
    });
}

// ✅ Esta função deve estar fora do fetch!
function excluirReceita(id) {
  if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

  fetch(`excluir.php?id=${id}`, { method: "GET" })
    .then(res => res.json())
    .then(data => {
      if (data.sucesso) {
        alert("Receita excluída com sucesso.");
        carregarMinhasReceitas(); // Atualiza lista
      } else {
        alert("Erro ao excluir receita: " + (data.mensagem || "Tente novamente."));
      }
    })
    .catch(err => {
      console.error("Erro ao excluir receita:", err);
      alert("Erro de conexão ao tentar excluir a receita.");
    });
}

document.addEventListener("DOMContentLoaded", carregarMinhasReceitas);
