document.addEventListener('DOMContentLoaded', () => {
    const emailTemplate = document.getElementById('email-template');
    const apoioVendasTemplate = document.getElementById('apoio-vendas-template');
    const pendenciasOptions = document.getElementById('pendencias-options');
    const emailPreview = document.getElementById('email-preview');
    const emailContent = document.getElementById('email-content');

    const ediSelect = document.getElementById('edi-select');
    const nfSelect = document.getElementById('nf-select');

    const emailTemplates = {
        atrasos: `{{saudacao}}\n\nFavor nos posicionar quanto as entregas das NFs abaixo que estão em atraso ou não recebemos EDI de entrega.\n`,
        pendencias_singular: `{{saudacao}}\n\nRecebemos EDI de {{edi}} da NF {{nf}}. Favor nos posicionar urgente quanto ao status dessa entrega e se possui alguma pendencia que poderiamos intervir para que a entrega seja realizada no prazo.\n`,
        pendencias_plural: `{{saudacao}}\n\nRecebemos EDI de {{edi}} das NFs {{nf}}. Favor nos posicionar urgente quanto ao status dessas entregas e se possuem alguma pendencia que poderiamos intervir para que as entregas sejam realizadas no prazo.\n`,
        pendencias_lista: `{{saudacao}}\n\nRecebemos EDI de pendencias das NFs listadas abaixo. Favor nos posicionar urgente quanto aos status dessas entregas e se poderiamos intervir para que as entregas sejam realizadas no prazo.\n\n[Lista de NFs]`
    };

    function resetFields() {
        pendenciasOptions.classList.add('hidden');
        ediSelect.value = '';
        nfSelect.value = '';
        emailContent.textContent = '';
        emailPreview.classList.add('hidden');
    }

    function getSaudacao() {
        const horaAtual = new Date().getHours();
        return horaAtual < 12 ? "Bom dia!" : "Boa tarde!";
    }

    function updatePendenciasEmail() {
        const edi = ediSelect.value || '...';
        const nf = nfSelect.value || '...';

        const template = nf.includes(',') ? emailTemplates.pendencias_plural : emailTemplates.pendencias_singular;

        const emailText = template
            .replace('{{saudacao}}', getSaudacao())
            .replace('{{edi}}', edi)
            .replace('{{nf}}', nf);

        emailContent.textContent = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    function updatePendenciasListaEmail() {
        const emailText = emailTemplates.pendencias_lista
            .replace('{{saudacao}}', getSaudacao());

        emailContent.textContent = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    emailTemplate.addEventListener('change', () => {
        const selectedTemplate = emailTemplate.value;

        // Resetar campos de exibição
        resetFields();
        document.getElementById('apoio-vendas-options').classList.add('hidden');

        if (selectedTemplate === 'apoio_vendas') {
            document.getElementById('apoio-vendas-options').classList.remove('hidden');
        }
    });

    apoioVendasTemplate.addEventListener('change', () => {
        resetFields();

        const selectedTemplate = apoioVendasTemplate.value;

        if (selectedTemplate === 'atrasos') {
            const emailText = emailTemplates.atrasos.replace('{{saudacao}}', getSaudacao());
            emailContent.textContent = emailText.trim();
            emailPreview.classList.remove('hidden');
        } else if (selectedTemplate === 'pendencias') {
            pendenciasOptions.classList.remove('hidden');
        } else if (selectedTemplate === 'pendencias_lista') {
            updatePendenciasListaEmail();
        }
    });

    ediSelect.addEventListener('input', updatePendenciasEmail);
    nfSelect.addEventListener('input', updatePendenciasEmail);
});