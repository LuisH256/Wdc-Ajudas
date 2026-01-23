// emails.js

document.addEventListener('DOMContentLoaded', () => {
    const emailTemplate = document.getElementById('email-template');
    const sacTemplate = document.getElementById('sac-template');
    const apoioVendasTemplate = document.getElementById('apoio-vendas-template');
    const emailPreview = document.getElementById('email-preview');
    const emailContent = document.getElementById('email-content');
    const copyEmailButton = document.getElementById('copy-email');

    // Função para esconder TODOS os contêineres de opções de uma vez
    function hideAllContainers() {
        const containers = [
            'sac-options', 'apoio-vendas-options', 'pendencias-options',
            'destinatario-container', 'tipo-operacao-container', 'rma-fields',
            'solar-options', 'pdaf-options', 'recusa-nf-options', 
            'ticket-correios-options', 'primeiro-ticket-options', 'ticket-expirado-options'
        ];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
    }

    // Evento para o primeiro Select (SAC ou Apoio)
    emailTemplate.addEventListener('change', () => {
        const selectedTemplate = emailTemplate.value;
        
        // 1. Limpa valores
        resetFields();
        
        // 2. Esconde TUDO
        hideAllContainers();
        emailPreview.classList.add('hidden');
        copyEmailButton.classList.add('hidden'); 
        emailContent.innerHTML = '';

        // 3. Mostra apenas o menu do grupo selecionado
        if (selectedTemplate === 'sac') {
            document.getElementById('sac-options').classList.remove('hidden');
        } else if (selectedTemplate === 'apoio_vendas') {
            document.getElementById('apoio-vendas-options').classList.remove('hidden');
        }
    });

    // Mostrar botão de copiar quando um template específico for selecionado
    const showCopyButton = () => {
        if (sacTemplate.value !== '' || (apoioVendasTemplate && apoioVendasTemplate.value !== '')) {
            copyEmailButton.classList.remove('hidden');
        } else {
            copyEmailButton.classList.add('hidden');
        }
    };

    sacTemplate.addEventListener('change', showCopyButton);
    if(apoioVendasTemplate) apoioVendasTemplate.addEventListener('change', showCopyButton);

    // Função de copiar preservando Rich Text (Outlook)
    copyEmailButton.addEventListener('click', () => {
        const conteudoOriginal = emailContent.innerHTML;
        const estruturaHTML = `
            <div id="copy-helper" style="font-family: Arial, sans-serif; color: #000;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 0; margin: 0;">
                            ${conteudoOriginal}
                        </td>
                    </tr>
                </table>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.innerHTML = estruturaHTML;
        document.body.appendChild(tempDiv);

        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            const originalText = copyEmailButton.textContent;
            copyEmailButton.textContent = 'Copiado para Outlook! ✅';
            setTimeout(() => { copyEmailButton.textContent = originalText; }, 1500);
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }

        selection.removeAllRanges();
        document.body.removeChild(tempDiv);
    });

    function resetFields() {
        // Reseta os selects de segundo nível
        document.getElementById('sac-template').value = '';
        if(document.getElementById('apoio-vendas-template')) document.getElementById('apoio-vendas-template').value = '';

        // Lista de todos os inputs para limpar
        const inputsToReset = [
            'edi-select', 'nf-select', 'destinatario', 'tipo-operacao', 'crg-input', 
            'anexo-info-input', 'nf-input', 'valor-unitario-input', 'quantidade-input', 
            'ncm-input', 'descricao-input', 'tipo-select', 'nfs-input', 'ean-input', 
            'swqt-input', 'nf-recusa-input', 'descricao-recusa-input', 'postagem-correios-template',
            'produto-desc-input', 'data-emissao-input', 'nf-input-postagem', 'ticket-input',
            'data-validade-input', 'ticket-expirado-input', 'ticket-input-expired',
            'data-emissao-input-expired', 'data-validade-input-expired'
        ];

        inputsToReset.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }

    window.resetFields = resetFields;
});
