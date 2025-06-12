document.addEventListener('DOMContentLoaded', () => { 
  const categoria = new URLSearchParams(window.location.search).get("tipo") || "todas";
  const titulo = document.getElementById('titulo-receita');
  const lista = document.getElementById('lista-receitas');

  titulo.textContent = `${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;
  
  fetch(`receita.php?tipo=${categoria}`)
    .then(res => res.json())
    .then(receitas => {
      lista.innerHTML = '';

      if (receitas.length === 0) {
        lista.innerHTML = '<p>Nenhuma receita encontrada.</p>';
        return;
      }

      lista.classList.add('receitas-grid');

      receitas.forEach(receita => {
        const card = document.createElement('a'); // ← link
        card.classList.add('receita-card');
        card.href = `visualizar.html?id=${receita.id}`; // ← linka para visualizar.html

        card.innerHTML = `
          <img src="${receita.imagem}" alt="${receita.titulo}" class="receita-img">
          <div class="receita-info">
            <h3>${receita.titulo}</h3>
          </div>
        `;

        lista.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar receitas:', err);
      lista.innerHTML = '<p>Erro ao carregar receitas.</p>';
    });
});
