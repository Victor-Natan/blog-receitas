// index.js
document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  
  if (searchInput && searchBtn) {
    // Função de pesquisa
    function realizarPesquisa() {
      const termo = searchInput.value.trim();
      if (termo) {
        // Redirecionar para a página de receitas.html, passando o termo de busca
        // A página receita.html (com receita.js) vai interpretar este parâmetro
        window.location.href = `receita.html?busca=${encodeURIComponent(termo)}`;
      } else {
        // Opcional: redirecionar para a página de receitas sem termo de busca
        // ou mostrar um alerta para o usuário digitar algo
        window.location.href = `receita.html`; 
      }
    }
    
    // Pesquisar ao clicar no botão
    searchBtn.addEventListener("click", realizarPesquisa);
    
    // Pesquisar ao pressionar Enter no campo de busca
    searchInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        e.preventDefault(); // Impede o envio padrão do formulário, se houver
        realizarPesquisa();
      }
    });
  }
});