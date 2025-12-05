// Selecionando a barra de pesquisa e os links da navegação
const searchBar = document.querySelector('.search-bar');
const navLinks = document.querySelectorAll('.nav ul li a');

// Função para filtrar as páginas com base na pesquisa
function filterPages() {
    const searchTerm = searchBar.value.toLowerCase(); // Obtém o termo de pesquisa e converte para minúsculas

    navLinks.forEach(link => {
        const pageTitle = link.textContent.toLowerCase(); // Obtém o título da página e converte para minúsculas
        if (pageTitle.includes(searchTerm)) {
            link.parentElement.classList.remove('hidden'); // Mostra o item de navegação
        } else {
            link.parentElement.classList.add('hidden'); // Oculta o item de navegação
        }
    });
}

// Adicionando um ouvinte de evento para a pesquisa
searchBar.addEventListener('input', filterPages);

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.search-bar');
    const mainHeader = document.querySelector('.main-header');
    
    if (!searchBar || !mainHeader) return;

    // 1. Mapeamento de todos os links do seu site
    const siteLinks = [
        // Links Principais e de E-mails
        { title: "Página Principal", url: "/Wdc-Ajudas/index.html" }, 
        { title: "Script de E-mails", url: "/Wdc-Ajudas/emails.html" },
        
        // Links de Automação/Atalhos
        { title: "Atalhos", url: "/Wdc-Ajudas/atalhos.html" },
        { title: "Comparar Lista", url: "/Wdc-Ajudas/comprar-lista.html" },
        { title: "Adicionar S", url: "/Wdc-Ajudas/adds.html" },
        { title: "Definir Garantia", url: "/Wdc-Ajudas/garantia.html" },
        { title: "Definir Garantia Revenda", url: "/Wdc-Ajudas/revendagarantia.html" },
        { title: "Verificar NF", url: "/Wdc-Ajudas/verificarnf.html" },
        { title: "Conferir Valores Unitário", url: "/Wdc-Ajudas/conferencia-valores.html" },
        
        // Links de Pesquisas (Incluindo os que faltavam)
        { title: "Pesquisa Serial", url: "/Wdc-Ajudas/pesquisas/serial.html" },
        { title: "Pesquisa PA (LVP)", url: "/Wdc-Ajudas/pesquisas/lvp.html" },
        { title: "Abrir OS", url: "/Wdc-Ajudas/pesquisas/os.html" },
        { title: "Baixar NF", url: "/Wdc-Ajudas/pesquisas/nf.html" },
        { title: "Romaneio Visão", url: "/Wdc-Ajudas/pesquisas/visao.html" },
        { title: "Pesquisa Fabricante", url: "/Wdc-Ajudas/pesquisas/garantiafabricante.html" },
        { title: "Pesquisa Contato Cliente", url: "/Wdc-Ajudas/pesquisas/cliente-protheus.html" }, 
        { title: "Pesquisa NF Remessa", url: "/Wdc-Ajudas/pesquisas/nf-remessa.html" }, 
        { title: "Pesquisa Serial KIT", url: "/Wdc-Ajudas/pesquisas/serial-kit.html" }, 
    ];

    // 2. Cria o contêiner de resultados
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results-container';
    mainHeader.appendChild(resultsContainer);

    // 3. Adiciona o listener de input para a barra de pesquisa
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase().trim();
        resultsContainer.innerHTML = ''; // Limpa os resultados anteriores

        if (searchTerm.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        // Filtra os links que contêm o termo de pesquisa
        const filteredResults = siteLinks.filter(link => 
            link.title.toLowerCase().includes(searchTerm)
        ).slice(0, 5); // Limita a 5 resultados

        if (filteredResults.length > 0) {
            const resultList = document.createElement('ul');
            
            filteredResults.forEach(link => {
                const listItem = document.createElement('li');
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.title;
                listItem.appendChild(linkElement);
                resultList.appendChild(listItem);
            });
            
            resultsContainer.appendChild(resultList);
            resultsContainer.style.display = 'block';
        } else {
            const noResults = document.createElement('p');
            noResults.textContent = 'Nenhum resultado encontrado.';
            resultsContainer.appendChild(noResults);
            resultsContainer.style.display = 'block';
        }
    });

    // Oculta os resultados ao clicar fora da barra de pesquisa
    document.addEventListener('click', (event) => {
        if (!mainHeader.contains(event.target)) {
            resultsContainer.style.display = 'none';
        }
    });


    // =======================================================
    // NOVO: FUNÇÃO PARA CONTROLAR A VISIBILIDADE DO CARD DE AVISO
    // =======================================================

    /**
     * Controla a visibilidade do Card de Aviso Global.
     * @param {boolean} isVisible - Se true, o card é exibido. Se false, é ocultado.
     */
    function toggleGlobalAlert(isVisible) {
        const alertCard = document.getElementById('global-alert-card');
        if (alertCard) {
            if (isVisible === true) {
                // Exibe o card
                alertCard.style.display = 'block'; 
            } else {
                // Oculta o card
                alertCard.style.display = 'none';
            }
        }
    }

    // CHAMADA INICIAL: Por padrão, o card de aviso está OCULTO (false) ao carregar a página.
    // Mude para toggleGlobalAlert(true) se quiser que ele apareça imediatamente.
    toggleGlobalAlert(true);

});

