document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formAdicionar');
  const btnSair = document.getElementById('btn-sair');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Pega o valor da URL manualmente
    const imagemUrl = document.getElementById('imagem_url').value.trim();
    if (imagemUrl) {
      formData.append('imagem_url', imagemUrl); // adiciona no lugar do arquivo
    }

    try {
      const response = await fetch('adicionar.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });

      const raw = await response.text();
      console.log("🔍 RESPOSTA BRUTA DO PHP:\n", raw);

      try {
        const data = JSON.parse(raw);
        if (response.ok && data.success) {
          alert("✅ Receita adicionada com sucesso!");
          form.reset();
        } else {
          alert("❌ Erro ao adicionar receita: " + (data.message || "sem detalhes"));
        }
      } catch (jsonError) {
        console.error("❌ Erro ao interpretar JSON:", jsonError);
        alert("⚠ Erro inesperado: resposta do servidor não está em JSON.");
      }

    } catch (error) {
      console.error("❌ Erro na requisição:", error);
      alert("⚠ Erro de conexão com o servidor.");
    }
  });

  btnSair.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  function showMessage(msg, tipo) {
    messageDiv.textContent = msg;
    messageDiv.className = tipo;
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 4000);
  }
});
