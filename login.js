document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("login.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.sucesso) {
        alert("Login realizado com sucesso!");
        window.location.href = "index.html"; // Redireciona para a página inicial
      } else {
        alert("Erro: " + (data.mensagem || "Verifique suas credenciais."));
      }
    })
    .catch(err => {
      console.error("Erro na requisição:", err);
      alert("Erro ao tentar fazer login.");
    });
  });
});
