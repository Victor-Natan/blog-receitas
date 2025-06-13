// Script para a página de perfil do usuário
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    verificarStatusLogin();
    
    // Carregar dados do usuário
    carregarDadosUsuario();
    
    // Carregar estatísticas
    carregarEstatisticas();
    
    // Carregar receitas recentes
    carregarReceitasRecentes();
});

function verificarStatusLogin() {
    fetch('usuario_status.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(status => {
            if (!status.logado) {
                // Redirecionar para login se não estiver logado
                window.location.href = 'login.html';
                return;
            }
            
            // Atualizar informações do usuário na página
            atualizarInformacoesPerfil(status);
        })
        .catch(err => {
            console.error('Erro ao verificar status de login:', err);
            // Em caso de erro, redirecionar para login
            window.location.href = 'login.html';
        });
}

function atualizarInformacoesPerfil(dadosUsuario) {
    // Atualizar nome do usuário
    const nomeUsuario = document.getElementById('nome-usuario');
    const emailUsuario = document.getElementById('email-usuario');
    const infoNome = document.getElementById('info-nome');
    const infoEmail = document.getElementById('info-email');
    
    if (dadosUsuario.usuario) {
        nomeUsuario.textContent = `Olá, ${dadosUsuario.usuario}!`;
        infoNome.textContent = dadosUsuario.usuario;
    }
    
    if (dadosUsuario.email) {
        emailUsuario.textContent = dadosUsuario.email;
        infoEmail.textContent = dadosUsuario.email;
    }
    
    // Atualizar data de cadastro (se disponível)
    const infoDataCadastro = document.getElementById('info-data-cadastro');
    if (dadosUsuario.data_cadastro) {
        const data = new Date(dadosUsuario.data_cadastro);
        infoDataCadastro.textContent = data.toLocaleDateString('pt-BR');
    } else {
        infoDataCadastro.textContent = 'Não disponível';
    }
}

function carregarDadosUsuario() {
    // Esta função pode ser expandida para carregar dados adicionais do usuário
    // Por enquanto, os dados básicos são carregados via verificarStatusLogin()
    console.log('Carregando dados do usuário...');
}

function carregarEstatisticas() {
    // Carregar estatísticas do usuário
    fetch('minha_receita.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.receitas) {
                const totalReceitas = data.receitas.length;
                
                // Atualizar contadores
                document.getElementById('stat-receitas').textContent = totalReceitas;
                document.getElementById('total-receitas').textContent = `${totalReceitas} receita${totalReceitas !== 1 ? 's' : ''}`;
                
                // Simular outras estatísticas (podem ser implementadas no backend futuramente)
                document.getElementById('stat-visualizacoes').textContent = totalReceitas * 15; // Simulação
                document.getElementById('stat-favoritos').textContent = Math.floor(totalReceitas * 2.3); // Simulação
                document.getElementById('stat-comentarios').textContent = Math.floor(totalReceitas * 1.8); // Simulação
                
                // Atualizar badge do chef baseado no número de receitas
                atualizarBadgeChef(totalReceitas);
            }
        })
        .catch(err => {
            console.error('Erro ao carregar estatísticas:', err);
            // Manter valores padrão em caso de erro
        });
}

function atualizarBadgeChef(totalReceitas) {
    const badgeChef = document.querySelector('.badge-chef');
    
    if (totalReceitas >= 20) {
        badgeChef.textContent = 'Chef Master';
        badgeChef.className = 'badge badge-chef badge-master';
    } else if (totalReceitas >= 10) {
        badgeChef.textContent = 'Chef Experiente';
        badgeChef.className = 'badge badge-chef badge-experiente';
    } else if (totalReceitas >= 5) {
        badgeChef.textContent = 'Chef Intermediário';
        badgeChef.className = 'badge badge-chef badge-intermediario';
    } else {
        badgeChef.textContent = 'Chef Iniciante';
        badgeChef.className = 'badge badge-chef badge-iniciante';
    }
}

function carregarReceitasRecentes() {
    fetch('minha_receita.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.receitas && data.receitas.length > 0) {
                const receitasRecentes = data.receitas.slice(0, 3); // Pegar as 3 mais recentes
                exibirReceitasRecentes(receitasRecentes);
            }
        })
        .catch(err => {
            console.error('Erro ao carregar receitas recentes:', err);
        });
}

function exibirReceitasRecentes(receitas) {
    const container = document.getElementById('receitas-recentes');
    
    if (receitas.length === 0) {
        return; // Manter o placeholder
    }
    
    container.innerHTML = '';
    
    receitas.forEach(receita => {
        const item = document.createElement('div');
        item.className = 'receita-recente-item';
        item.innerHTML = `
            <div class="receita-recente-info">
                <img src="${receita.imagem || 'img/default-recipe.png'}" alt="${receita.titulo}" class="receita-recente-img">
                <div class="receita-recente-detalhes">
                    <h4 class="receita-recente-titulo">${receita.titulo}</h4>
                    <p class="receita-recente-categoria">${receita.tipo}</p>
                </div>
            </div>
            <a href="visualizar.html?id=${receita.id}" class="btn-ver-receita">Ver</a>
        `;
        container.appendChild(item);
    });
}

function editarPerfil() {
    // Função para editar perfil (pode ser implementada futuramente)
    alert('Funcionalidade de edição de perfil será implementada em breve!');
}

function configuracoes() {
    // Função para configurações (pode ser implementada futuramente)
    alert('Página de configurações será implementada em breve!');
}

// Função para atualizar avatar (futura implementação)
function atualizarAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('avatar-usuario').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

