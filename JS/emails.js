// emails.js (CÓDIGO COMPLETO)

document.addEventListener('DOMContentLoaded', () => {
    const emailTemplate = document.getElementById('email-template');
    const sacOptions = document.getElementById('sac-options');
    const emailPreview = document.getElementById('email-preview');
    const emailContent = document.getElementById('email-content');
    const copyEmailButton = document.getElementById('copy-email');

    emailTemplate.addEventListener('change', () => {
        const selectedTemplate = emailTemplate.value;

        // Resetar campos de exibição
        resetFields();
        // Ocultar todas as sub-opções
        document.getElementById('sac-options').classList.add('hidden');
        document.getElementById('apoio-vendas-options').classList.add('hidden');
        
        emailPreview.classList.add('hidden');
        copyEmailButton.classList.add('hidden'); // Ocultar o botão de copiar
        emailContent.textContent = '';

        if (selectedTemplate === 'sac') {
            document.getElementById('sac-options').classList.remove('hidden');
        } else if (selectedTemplate === 'apoio_vendas') {
            document.getElementById('apoio-vendas-options').classList.remove('hidden');
        }
    });

    // Função de copiar ATUALIZADA para preservar cores e formatação (Rich Text)
copyEmailButton.addEventListener('click', () => {
    // Cria um elemento temporário
    const container = document.createElement('div');
    container.innerHTML = emailContent.innerHTML;

    // Estilização forçada para garantir que o fundo não vá junto, apenas o texto colorido
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    container.style.color = 'black'; // Cor base preta para o Outlook não bugar

    document.body.appendChild(container);

    // Seleciona o conteúdo
    const range = document.createRange();
    range.selectNode(container);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
        // O comando execCommand('copy') dentro de uma seleção de Range 
        // é o que melhor preserva tags <font color> para o Outlook
        const successful = document.execCommand('copy');
        
        if (successful) {
            const originalText = copyEmailButton.textContent;
            copyEmailButton.textContent = 'Copiado com Cores! ✅';
            setTimeout(() => {
                copyEmailButton.textContent = originalText;
            }, 1500);
        }
    } catch (err) {
        console.error('Erro ao copiar: ', err);
    }

    // Limpeza
    selection.removeAllRanges();
    document.body.removeChild(container);
});
    

    // A função de resetar deve ser capaz de resetar todos os campos de input/select
    function resetFields() {
        // Campos de seleção principais
        document.getElementById('sac-template').value = '';
        document.getElementById('apoio-vendas-template').value = '';

        // Ocultar todos os containers de opções
        const optionContainers = [
            'destinatario-container', 'tipo-operacao-container', 'pdaf-options', 'solar-options',
            'postagem-correios-produtos-solar-options', 'pendencias-options', 
            'recusa-nf-options', 'nfs-retidas-options', 'primeiro-ticket-options', 'ticket-expirado-options'
        ];
        
        optionContainers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        // Resetar valores dos inputs
        const inputsToReset = [
            'destinatario', 'tipo-operacao', 'tipo-select', 'nfs-input', 'ean-input', 'swqt-input', 
            'nf-input', 'valor-unitario-input', 'quantidade-input', 'ncm-input', 'descricao-input',
            'postagem-correios-template', 'produto-desc-input', 'nf-input-postagem', 'ticket-input',
            'data-emissao-input', 'data-validade-input', 'ticket-expirado-input', 'ticket-input-expired',
            'data-emissao-input-expired', 'data-validade-input-expired', 'edi-select', 'nf-select',
            'nf-recusa-input', 'descricao-recusa-input', 'nf-retida-input'
        ];

        inputsToReset.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }

    // Adiciona a função resetFields ao escopo global para ser usada, se necessário.
    window.resetFields = resetFields;
});




