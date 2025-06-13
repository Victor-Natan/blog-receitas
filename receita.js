// receita.js
document.addEventListener('DOMContentLoaded', () => { 
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("tipo"); // Pode ser null se não houver 'tipo'
  const termoBusca = params.get("busca"); // Pode ser null se não houver 'busca'
  
  const tituloPagina = document.getElementById('titulo-receita'); // Elemento <h2> que mostra o título da página
  const listaReceitasContainer = document.getElementById('lista-receitas'); // Container onde os cards de receita são exibidos

  // Lógica para definir o título da página com base na busca ou categoria
  if (termoBusca) {
    tituloPagina.textContent = `Resultados para "${termoBusca}"`;
  } else if (categoria) {
    tituloPagina.textContent = `${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;
  } else {
    tituloPagina.textContent = 'Todas as Receitas'; // Título padrão se não houver busca ou categoria
  }
  
  // URL do PHP que será chamada
  let phpUrl = '';
  if (termoBusca) {
    phpUrl = `buscar_receitas.php?termo_busca=${encodeURIComponent(termoBusca)}`;
  } else if (categoria) {
    phpUrl = `receita.php?tipo=${encodeURIComponent(categoria)}`; // Reutiliza receita.php para categorias
  } else {
    phpUrl = `receita.php`; // Se não há termo nem categoria, busca todas as receitas
  }

  fetch(phpUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro HTTP! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      // Verifica se há um erro retornado pelo PHP (ex: "erro": true)
      if (data.erro) {
        listaReceitasContainer.innerHTML = `<p class="text-center">Erro: ${data.mensagem}</p>`;
        console.error('Erro retornado pelo PHP:', data.mensagem);
        return;
      }
      
      // A resposta para busca pode ser `data.receitas` ou o array direto
      const receitasParaExibir = data.receitas || data; 

      listaReceitasContainer.innerHTML = ''; // Limpa o conteúdo anterior

      if (receitasParaExibir.length === 0) {
        listaReceitasContainer.innerHTML = '<p class="text-center">Nenhuma receita encontrada para sua busca.</p>';
        return;
      }

      listaReceitasContainer.classList.add('receitas-grid'); // Adiciona a classe de grid ao container

      receitasParaExibir.forEach(receita => {
        const card = document.createElement('a'); // Criar um elemento <a> para o card
        card.classList.add('receita-card'); // Adiciona a classe principal do card
        card.href = `visualizar.html?id=${receita.id}`; // Link para a página de visualização
        card.setAttribute('data-categoria', receita.tipo.toLowerCase()); // Adiciona o atributo data-categoria para as linhas coloridas

        // Corrige a URL da imagem se for o caso (como em minha_receita.php)
        let imagemSrc = receita.imagem;
        if (imagemSrc && typeof imagemSrc === 'string' && imagemSrc.includes('http') && substrCount(imagemSrc, 'http') > 1) {
            let pos = imagemSrc.indexOf('http', 1);
            imagemSrc = imagemSrc.substring(0, pos);
        }

        // NOVO CONTEÚDO HTML DO CARD COM TODAS AS CLASSES CSS
        card.innerHTML = `
          <img src="${imagemSrc}" alt="${receita.titulo}" class="receita-card-imagem">
          <div class="receita-card-content">
            <span class="receita-card-categoria">${receita.tipo}</span>
            <h3 class="receita-card-titulo">${receita.titulo}</h3>
            <p class="receita-card-ingredientes">${receita.ingredientes}</p> </div>
        `;

        listaReceitasContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar receitas:', err);
      listaReceitasContainer.innerHTML = '<p class="text-center">Erro ao carregar receitas. Verifique sua conexão ou o servidor.</p>';
    });

  // Função auxiliar para contar substrings (reutilizada de minha_receita.js)
  function substrCount(str, substring) {
      let count = 0;
      let startIndex = 0;
      while ((startIndex = str.indexOf(substring, startIndex)) !== -1) {
          count++;
          startIndex += substring.length;
      }
      return count;
  }
});