document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona a barra de pesquisa e o cabeçalho principal
    const searchBar = document.querySelector('.search-bar');
    const mainHeader = document.querySelector('.main-header');
    
    // Aborta se não encontrar os elementos (embora improváveis se o script estiver no HTML)
    if (!searchBar || !mainHeader) return;

    // 2. Mapeamento de todos os links do seu site (Todos com a barra inicial / para caminho absoluto à raiz)
    const siteLinks = [
        // Links Principais e de E-mails
        { title: "Página Principal", url: "/index.html" }, 
        { title: "Script de E-mails", url: "/emails.html" },
        
        // Links de Automação/Atalhos
        { title: "Atalhos", url: "/atalhos.html" },
        { title: "Comparar Lista", url: "/comprar-lista.html" },
        { title: "Adicionar S", url: "/adds.html" },
        { title: "Definir Garantia", url: "/garantia.html" },
        { title: "Verificar NF", url: "/verificarnf.html" },
        { title: "Definir Garantia Revenda", url: "/revendagarantia.html" },
        { title: "Conferir Valores Unitário", url: "/conferencia-valores.html" },
        
        // Links de Pesquisas (Incluindo os que faltavam)
        { title: "Pesquisa Serial", url: "/pesquisas/serial.html" },
        { title: "Pesquisa PA (LVP)", url: "/pesquisas/lvp.html" },
        { title: "Abrir OS", url: "/pesquisas/os.html" },
        { title: "Baixar NF", url: "/pesquisas/nf.html" },
        { title: "Romaneio Visão", url: "/pesquisas/visao.html" },
        { title: "Pesquisa Fabricante", url: "/pesquisas/garantiafabricante.html" },
        { title: "Pesquisa Contato Cliente", url: "/pesquisas/cliente-protheus.html" }, 
        { title: "Pesquisa NF Remessa", url: "/pesquisas/nf-remessa.html" }, // Adicionado
        { title: "Pesquisa Serial KIT", url: "/pesquisas/serial-kit.html" }, // Adicionado
    ];

    // 3. Cria o contêiner de resultados
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results-container';
    // Adicionamos o contêiner ao cabeçalho principal (Header)
    mainHeader.appendChild(resultsContainer);

    // 4. Adiciona o listener de input para a barra de pesquisa
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

    // 5. Oculta os resultados ao clicar fora da barra de pesquisa
    document.addEventListener('click', (event) => {
        // Verifica se o clique não foi dentro do cabeçalho principal
        if (!mainHeader.contains(event.target)) {
            resultsContainer.style.display = 'none';
        }
    });
});
