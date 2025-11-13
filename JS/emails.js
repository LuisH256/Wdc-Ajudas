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

    // Função de copiar com feedback visual
    copyEmailButton.addEventListener('click', () => {
        const emailText = emailContent.textContent;
        
        navigator.clipboard.writeText(emailText).then(() => {
            // Feedback visual: Mudar cor e texto do botão
            const originalText = copyEmailButton.textContent;
            copyEmailButton.textContent = 'Copiado! ✅';
            copyEmailButton.classList.add('copy-success');

            setTimeout(() => {
                copyEmailButton.textContent = originalText;
                copyEmailButton.classList.remove('copy-success');
            }, 1500); // 1.5 segundos de feedback
            
        }).catch(err => {
            console.error('Erro ao copiar o e-mail: ', err);
            alert('Erro ao copiar o e-mail. Por favor, tente novamente ou copie manualmente.');
        });
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
