document.addEventListener('DOMContentLoaded', () => {
    const emailTemplate = document.getElementById('email-template');
    const sacTemplate = document.getElementById('sac-template');
    const sacOptions = document.getElementById('sac-options');
    const apoioVendasOptions = document.getElementById('apoio-vendas-options');
    const destinatarioContainer = document.getElementById('destinatario-container');
    const tipoOperacaoContainer = document.getElementById('tipo-operacao-container');
    const pdafOptions = document.getElementById('pdaf-options');
    const solarOptions = document.getElementById('solar-options');
    const postagemCorreiosOptions = document.getElementById('postagem-correios-produtos-solar-options');
    const emailPreview = document.getElementById('email-preview');
    const emailContent = document.getElementById('email-content');

    const destinatarioSelect = document.getElementById('destinatario');
    const tipoOperacaoSelect = document.getElementById('tipo-operacao');
    const tipoSelect = document.getElementById('tipo-select');
    const nfsInput = document.getElementById('nfs-input');
    const eanInput = document.getElementById('ean-input');
    const swqtInput = document.getElementById('swqt-input');

    const nfInput = document.getElementById('nf-input');
    const valorUnitarioInput = document.getElementById('valor-unitario-input');
    const quantidadeInput = document.getElementById('quantidade-input');
    const ncmInput = document.getElementById('ncm-input');
    const descricaoInput = document.getElementById('descricao-input');

    const produtoDescInput = document.getElementById('produto-desc-input');
    const ticketInput = document.getElementById('ticket-input');
    const dataEmissaoInput = document.getElementById('data-emissao-input');
    const dataValidadeInput = document.getElementById('data-validade-input');
    const ticketExpiradoInput = document.getElementById('ticket-expirado-input');

    const emailTemplates = {
        devolucao: `Informamos que a sua solicitação de devolução da NF foi aprovada.
        
Importante: Os produtos remetidos para retorno devem ser embalados de forma que garantam sua integridade física, permitindo a conferência do Número de Série e/ou MAC Address. Os produtos serão vistoriados no recebimento para assegurar que correspondem aos da NF de compra.

Segue abaixo a instrução para emissão da Nota Fiscal de devolução:
O envio do anexo da NF em resposta a este e-mail é obrigatório para validação antes do envio do material.

<b>Natureza de Operação: {{operacao}}</b><br>
<b>CFOP:</b> {{cfop}}<br>
<b>Destinatário:</b><br>{{destinatario}}<br><br>

A NF deverá conter os mesmos valores unitários, totais e alíquotas da nota original. Não é necessário devolver a NF inteira, considerando que se trata de devolução parcial.

No campo de “dados adicionais” da NF, mencionar:  
{{dados_adicionais}}

Aguardamos a nota fiscal emitida para prosseguimento.`,
        pdaf: `Favor verificar entrada no {{tipo}} RMA que virou devolução,
seguir também com {{notas_servico}}, ref {{nfs}}.

EAN {{ean}}

{{swqt}}`,
        troca_solar: `{{saudacao}}\n\nSeguem instruções para emissão da nota fiscal de retorno de troca em garantia para seguirmos com o processo de troca do seu produto {{nfText}}.\n\n<b>Natureza da Operação:</b> Entrada para troca em garantia.\n\nCFOP: 6949 (outros estados) / 5949\n\n<b>VALOR UNITÁRIO:</b> R$ {{valorUnitario}}\n\n<b>QUANTIDADE:</b> {{quantidade}}\n\n<b>NCM DO ITEM:</b> {{ncm}}\n\nDESCRIÇÃO ITEM: {{descricao}}\n\n<b>DESTINATÁRIO:</b> LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA\nCNPJ: 05.917.486/0001-40 - I.E: 63250303\nROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8\nIGUAPE – ILHÉUS/BA\n45658-335\n\n<b>OBS:</b> No aguardo da pré nota para validação.`,
        substituicao_componentes: `{{saudacao}}\n\nSeguem instruções para emissão da nota fiscal de retorno de troca em garantia para seguirmos com o processo de troca do seu produto {{nfText}}.\n\n<b>Natureza da Operação:</b> Entrada para troca em garantia.\n\nCFOP: 6949 (outros estados) / 5949\n\n<b>VALOR UNITÁRIO:</b> R$ {{valorUnitario}}\n\n<b>QUANTIDADE:</b> {{quantidade}}\n\n<b>NCM DO ITEM:</b> {{ncm}}\n\nDESCRIÇÃO ITEM: {{descricao}}\n\n<b>DESTINATÁRIO:</b> LIVETECH DA BAHIA INDÚSTRIA E COMERCIO S.A\nCNPJ: 05.917.486/0008-17 - I.E: 153759695\nV URBANA, 4466 Complemento: TERREO CIA SUL\nCep: 43700-000 SIMOES FILHO/BA\n\n<b>OBS:</b> No aguardo da pré nota para validação.`,
        envio_material_devolucao: `ENVIO DE MATERIAL - DEVOLUÇÃO

Mediante validação da Nota fiscal de devolução enviada, segue abaixo procedimento para envio do material a ser devolvido.

<span style="color: red;"><b>Lembrete:</b></span> Os produtos remetidos para retorno devem ser devolvidos embalados de forma que garantam sua integridade física, que seja possível conferir o Número de série e/ou Mac Address. Os produtos necessariamente serão vistoriados no recebimento, de forma a garantir que sejam os mesmos remetidos na NF de compra.

- O material deve acompanhar a nota fiscal física de devolução emitida.

<b>Segue endereço para envio do material:</b><br>
{{endereco}}

<b>Favor nos sinalizar assim que o material for enviado e se possível informar o código de rastreio!</b>`,
        postagem_correios_produtos_solar: {
            primeiro_ticket: `O seu produto {{produtoDesc}} trocado referente à NF {{nf}} de compra, já consta como entregue. Informamos que enviamos um email a parte junto aos correios com uma Autorização de Postagem do produto substituído. Você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b>

<b>Ticket: {{ticket}}</b>
<b>Data de emissão: {{dataEmissao}}</b>
<b>Data de validade: {{dataValidade}}</b>

*A data de validade do ticket deverá ser respeitada como prazo para postagem.

Favor sinalizar caso haja alguma divergência no processo.

Ficamos à disposição para maiores esclarecimentos.`,
            ticket_expirado: `Informamos que devido à expiração do ticket {{ticketExpirado}} anteriormente emitido, emitimos um novo e enviamos um email a parte junto aos correios com uma nova Autorização de Postagem do item substituído. Você deverá se dirigir a uma Agência Própria Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).

<b>Ticket: {{ticket}}</b>
<b>Data de emissão: {{dataEmissao}}</b>
<b>Data de validade: {{dataValidade}}</b>

<span style="color: red;">A data de validade do ticket deverá ser respeitada como prazo para postagem evitando risco de uma nova expiração e o faturamento do produto em questão.</span>

Favor sinalizar caso haja alguma divergência no processo.

Ficamos à disposição para maiores esclarecimentos.`
        }
    };

    const destinatarios = {
        matriz: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA<br>
ROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8<br>
IGUAPE – ILHÉUS/BA  CEP: 45658-335<br>
CNPJ: 05.917.486/0001-40 - I.E: 63250303`,
        simoes: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO S.A<br>
CNPJ: 05.917.486/0008-17  I.E: 153759695<br>
V URBANA, 4466 Complemento: TERREO CIA SUL<br>
Cep: 43700-000 SIMOES FILHO/BA`
    };

    const operacoes = {
        locacao: {
            operacao: "Retorno de Locação",
            cfop: "5909 ou 6909 (Conforme dentro ou fora do estado)",
            dados_adicionais: `Retorno de locação, referente à NF nº ......., emitida em ....../....../........`
        },
        devolucao: {
            operacao: "Devolução de Compra para Comercialização",
            cfop: "6202 (Para fora da UF) e 5202 (Para a própria UF)",
            dados_adicionais: `Devolução recebida por meio da NF nº ......., emitida em ....../....../........`
        }
    };

    function getSaudacao() {
        const horaAtual = new Date().getHours();
        return horaAtual < 12 ? "Bom dia!" : "Boa tarde!";
    }

    function resetFields() {
        destinatarioContainer.classList.add('hidden');
        tipoOperacaoContainer.classList.add('hidden');
        pdafOptions.classList.add('hidden');
        solarOptions.classList.add('hidden');
        postagemCorreiosOptions.classList.add('hidden');
        emailContent.textContent = '';
        emailPreview.classList.add('hidden');
    }

    function resetSacFields() {
        destinatarioSelect.value = '';
        tipoOperacaoSelect.value = '';
        tipoSelect.value = '';
        nfsInput.value = '';
        eanInput.value = '';
        swqtInput.value = '';
        nfInput.value = '';
        valorUnitarioInput.value = '';
        quantidadeInput.value = '';
        ncmInput.value = '';
        descricaoInput.value = '';
        produtoDescInput.value = '';
        ticketInput.value = '';
        dataEmissaoInput.value = '';
        dataValidadeInput.value = '';
        ticketExpiradoInput.value = '';
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
        let emailText = emailTemplates.pdaf
            .replace('{{tipo}}', tipo)
            .replace('{{notas_servico}}', notasServicoMessage)
            .replace('{{nfs}}', nfsMessage)
            .replace('{{ean}}', ean)
            .replace('{{swqt}}', swqtMessage);
    
        // Remover a frase "seguir também com a nota de serviço," se o tipo for AF
        if (tipo === 'AF') {
            emailText = emailText.replace(/seguir também com (a nota de serviço|as notas de serviço),/g, '');
        }
    
        emailContent.innerHTML = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    function updateSolarEmail(templateKey) {
        const nf = nfInput.value || '...';
        const valorUnitario = valorUnitarioInput.value || '...';
        const quantidade = quantidadeInput.value || '...';
        const ncm = ncmInput.value || '...';
        const descricao = descricaoInput.value || '...';

        // Verifica se há uma vírgula e ajusta o texto da NF
        const nfText = nf.includes(',')
            ? `das NFs ${nf}`
            : `da NF ${nf}`;

        const emailText = emailTemplates[templateKey]
            .replace('{{saudacao}}', getSaudacao())
            .replace('{{nfText}}', nfText)
            .replace('{{valorUnitario}}', valorUnitario)
            .replace('{{quantidade}}', quantidade)
            .replace('{{ncm}}', ncm)
            .replace('{{descricao}}', descricao);

        emailContent.innerHTML = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    function updateEnvioMaterialEmail() {
        const destinatario = destinatarios[destinatarioSelect.value] || '...';

        const emailText = emailTemplates.envio_material_devolucao
            .replace('{{endereco}}', destinatario);

        emailContent.innerHTML = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    function updatePostagemCorreiosEmail(templateKey) {
        const produtoDesc = produtoDescInput.value || '...';
        const nf = nfInput.value || '...';
        const ticket = ticketInput.value || '...';
        const dataEmissao = dataEmissaoInput.value || '...';
        const dataValidade = dataValidadeInput.value || '...';
        const ticketExpirado = ticketExpiradoInput.value || '...';

        const emailText = emailTemplates.postagem_correios_produtos_solar[templateKey]
            .replace('{{produtoDesc}}', produtoDesc)
            .replace('{{nf}}', nf)
            .replace('{{ticket}}', ticket)
            .replace('{{dataEmissao}}', dataEmissao)
            .replace('{{dataValidade}}', dataValidade)
            .replace('{{ticketExpirado}}', ticketExpirado);

        emailContent.innerHTML = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    emailTemplate.addEventListener('change', () => {
        resetFields();
        sacOptions.classList.add('hidden');
        apoioVendasOptions.classList.add('hidden');

        const selectedTemplate = emailTemplate.value;

        if (selectedTemplate === 'sac') {
            sacOptions.classList.remove('hidden');
        } else if (selectedTemplate === 'apoio_vendas') {
            apoioVendasOptions.classList.remove('hidden');
        }
    });

    sacTemplate.addEventListener('change', () => {
        resetFields();
        resetSacFields();

        const selectedTemplate = sacTemplate.value;

        if (selectedTemplate === 'devolucao') {
            destinatarioContainer.classList.remove('hidden');
            tipoOperacaoContainer.classList.remove('hidden');
        } else if (selectedTemplate === 'pdaf') {
            pdafOptions.classList.remove('hidden');
        } else if (selectedTemplate === 'troca_solar' || selectedTemplate === 'substituicao_componentes') {
            solarOptions.classList.remove('hidden');
        } else if (selectedTemplate === 'envio_material_devolucao') {
            destinatarioContainer.classList.remove('hidden');
            updateEnvioMaterialEmail();
        } else if (selectedTemplate === 'postagem_correios_produtos_solar') {
            postagemCorreiosOptions.classList.remove('hidden');
        }
    });

    destinatarioSelect.addEventListener('change', () => {
        if (sacTemplate.value === 'envio_material_devolucao') {
            updateEnvioMaterialEmail();
        } else {
            updateDevolucaoEmail();
        }
    });
    
    tipoOperacaoSelect.addEventListener('change', updateDevolucaoEmail);
    tipoSelect.addEventListener('change', updatePdAfEmail);
    nfsInput.addEventListener('input', updatePdAfEmail);
    eanInput.addEventListener('input', updatePdAfEmail);
    swqtInput.addEventListener('input', updatePdAfEmail);

    nfInput.addEventListener('input', () => updateSolarEmail(sacTemplate.value));
    valorUnitarioInput.addEventListener('input', () => updateSolarEmail(sacTemplate.value));
    quantidadeInput.addEventListener('input', () => updateSolarEmail(sacTemplate.value));
    ncmInput.addEventListener('input', () => updateSolarEmail(sacTemplate.value));
    descricaoInput.addEventListener('input', () => updateSolarEmail(sacTemplate.value));

    produtoDescInput.addEventListener('input', () => updatePostagemCorreiosEmail('primeiro_ticket'));
    ticketInput.addEventListener('input', () => updatePostagemCorreiosEmail('primeiro_ticket'));
    dataEmissaoInput.addEventListener('input', () => updatePostagemCorreiosEmail('primeiro_ticket'));
    dataValidadeInput.addEventListener('input', () => updatePostagemCorreiosEmail('primeiro_ticket'));
    ticketExpiradoInput.addEventListener('input', () => updatePostagemCorreiosEmail('ticket_expirado'));
});