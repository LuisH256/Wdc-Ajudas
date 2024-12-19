document.addEventListener('DOMContentLoaded', () => {
    const emailTemplate = document.getElementById('email-template');
    const destinatarioContainer = document.getElementById('destinatario-container');
    const tipoOperacaoContainer = document.getElementById('tipo-operacao-container');
    const pdafOptions = document.getElementById('pdaf-options');
    const emailPreview = document.getElementById('email-preview');
    const emailContent = document.getElementById('email-content');
    const copyEmailButton = document.getElementById('copy-email');

    const destinatarioSelect = document.getElementById('destinatario');
    const tipoOperacaoSelect = document.getElementById('tipo-operacao');
    const tipoSelect = document.getElementById('tipo-select');
    const nfsInput = document.getElementById('nfs-input');
    const eanInput = document.getElementById('ean-input');
    const swqtInput = document.getElementById('swqt-input');

    const emailTemplates = {
        fiberhome: `
Informamos que as exceções para atendimento dos produtos Fiberhome, modelo HG6143D3 - ONU GPON WI-FI AC1200 fora de garantia, 
encerrou-se em 01/12/24 em alinhamento junto ao fabricante. 
Solicitações preenchidas após a respectiva data não terão atendimento caso esteja fora de garantia.
        `,
        devolucao: `
Informamos que a sua solicitação de devolução da NF foi aprovada.

Importante: Os produtos remetidos para retorno devem ser embalados de forma que garantam sua integridade física, permitindo a conferência do Número de Série e/ou MAC Address. Os produtos serão vistoriados no recebimento para assegurar que correspondem aos da NF de compra.

Segue abaixo a instrução para emissão da Nota Fiscal de devolução:
O envio do anexo da NF em resposta a este e-mail é obrigatório para validação antes do envio do material.

<b>Natureza de Operação: {{operacao}}</b><br>
<b>CFOP:</b> {{cfop}}<br>
<b>Destinatário:</b><br>{{destinatario}}<br><br>

A NF deverá conter os mesmos valores unitários, totais e alíquotas da nota original. Não é necessário devolver a NF inteira, considerando que se trata de devolução parcial.

No campo de “dados adicionais” da NF, mencionar:  
{{dados_adicionais}}

Aguardamos a nota fiscal emitida para prosseguimento.
        `,
        pdaf: `
Favor verificar entrada no {{tipo}} RMA que virou devolução,
seguir também com {{notas_servico}}, ref {{nfs}}.

EAN {{ean}}

{{swqt}}
        `
    };

    const destinatarios = {
        matriz: `
LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA  
ROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8  
IGUAPE – ILHEUS/BA CEP: 45658-335  
CNPJ: 05.917.486/0001-40 - I.E: 63250303  
        `,
        simoes: `
LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA  
V URBANA, 4466 COMPLEMENTO: TERREO CIA SUL  
Cep: 43700-000 SIMÕES FILHO/BA  
CNPJ: 05.917.486/0008-17 - I.E: 153759695  
        `
    };

    const operacoes = {
        locacao: {
            operacao: "Retorno de Locação",
            cfop: "5909 ou 6909 (Conforme dentro ou fora do estado)",
            dados_adicionais: `
Retorno de locação, referente à NF nº ......., emitida em ....../....../........
            `
        },
        devolucao: {
            operacao: "Devolução de Compra para Comercialização",
            cfop: "6202 (Para fora da UF) e 5202 (Para a própria UF)",
            dados_adicionais: `
Devolução recebida por meio da NF nº ......., emitida em ....../....../........
            `
        }
    };

    function resetFields() {
        destinatarioContainer.classList.add('hidden');
        tipoOperacaoContainer.classList.add('hidden');
        pdafOptions.classList.add('hidden');
        destinatarioSelect.value = '';
        tipoOperacaoSelect.value = '';
        tipoSelect.value = '';
        nfsInput.value = '';
        eanInput.value = '';
        swqtInput.value = '';
        emailContent.textContent = '';
        emailPreview.classList.add('hidden');
    }

    function updateDevolucaoEmail() {
        const destinatario = destinatarios[destinatarioSelect.value] || '';
        const operacaoInfo = operacoes[tipoOperacaoSelect.value] || {};

        if (destinatario && operacaoInfo.operacao) {
            const emailText = emailTemplates.devolucao
                .replace('{{destinatario}}', destinatario)
                .replace('{{operacao}}', operacaoInfo.operacao)
                .replace('{{cfop}}', operacaoInfo.cfop)
                .replace('{{dados_adicionais}}', operacaoInfo.dados_adicionais);
            emailContent.innerHTML = emailText.trim(); // Renderizar HTML com formatação
            emailPreview.classList.remove('hidden');
        }
    }

    function updatePdAfEmail() {
        const tipo = tipoSelect.value || 'PD';
        const ean = eanInput.value || '...';
        const nfs = nfsInput.value || '...';

        // Processar notas fiscais (NFs)
        const nfsArray = nfs.split(',').map(item => item.trim());
        const nfsMessage = nfsArray.length === 1 
            ? `a nota fiscal ${nfsArray[0]}`
            : `as notas fiscais ${nfsArray.join(', ')}`;

        // Processar notas de serviço (SW/QT) e formatar cada item em uma nova linha
        const swqtArray = swqtInput.value.split(',').map(item => item.trim());
        const notasServicoMessage = swqtArray.length === 1 
            ? 'a nota de serviço' 
            : 'as notas de serviço';
        const swqtMessage = swqtArray.join('\n'); // Cada SW/QT em uma nova linha

        // Montar o texto final
        const emailText = emailTemplates.pdaf
            .replace('{{tipo}}', tipo)
            .replace('{{notas_servico}}', notasServicoMessage)
            .replace('{{nfs}}', nfsMessage)
            .replace('{{ean}}', ean)
            .replace('{{swqt}}', swqtMessage);

        emailContent.innerHTML = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    emailTemplate.addEventListener('change', () => {
        resetFields();

        const selectedTemplate = emailTemplate.value;

        if (selectedTemplate === 'fiberhome') {
            emailContent.textContent = emailTemplates.fiberhome.trim();
            emailPreview.classList.remove('hidden');
        } else if (selectedTemplate === 'devolucao') {
            destinatarioContainer.classList.remove('hidden');
            tipoOperacaoContainer.classList.remove('hidden');
        } else if (selectedTemplate === 'pdaf') {
            pdafOptions.classList.remove('hidden');
        }
    });

    destinatarioSelect.addEventListener('change', updateDevolucaoEmail);
    tipoOperacaoSelect.addEventListener('change', updateDevolucaoEmail);
    tipoSelect.addEventListener('change', updatePdAfEmail);
    nfsInput.addEventListener('input', updatePdAfEmail);
    eanInput.addEventListener('input', updatePdAfEmail);
    swqtInput.addEventListener('input', updatePdAfEmail);

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
