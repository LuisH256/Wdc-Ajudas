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