// auth-status.js - Sistema de verificação de status de login
document.addEventListener("DOMContentLoaded", function() {
    // Função para verificar status de login
    function verificarStatusLogin() {
        fetch('usuario_status.php')
            .then(response => response.json())
            .then(data => {
                atualizarInterface(data);
            })
            .catch(error => {
                console.error('Erro ao verificar status de login:', error);
                // Em caso de erro, assume que não está logado
                atualizarInterface({ logado: false });
            });
    }

    // Função para atualizar a interface baseada no status de login
    function atualizarInterface(statusData) {
        const loginLink = document.getElementById('login-link');
        const nav = document.querySelector('.cabecalho nav'); 

        // Remove a saudação e o botão 'Sair' anteriores para evitar duplicação em re-checagens
        const oldSaudacao = nav.querySelector('.saudacao-usuario');
        if (oldSaudacao) {
            oldSaudacao.remove();
        }
        const oldBtnSair = nav.querySelector('.btn-sair');
        if (oldBtnSair && oldBtnSair !== loginLink) { // Para evitar remover o próprio loginLink se ele virar o btn-sair
            oldBtnSair.remove();
        }
        
        if (statusData.logado) {
            // Usuário está logado
            document.body.classList.add('usuario-logado');
            
            // Reintroduzir a saudação com o nome do usuário
            const saudacao = document.createElement('span');
            saudacao.className = 'saudacao-usuario'; // Classe para estilização
            saudacao.textContent = `Olá, ${statusData.usuario || 'Usuário'}!`; // Usa o nome do usuário da sessão
            
            // Adiciona a saudação ANTES do link de Sair/Login
            // Se o loginLink existir e tiver um pai (navbar)
            if (loginLink && loginLink.parentNode) {
                loginLink.parentNode.insertBefore(saudacao, loginLink);
            } else if (nav) { 
                // Se por algum motivo o loginLink não for encontrado (em páginas onde ele não existe no HTML padrão),
                // tenta adicionar a saudação e um novo botão 'Sair' ao final da nav.
                // Isso garante que o Sair apareça, mesmo que o HTML da página não tenha um #login-link inicialmente.
                nav.appendChild(saudacao);
                const newBtnSair = document.createElement('a');
                newBtnSair.href = 'logout.php';
                newBtnSair.textContent = 'Sair';
                newBtnSair.classList.add('btn-sair'); // Aplica a classe para o estilo do botão
                newBtnSair.addEventListener('click', realizarLogoutOnClick);
                nav.appendChild(newBtnSair);

                // Como o loginLink original pode não existir ou não ser usado,
                // vamos garantir que a referência para o botão de sair seja o newBtnSair para o próximo passo.
                loginLink = newBtnSair; 
            }

            // Garante que o elemento que era o 'login-link' agora se torne o 'Sair' e tenha o estilo correto
            if (loginLink) {
                loginLink.textContent = 'Sair';
                loginLink.href = 'logout.php';
                loginLink.classList.add('btn-sair'); // Aplica a classe CSS para o estilo do botão
                loginLink.classList.remove('btn-logout'); // Garante que não tenha classes de logout antigas
                loginLink.removeEventListener('click', realizarLogoutOnClick); 
                loginLink.addEventListener('click', realizarLogoutOnClick); 
            }
            
        } else {
            // Usuário não está logado
            document.body.classList.remove('usuario-logado');
            
            // Restaura link de login original
            if (loginLink) {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
                loginLink.classList.remove('btn-sair'); // Remove a classe de estilo de botão
                loginLink.removeEventListener('click', realizarLogoutOnClick); 
            }
        }
    }

    // Função para lidar com o clique no botão Sair 
    function realizarLogoutOnClick(e) {
        e.preventDefault(); 
        if (confirm('Deseja realmente sair?')) {
            fetch('logout.php', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    alert('Logout realizado com sucesso!');
                    localStorage.removeItem("usuario_logado");
                    localStorage.removeItem("usuario_id");
                    localStorage.removeItem("usuario_nome");
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao realizar logout: ' + (data.mensagem || 'Tente novamente.'));
                }
            })
            .catch(error => {
                console.error('Erro no logout:', error);
                alert('Erro de conexão ao tentar realizar logout.');
                window.location.href = 'index.html'; 
            });
        }
    }

    // A função realizarLogout (global) agora aponta para a função com event listener
    window.realizarLogout = realizarLogoutOnClick;

    // Verifica status de login ao carregar a página
    verificarStatusLogin();

    // Verifica status periodicamente (opcional)
    // setInterval(verificarStatusLogin, 300000); // 5 minutos
});