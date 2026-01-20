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
copyEmailButton.addEventListener('click', async () => {
    // Pegamos o HTML interno do preview (que contém as tags de cor e negrito)
    const htmlContent = emailContent.innerHTML;
    // Criamos uma versão em texto simples para compatibilidade
    const textContent = emailContent.innerText;

    try {
        // Usamos a Clipboard API moderna para injetar o HTML diretamente na área de transferência
        const blobHTML = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([textContent], { type: 'text/plain' });
        
        const data = [new ClipboardItem({
            'text/html': blobHTML,
            'text/plain': blobText
        })];

        await navigator.clipboard.write(data);

        // Feedback visual: Mudar cor e texto do botão
        const originalText = copyEmailButton.textContent;
        copyEmailButton.textContent = 'Copiado com Cores! ✅';
        copyEmailButton.classList.add('copy-success');

        setTimeout(() => {
            copyEmailButton.textContent = originalText;
            copyEmailButton.classList.remove('copy-success');
        }, 1500);

    } catch (err) {
        console.error('Erro ao copiar com Clipboard API: ', err);
        
        // Fallback: Tenta o método antigo se o navegador for muito antigo
        const range = document.createRange();
        range.selectNode(emailContent);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        try {
            document.execCommand('copy');
            copyEmailButton.textContent = 'Copiado! (Método Alternativo)';
        } catch (fallbackErr) {
            alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
        }
        selection.removeAllRanges();
    }
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


