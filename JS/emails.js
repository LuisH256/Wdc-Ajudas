// emails.js (CÓDIGO COMPLETO E CORRIGIDO)

document.addEventListener('DOMContentLoaded', () => {
    const emailTemplate = document.getElementById('email-template');
    const sacTemplate = document.getElementById('sac-template');
    const apoioVendasTemplate = document.getElementById('apoio-vendas-template');
    const emailPreview = document.getElementById('email-preview');
    const emailContent = document.getElementById('email-content');
    const copyEmailButton = document.getElementById('copy-email');

    // Evento para o primeiro Select (SAC ou Apoio)
    emailTemplate.addEventListener('change', () => {
        const selectedTemplate = emailTemplate.value;
        resetFields();
        
        document.getElementById('sac-options').classList.add('hidden');
        document.getElementById('apoio-vendas-options').classList.add('hidden');
        emailPreview.classList.add('hidden');
        copyEmailButton.classList.add('hidden'); 
        emailContent.innerHTML = '';

        if (selectedTemplate === 'sac') {
            document.getElementById('sac-options').classList.remove('hidden');
        } else if (selectedTemplate === 'apoio_vendas') {
            document.getElementById('apoio-vendas-options').classList.remove('hidden');
        }
    });

    // Mostrar botão de copiar quando um template específico for selecionado
    const showCopyButton = () => {
        if (sacTemplate.value !== '' || apoioVendasTemplate.value !== '') {
            copyEmailButton.classList.remove('hidden');
        } else {
            copyEmailButton.classList.add('hidden');
        }
    };

    sacTemplate.addEventListener('change', showCopyButton);
    apoioVendasTemplate.addEventListener('change', showCopyButton);

    // Função de copiar preservando Rich Text
    copyEmailButton.addEventListener('click', () => {
        const conteudoOriginal = emailContent.innerHTML;

        const estruturaHTML = `
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                <tr>
                    <td style="padding: 10px; color: #000000;">
                        ${conteudoOriginal}
                    </td>
                </tr>
            </table>
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
            alert('Erro ao copiar.');
        }

        selection.removeAllRanges();
        document.body.removeChild(tempDiv);
    });

    function resetFields() {
        document.getElementById('sac-template').value = '';
        document.getElementById('apoio-vendas-template').value = '';

        const optionContainers = [
            'destinatario-container', 'tipo-operacao-container', 'pdaf-options', 'solar-options',
            'ticket-correios-options', 'recusa-nf-options', 'primeiro-ticket-options', 'ticket-expirado-options'
        ];
        
        optionContainers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const inputsToReset = [
            'destinatario', 'tipo-operacao', 'tipo-select', 'nfs-input', 'ean-input', 'swqt-input', 
            'nf-input', 'valor-unitario-input', 'quantidade-input', 'ncm-input', 'descricao-input',
            'postagem-correios-template', 'produto-desc-input', 'nf-input-postagem', 'ticket-input',
            'data-emissao-input', 'data-validade-input', 'ticket-expirado-input', 'ticket-input-expired',
            'data-emissao-input-expired', 'data-validade-input-expired', 'nf-recusa-input', 'descricao-recusa-input'
        ];

        inputsToReset.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }

    window.resetFields = resetFields;
});
