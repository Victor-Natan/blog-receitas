document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Receita não encontrada.");
    window.location.href = "index.html";
    return;
  }

  fetch(`visualizar.php?id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        alert("Erro ao carregar a receita.");
        return;
      }

      document.getElementById("titulo-receita").textContent = data.titulo;
      document.getElementById("img-receita").src = data.imagem;
      document.getElementById("img-receita").alt = data.titulo;
      document.getElementById("img-receita").title = data.titulo;

      const ingredientesList = document.getElementById("ingredientes");
      ingredientesList.innerHTML = "";
      const ingredientes = data.ingredientes.split("\n");
      ingredientes.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ingredientesList.appendChild(li);
      });

      document.getElementById("preparo").textContent = data.preparo;
    })
    .catch(error => {
      console.error("Erro ao buscar a receita:", error);
      alert("Erro ao carregar os dados da receita.");
    });
});
