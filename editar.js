document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID da receita não fornecido.");
    window.location.href = "minha_receita.html";
    return;
  }

  const form = document.getElementById("form-editar");
  const imagemFileInput = document.getElementById("imagem");
  const imagemUrlInput = document.getElementById("imagem_url");

  // Carrega dados da receita e preenche o formulário
  fetch(`visualizar.php?id=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert("Erro ao carregar a receita: " + data.mensagem);
        return;
      }

      document.getElementById("id").value = id;
      document.getElementById("titulo").value = data.titulo;
      document.getElementById("tipo").value = data.tipo || "";
      document.getElementById("ingredientes").value = data.ingredientes;
      document.getElementById("preparo").value = data.preparo;

      // Se a imagem atual for uma URL externa, preenche o campo de URL
      if (data.imagem.startsWith("http")) {
        imagemUrlInput.value = data.imagem;
      } else {
        // Se for uma imagem local, não preenche nada (usuário decide se altera ou não)
        imagemUrlInput.value = "";
      }
    })
    .catch(err => {
      console.error("Erro ao buscar a receita:", err);
      alert("Erro de conexão ao buscar dados.");
    });

  // Envio do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", document.getElementById("id").value);
    formData.append("titulo", document.getElementById("titulo").value);
    formData.append("tipo", document.getElementById("tipo").value);
    formData.append("ingredientes", document.getElementById("ingredientes").value);
    formData.append("preparo", document.getElementById("preparo").value);

    // Decide qual tipo de imagem enviar
    if (imagemFileInput.files.length > 0) {
      formData.append("imagem", imagemFileInput.files[0]);
    } else if (imagemUrlInput.value.trim() !== "") {
      formData.append("imagem_url", imagemUrlInput.value.trim());
    }

    fetch("editar.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.sucesso) {
          alert("Receita atualizada com sucesso!");
          window.location.href = "minha_receita.html";
        } else {
          alert("Erro ao atualizar receita: " + (resp.mensagem || "Tente novamente."));
        }
      })
      .catch(err => {
        console.error("Erro ao enviar alterações:", err);
        alert("Erro de conexão ao atualizar receita.");
      });
  });
});
