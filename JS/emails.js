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
        sacOptions.classList.add('hidden');
        emailPreview.classList.add('hidden');
        emailContent.textContent = '';

        if (selectedTemplate === 'sac') {
            sacOptions.classList.remove('hidden');
        }
    });

    copyEmailButton.addEventListener('click', () => {
        const range = document.createRange();
        range.selectNode(emailContent); // Seleciona o conteúdo do e-mail com HTML
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            const successful = document.execCommand('copy'); // Copia o conteúdo com formatação
            if (successful) {
                alert('E-mail copiado com sucesso!');
            } else {
                alert('Erro ao copiar o e-mail.');
            }
        } catch (err) {
            alert('Erro ao copiar o e-mail.');
        }

        selection.removeAllRanges(); // Remove a seleção após a cópia
    });
});

function resetFields() {
    document.getElementById('sac-template').value = '';
    document.getElementById('destinatario-container').classList.add('hidden');
    document.getElementById('tipo-operacao-container').classList.add('hidden');
    document.getElementById('pdaf-options').classList.add('hidden');
    document.getElementById('destinatario').value = '';
    document.getElementById('tipo-operacao').value = '';
    document.getElementById('tipo-select').value = '';
    document.getElementById('nfs-input').value = '';
    document.getElementById('ean-input').value = '';
    document.getElementById('swqt-input').value = '';
}
    // Função para copiar o conteúdo do e-mail
    copyEmailButton.addEventListener('click', () => {
        const emailText = emailContent.textContent;
        navigator.clipboard.writeText(emailText).then(() => {
            alert('E-mail copiado para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar o e-mail: ', err);
        });
    });