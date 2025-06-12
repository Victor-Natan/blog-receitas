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
        
        if (statusData.logado) {
            // Usuário está logado
            // Adiciona indicador visual de usuário logado
            document.body.classList.add('usuario-logado');
            
            // Atualiza o link de login para mostrar nome do usuário e logout
            if (loginLink) {
                loginLink.innerHTML = `
                    <span class="usuario-info">
                        <span class="usuario-nome">${statusData.usuario || 'Usuário'}</span>
                        <button class="btn-logout" onclick="realizarLogout()">Sair</button>
                    </span>
                `;
                loginLink.href = '#';
                loginLink.classList.add('usuario-logado-link');
            }
            
            // Adiciona indicador visual no cabeçalho
            if (!document.querySelector('.status-login')) {
                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'status-login logado';
                statusIndicator.innerHTML = '<span class="status-dot"></span>';
                statusIndicator.title = 'Usuário logado';
                nav.appendChild(statusIndicator);
            }
        } else {
            // Usuário não está logado
            document.body.classList.remove('usuario-logado');
            
            // Restaura link de login original
            if (loginLink) {
                loginLink.innerHTML = 'Login';
                loginLink.href = 'login.html';
                loginLink.classList.remove('usuario-logado-link');
            }
            
            // Remove indicador visual
            const statusIndicator = document.querySelector('.status-login');
            if (statusIndicator) {
                statusIndicator.remove();
            }
        }
    }

    // Função para realizar logout
    window.realizarLogout = function() {
        if (confirm('Deseja realmente sair?')) {
            fetch('logout.php', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    alert('Logout realizado com sucesso!');
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao realizar logout');
                }
            })
            .catch(error => {
                console.error('Erro no logout:', error);
                // Força redirecionamento mesmo com erro
                window.location.href = 'index.html';
            });
        }
    };

    // Verifica status de login ao carregar a página
    verificarStatusLogin();

    // Verifica status periodicamente (opcional)
    setInterval(verificarStatusLogin, 300000); // 5 minutos
});

