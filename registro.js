document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("registro.php", {
      method: "POST",
      body: formData
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.sucesso) {
        alert("Cadastro realizado com sucesso! Você já pode fazer login.");
        window.location.href = "login.html";
      } else {
        alert("Erro no cadastro: " + data.mensagem);
      }
    })
    .catch((err) => {
      console.error("Erro na requisição:", err);
      alert("Erro ao cadastrar. Tente novamente.");
    });
  });
});
