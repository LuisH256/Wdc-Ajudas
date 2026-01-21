document.addEventListener('DOMContentLoaded', () => {

    // 1. Mapeamento de Elementos (Redução de Repetição)
    const elements = [
        'email-template', 'sac-template', 'sac-options', 'apoio-vendas-options',
        'destinatario-container', 'tipo-operacao-container', 'pdaf-options',
        'solar-options', 
        'ticket-correios-options', // ID para o container principal de tickets (Ticket para advanceds)
        'email-preview', 'email-content', 'recusa-nf-options',
        'destinatario', 'tipo-operacao', 'tipo-select', 'nfs-input',
        'ean-input', 'swqt-input', 'nf-input', 'valor-unitario-input',
        'quantidade-input', 'ncm-input', 'descricao-input', 'nf-recusa-input',
        'descricao-recusa-input', 'produto-desc-input', 'ticket-input',
        'data-emissao-input', 'data-validade-input', 'ticket-expirado-input',
        'ticket-input-expired', 'data-emissao-input-expired',
        'data-validade-input-expired', 'postagem-correios-template',
        'primeiro-ticket-options', 'ticket-expirado-options',
        'nf-input-postagem', // NF de retorno para primeiro ticket
    ].reduce((acc, id) => {
        acc[id.replace(/-/g, '_')] = document.getElementById(id);
        return acc;
    }, {});

    // Mantenha os templates e dados estáticos fora da função principal
    const TEMPLATES = {
        recusa_nf: `{{saudacao}}\n\nReferente a NF {{nf}} na qual {{descricao}} \n\nPrecisamos da recusa eletrônica para que possamos realizar a entrada fiscal, favor seguir instrução abaixo. Favor nos confirmar assim que efetuar a operação. \n\n*Manifestar como operação não realizada \n\n<b>Pode realizar a Manifestação de maneira on-line, sem precisar baixar o aplicativo, basta ter acesso ao e-cnpj da empresa e a chave de acesso a nota fiscal.</b>\n\n<img src="imgs/teste.png" alt="Instrução de Manifestação"> \n\nFavor sinalizar caso haja alguma divergência no processo. \n\nFicamos a disposição para maiores esclarecimentos.`,
        primeiro_ticket: `{{saudacao}}\n\nO seu produto {{produto}} trocado referente a NF {{nf}} de compra, já consta como entregue.  Informamos que enviamos um  email a parte junto aos correios com uma Autorização de Postagem do produto  substituído, você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b>\n\nTicket: {{ticket}}\n\nData de emissão: {{data_emissao}}\n\nData de validade: {{data_validade}}\n\n<b>*A data de validade do ticket deverá ser respeitada como prazo para postagem.</b>\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.`,
        devolucao: `Informamos que a sua solicitação de devolução da NF foi aprovada.
        
Importante: Os produtos remetidos para retorno devem ser embalados de forma que garantam sua integridade física, permitindo a conferência do Número de Série e/ou MAC Address. Os produtos serão vistoriados no recebimento para assegurar que correspondem aos da NF de compra.

Segue abaixo a instrução para emissão da Nota Fiscal de devolução:
O envio do anexo da NF em resposta a este e-mail é obrigatório para validação antes do envio do material.

<b>Natureza de Operação: {{operacao}}</b><br>
<b>CFOP:</b> {{cfop}}<br>
<b>Destinatário:</b><br>{{destinatario}}<br><br>

A NF deverá conter os mesmos valores unitários, totais e alíquotas da nota original. Não é necessário devolver a NF inteira, caso se trate de devolução parcial.

No campo de “dados adicionais” da NF, mencionar:  
{{dados_adicionais}}

Aguardamos a nota fiscal emitida para prosseguimento.`,
        pdaf: `Favor verificar entrada no {{tipo}} RMA que virou devolução,
seguir também com {{notas_servico}}, ref {{nfs}}.

EAN {{ean}}

{{swqt}}`,
        troca_solar: `{{saudacao}}\n\nSeguem instruções para emissão da nota fiscal de retorno de troca em garantia para seguirmos com o processo de troca do seu produto {{nfText}}.\n\n<b>Natureza da Operação:</b> Entrada para troca em garantia.\n\nCFOP: 6949 (outros estados) / 5949\n\n<b>VALOR UNITÁRIO:</b> R$ {{valorUnitario}}\n\n<b>QUANTIDADE:</b> {{quantidade}}\n\n<b>NCM DO ITEM:</b> {{ncm}}\n\nDESCRIÇÃO ITEM: {{descricao}}\n\n<b>DESTINATÁRIO:</b> LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA\nCNPJ: 05.917.486/0001-40 - I.E: 63250303\nROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8\nIGUAPE – ILHÉUS/BA\n45658-335\n\n<b>OBS:</b> No aguardo da pré nota para validação.`,
        // 'substituicao_componentes' removido
        envio_material_devolucao: `<b>ENVIO DE MATERIAL - DEVOLUÇÃO</b>

<br><br>Mediante validação da Nota fiscal de devolução enviada, segue abaixo procedimento para envio do material a ser devolvido.

<br><br><span style="color: #FF0000;"><b>Lembrete:</b></span> Os produtos remetidos para retorno devem ser devolvidos embalados de forma que garantam sua integridade física, que seja possível conferir o Número de série e/ou Mac Address. Os produtos necessariamente serão vistoriados no recebimento, de forma a garantir que sejam os mesmos remetidos na NF de compra.

<br><br>- O material deve acompanhar a nota fiscal física de devolução emitida.

<br><br><b>Segue endereço para envio do material:</b><br>
{{endereco}}

{{observacao_simoes}}

<br><br><b>Favor nos sinalizar assim que o material for enviado e se possível informar o código de rastreio!</b>`,
        // Template RENOMEADO
        ticket_para_advanceds: { 
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

Ficamos à disposição para maiores esclarecimentos.`,
            // 'informativo_fiberhome' removido
        }
    };

    const DESTINATARIOS = {
        matriz: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA<br>
ROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8<br>
IGUAPE – ILHÉUS/BA  CEP: 45658-335<br>
CNPJ: 05.917.486/0001-40 - I.E: 63250303`,
        simoes: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO S.A<br>
CNPJ: 05.917.486/0008-17  I.E: 153759695<br>
V URBANA, 4466 Complemento: TERREO CIA SUL<br>
Cep: 43721-450 SIMOES FILHO/BA`
    };

    const OPERACOES = {
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

    // 2. Funções Auxiliares
    const getSaudacao = () => new Date().getHours() < 12 ? "Bom dia!" : "Boa tarde!";

    /**
     * Define a visibilidade de um elemento.
     * @param {HTMLElement} element O elemento a ser manipulado.
     * @param {boolean} isVisible Se deve ser visível (true) ou escondido (false).
     */
    const setVisibility = (element, isVisible) => {
        if (element) {
            element.classList.toggle('hidden', !isVisible);
        }
    };

    /**
     * Limpa os campos de input e esconde as opções.
     */
    const resetFields = () => {
        // Limpa campos de input de texto
        document.querySelectorAll('input[type="text"], input[type="tel"]').forEach(input => input.value = '');
        
        // Oculta todos os contêineres de opções de forma genérica
        const containersToHide = [
            'destinatario_container', 'tipo_operacao_container', 'pdaf_options',
            'solar_options', 
            'ticket_correios_options', // Container de Tickets
            'email_preview', 'recusa_nf_options', 'sac_options',
            'apoio_vendas_options', 'primeiro_ticket_options', 'ticket_expirado_options'
        ];
        containersToHide.forEach(id => setVisibility(elements[id], false));
        
        // Limpa os selects
        if (elements.destinatario) elements.destinatario.value = '';
        if (elements.tipo_operacao) elements.tipo_operacao.value = '';
        if (elements.tipo_select) elements.tipo_select.value = 'PD'; // Valor padrão
        if (elements.postagem_correios_template) elements.postagem_correios_template.value = '';

        // Garante que os campos EAN/SWQT de PD/AF estejam visíveis por padrão
        setVisibility(elements.ean_input, true);
        setVisibility(elements.swqt_input, true);
    };

    // 3. Funções de Atualização de Email (Simplificadas)

    const updateRecusaNfEmail = () => {
        const nf = elements.nf_recusa_input.value || '...';
        const descricao = elements.descricao_recusa_input.value || '...';
        
        const emailText = TEMPLATES.recusa_nf
            .replace('{{saudacao}}', getSaudacao())
            .replace('{{nf}}', nf)
            .replace('{{descricao}}', descricao);
        
        elements.email_content.innerHTML = emailText.trim();
        setVisibility(elements.email_preview, true);
    };

    const updateDevolucaoEmail = () => {
        const destinatario = DESTINATARIOS[elements.destinatario.value] || '';
        const operacaoInfo = OPERACOES[elements.tipo_operacao.value] || {};

        if (destinatario && operacaoInfo.operacao) {
            const emailText = TEMPLATES.devolucao
                .replace('{{destinatario}}', destinatario)
                .replace('{{operacao}}', operacaoInfo.operacao)
                .replace('{{cfop}}', operacaoInfo.cfop)
                .replace('{{dados_adicionais}}', operacaoInfo.dados_adicionais);
            
            elements.email_content.innerHTML = emailText.trim();
            setVisibility(elements.email_preview, true);
        } else {
            setVisibility(elements.email_preview, false);
        }
    };

    const updateEnvioMaterialEmail = () => {
        const destinatarioKey = elements.destinatario.value;
        const endereco = DESTINATARIOS[destinatarioKey] || '...';
        
        let obsSimoes = "";
if (destinatarioKey === 'simoes') {
    obsSimoes = `<br><br><span style="color: #FF0000; font-size: 16px;"><b>ATENÇÃO: OBSERVAÇÃO IMPORTANTE (SIMÕES FILHO/BA)</b></span><br>` +
                `Referente às tratativas de devoluções para a unidade de <b>Simões Filho/BA</b>, informamos que é <b>OBRIGATÓRIO</b> o agendamento prévio.<br><br>` +
                `<span style="color: #0000FF;"><b>Para realizar o agendamento, envie um e-mail para:</b></span><br>` +
                `<span style="color: #FF0000;"><b>iemilli@toplogba.com.br</b></span><br>` +
                `<span style="color: #FF0000;"><b>operacional@toplogba.com.br</b></span>`;
}

        if (destinatarioKey) {
            const emailText = TEMPLATES.envio_material_devolucao
                .replace('{{endereco}}', endereco)
                .replace('{{observacao_simoes}}', obsSimoes);
            
            elements.email_content.innerHTML = emailText.trim();
            setVisibility(elements.email_preview, true);
        } else {
            setVisibility(elements.email_preview, false);
        }
    };

    
    const updatePdAfEmail = () => {
        const tipo = elements.tipo_select.value || 'PD';
        const ean = elements.ean_input.value || '...';
        const nfs = elements.nfs_input.value || '...';
        const swqt = elements.swqt_input.value || '';

        const nfsArray = nfs.split(',').map(item => item.trim());
        const nfsMessage = nfsArray.length === 1 && nfsArray[0] ? `a nota fiscal ${nfsArray[0]}` : `as notas fiscais ${nfsArray.filter(n => n).join(', ')}`;
        
        const swqtArray = swqt.split(',').map(item => item.trim()).filter(i => i);
        const notasServicoMessage = swqtArray.length <= 1 ? 'a nota de serviço' : 'as notas de serviço';
        const swqtMessage = swqtArray.join('\n');

        let emailText = TEMPLATES.pdaf
            .replace('{{tipo}}', tipo)
            .replace('{{notas_servico}}', notasServicoMessage)
            .replace('{{nfs}}', nfsMessage)
            .replace('{{ean}}', ean)
            .replace('{{swqt}}', swqtMessage);
        
        // Lógica de visibilidade e ajuste de texto para AF (CORRIGIDA)
        // EAN e SW/QT são mantidos visíveis para ambos (PD e AF),
        // mas a mensagem do e-mail é ajustada para AF.
        if (tipo === 'AF') {
            emailText = emailText
                // Remove a parte "seguir também com notas_servico" para AF
                .replace(/seguir também com (a nota de serviço|as notas de serviço),/g, '')
                // Remove a linha do EAN no template para AF
                .replace(/EAN .*\n/g, ''); 
        }

        // Garante que os campos EAN e SW/QT fiquem visíveis para ambos (PD e AF)
        setVisibility(elements.ean_input, true);
        setVisibility(elements.swqt_input, true);

        elements.email_content.innerHTML = emailText.trim();
        setVisibility(elements.email_preview, true);
    };

    const updateSolarEmail = (templateKey) => {
        const nf = elements.nf_input.value || '...';
        const valorUnitario = elements.valor_unitario_input.value || '...';
        const quantidade = elements.quantidade_input.value || '...';
        const ncm = elements.ncm_input.value || '...';
        const descricao = elements.descricao_input.value || '...';

        const nfText = nf.includes(',') ? `das NFs ${nf}` : `da NF ${nf}`;

        const emailText = TEMPLATES[templateKey]
            .replace('{{saudacao}}', getSaudacao())
            .replace('{{nfText}}', nfText)
            .replace('{{valorUnitario}}', valorUnitario)
            .replace('{{quantidade}}', quantidade)
            .replace('{{ncm}}', ncm)
            .replace('{{descricao}}', descricao);

        elements.email_content.innerHTML = emailText.trim();
        setVisibility(elements.email_preview, true);
    };

    // Função RENOMEADA
    const updateTicketParaAdvancedsEmail = (templateKey) => {
        const templateData = TEMPLATES.ticket_para_advanceds[templateKey];
        if (!templateData) return;

        let emailText = templateData;
        const nf = elements.nf_input_postagem ? elements.nf_input_postagem.value : '...';
        const produtoDesc = elements.produto_desc_input ? elements.produto_desc_input.value : '...';

        if (templateKey === 'primeiro_ticket') {
            emailText = emailText
                .replace('{{produtoDesc}}', produtoDesc)
                .replace('{{nf}}', nf)
                .replace('{{ticket}}', elements.ticket_input.value || '...')
                .replace('{{dataEmissao}}', elements.data_emissao_input.value || '...')
                .replace('{{dataValidade}}', elements.data_validade_input.value || '...');
        } else if (templateKey === 'ticket_expirado') {
            emailText = emailText
                .replace('{{ticketExpirado}}', elements.ticket_expirado_input.value || '...')
                .replace('{{ticket}}', elements.ticket_input_expired.value || '...')
                .replace('{{dataEmissao}}', elements.data_emissao_input_expired.value || '...')
                .replace('{{dataValidade}}', elements.data_validade_input_expired.value || '...');
        }
        
        elements.email_content.innerHTML = emailText.trim();
        setVisibility(elements.email_preview, true);
    };
    
    // 4. Lógica de Manipulação de Eventos

    /**
     * Mapeamento da lógica de exibição de opções
     */
    const templateMap = {
        // Mapeamento principal (email-template)
        'email-template': {
            sac: () => setVisibility(elements.sac_options, true),
            apoio_vendas: () => setVisibility(elements.apoio_vendas_options, true),
        },
        // Mapeamento secundário (sac-template)
        'sac-template': {
            devolucao: () => {
                setVisibility(elements.destinatario_container, true);
                setVisibility(elements.tipo_operacao_container, true);
            },
            solicitar_entrada_nf: () => setVisibility(elements.pdaf_options, true), // RENOMEADO pdaf -> solicitar_entrada_nf
            troca_solar: () => setVisibility(elements.solar_options, true), 
            // 'substituicao_componentes' removido
            envio_material_devolucao: () => {
                setVisibility(elements.destinatario_container, true);
                updateEnvioMaterialEmail(); 
            },
            // NOVO/RENOMEADO
            ticket_para_advanceds: () => setVisibility(elements.ticket_correios_options, true),
            recusa_nf: () => setVisibility(elements.recusa_nf_options, true),
        }
    };

    /**
     * Função genérica para lidar com a mudança de templates.
     * @param {string} templateId O ID do select que mudou ('email-template' ou 'sac-template').
     * @param {string} value O valor selecionado.
     */
    const handleTemplateChange = (templateId, value) => {
        // Se for o template principal, reseta tudo
        if (templateId === 'email-template') {
            resetFields(); 
            if (templateMap['email-template'][value]) {
                templateMap['email-template'][value]();
            }
        } 
        
        // Se for o template SAC, apenas reseta os campos específicos e opções SAC
        if (templateId === 'sac-template') {
            // Esconde todas as sub-opções antes de mostrar a correta
            const sacSubContainersToHide = [
                'destinatario_container', 'tipo_operacao_container', 'pdaf_options', 
                'solar_options', 'recusa_nf_options', 'email_preview', 'ticket_correios_options'
            ];
            sacSubContainersToHide.forEach(id => setVisibility(elements[id], false));
            
            if (templateMap['sac-template'][value]) {
                templateMap['sac-template'][value]();
            }
        }
        
        // Para Recusa NF, atualiza logo após o reset/mudança para mostrar o template base
        if (value === 'recusa_nf') {
            updateRecusaNfEmail();
        }

        // Para Solicitar Entrada NF, atualiza para mostrar o template base
        if (value === 'solicitar_entrada_nf') {
            updatePdAfEmail();
        }

        // Para Ticket para Advanceds, atualiza logo após o reset/mudança (caso já haja uma opção selecionada)
        if (value === 'ticket_para_advanceds' && elements.postagem_correios_template && elements.postagem_correios_template.value) {
             updateTicketParaAdvancedsEmail(elements.postagem_correios_template.value);
        }
    };

    // 5. Associação de Event Listeners

    // Lógica para selects principais (CHANGE)
    if (elements.email_template) elements.email_template.addEventListener('change', () => handleTemplateChange('email-template', elements.email_template.value));
    
    // Lógica para SAC template (CHANGE)
    if (elements.sac_template) elements.sac_template.addEventListener('change', () => handleTemplateChange('sac-template', elements.sac_template.value));
    
    // Lógica para Devoução/Envio Material (CHANGE)
    if (elements.destinatario) elements.destinatario.addEventListener('change', () => {
        if (elements.sac_template.value === 'envio_material_devolucao') {
            updateEnvioMaterialEmail();
        } else if (elements.sac_template.value === 'devolucao') {
            updateDevolucaoEmail();
        }
    });
    if (elements.tipo_operacao) elements.tipo_operacao.addEventListener('change', updateDevolucaoEmail);

    // Lógica para Solicitar Entrada NF (INPUT/CHANGE)
    // O campo 'tipo_select' (PD/AF) agora aciona a atualização do e-mail E do estado de visibilidade
    if (elements.tipo_select) elements.tipo_select.addEventListener('change', updatePdAfEmail);
    ['nfs_input', 'ean_input', 'swqt_input'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', updatePdAfEmail);
    });

    // Lógica para Troca Solar (INPUT)
    ['nf_input', 'valor_unitario_input', 'quantidade_input', 'ncm_input', 'descricao_input'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', () => {
            const template = elements.sac_template.value;
            if (template === 'troca_solar') { // 'substituicao_componentes' removido daqui
                updateSolarEmail(template);
            }
        });
    });

    // Lógica para Recusa NF (INPUT)
    ['nf_recusa_input', 'descricao_recusa_input'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', updateRecusaNfEmail);
    });

    // Lógica para Ticket para Advanceds (reintroduzida e ajustada)
    if (elements.postagem_correios_template) {
        elements.postagem_correios_template.addEventListener('change', () => {
            const selectedOption = elements.postagem_correios_template.value;
            setVisibility(elements.primeiro_ticket_options, selectedOption === 'primeiro_ticket');
            setVisibility(elements.ticket_expirado_options, selectedOption === 'ticket_expirado');
            
            if (selectedOption) {
                updateTicketParaAdvancedsEmail(selectedOption);
            } else {
                setVisibility(elements.email_preview, false);
            }
        });
    }

    if (elements.produto_desc_input) {
        elements.produto_desc_input.addEventListener('input', () => {
            if (elements.postagem_correios_template && elements.postagem_correios_template.value)
                updateTicketParaAdvancedsEmail(elements.postagem_correios_template.value);
        });
    }

    // Listeners para Primeiro Ticket
    ['nf_input_postagem', 'ticket_input', 'data_emissao_input', 'data_validade_input'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', () => {
            if (elements.postagem_correios_template && elements.postagem_correios_template.value === 'primeiro_ticket')
                updateTicketParaAdvancedsEmail('primeiro_ticket');
        });
    });

    // Listeners para Ticket Expirado
    ['ticket_expirado_input', 'ticket_input_expired', 'data_emissao_input_expired', 'data_validade_input_expired'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', () => {
            if (elements.postagem_correios_template && elements.postagem_correios_template.value === 'ticket_expirado')
                updateTicketParaAdvancedsEmail('ticket_expirado');
        });
    });
});








