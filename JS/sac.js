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
        recusa_nf: `{{saudacao}}<br><br>Referente a NF {{nf}} na qual {{descricao}}<br><br>Precisamos da recusa eletrônica para que possamos realizar a entrada fiscal, favor seguir instrução abaixo. Favor nos confirmar assim que efetuar a operação.<br><br>*Manifestar como operação não realizada<br><br><b>Pode realizar a Manifestação de maneira on-line, sem precisar baixar o aplicativo, basta ter acesso ao e-cnpj da empresa e a chave de acesso a nota fiscal.</b><br><br><img src="imgs/teste.png" alt="Instrução de Manifestação"><br><br>Favor sinalizar caso haja alguma divergência no processo.<br><br>Ficamos a disposição para maiores esclarecimentos.`,

        primeiro_ticket: `{{saudacao}}<br><br>O seu produto {{produto}} trocado referente a NF {{nf}} de compra, já consta como entregue. Informamos que enviamos um email a parte junto aos correios com uma Autorização de Postagem do produto substituído, você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b><br><br>Ticket: {{ticket}}<br><br>Data de emissão: {{data_emissao}}<br><br>Data de validade: {{data_validade}}<br><br><b>*A data de validade do ticket deverá ser respeitada como prazo para postagem.</b><br><br>Favor sinalizar caso haja alguma divergência no processo.<br><br>Ficamos a disposição para maiores esclarecimentos.`,

        devolucao: `Informamos que a sua solicitação de devolução da NF foi aprovada.<br><br>Importante: Os produtos remetidos para retorno devem ser embalados de forma que garantam sua integridade física, permitindo a conferência do Número de Série e/ou MAC Address. Os produtos serão vistoriados no recebimento para assegurar que correspondem aos da NF de compra.<br><br>Segue abaixo a instrução para emissão da Nota Fiscal de devolução:<br>O envio do anexo da NF em resposta a este e-mail é obrigatório para validação antes do envio do material.<br><br><b>Natureza de Operação: {{operacao}}</b><br><b>CFOP:</b> {{cfop}}<br><b>Destinatário:</b><br>{{destinatario}}<br><br>A NF deverá conter os mesmos valores unitários, totais e alíquotas da nota original. Não é necessário devolver a NF inteira, considerando que se trata de devolução parcial.<br><br>No campo de “dados adicionais” da NF, mencionar:<br>{{dados_adicionais}}<br><br>Aguardamos a nota fiscal emitida para prosseguimento.`,

        pdaf: `Favor verificar entrada no {{tipo}} RMA que virou devolução,<br>seguir também com {{notas_servico}}, ref {{nfs}}.<br><br>EAN {{ean}}<br><br>{{swqt}}`,

        troca_solar: `{{saudacao}}<br><br>Seguem instruções para emissão da nota fiscal de retorno de troca em garantia para seguirmos com o processo de troca do seu produto {{nfText}}.<br><br><b>Natureza da Operação:</b> Entrada para troca em garantia.<br><br>CFOP: 6949 (outros estados) / 5949<br><br><b>VALOR UNITÁRIO:</b> R$ {{valorUnitario}}<br><br><b>QUANTIDADE:</b> {{quantidade}}<br><br><b>NCM DO ITEM:</b> {{ncm}}<br><br>DESCRIÇÃO ITEM: {{descricao}}<br><br><b>DESTINATÁRIO:</b> LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA<br>CNPJ: 05.917.486/0001-40 - I.E: 63250303<br>ROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8<br>IGUAPE – ILHÉUS/BA<br>45658-335<br><br><b>OBS:</b> No aguardo da pré nota para validação.`,

        envio_material_devolucao: `<b>ENVIO DE MATERIAL - DEVOLUÇÃO</b><br><br>Mediante validação da Nota fiscal de devolução enviada, segue abaixo procedimento para envio do material a ser devolvido.<br><br><span style="color: red;"><b>Lembrete:</b></span> Os produtos remetidos para retorno devem ser devolvidos embalados de forma que garantam sua integridade física...<br><br>- O material deve acompanhar a nota fiscal física de devolução emitida.<br><br><b>Segue endereço para envio do material:</b><br>{{endereco}}{{observacao_simoes}}<br><br><b>Favor nos sinalizar assim que o material for enviado e se possível informar o código de rastreio!</b>`,
        
        ticket_para_advanceds: { 
            primeiro_ticket: `O seu produto {{produtoDesc}} trocado referente à NF {{nf}} de compra, já consta como entregue. Informamos que enviamos um email a parte junto aos correios com uma Autorização de Postagem do produto substituído. Você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b><br><br><b>Ticket: {{ticket}}</b><br><b>Data de emissão: {{dataEmissao}}</b><br><b>Data de validade: {{dataValidade}}</b><br><br>*A data de validade do ticket deverá ser respeitada como prazo para postagem.<br><br>Favor sinalizar caso haja alguma divergência no processo.<br><br>Ficamos à disposição para maiores esclarecimentos.`,
            ticket_expirado: `Informamos que devido à expiração do ticket {{ticketExpirado}} anteriormente emitido, emitimos um novo e enviamos um email a parte junto aos correios com uma nova Autorização de Postagem do item substituído. Você deverá se dirigir a uma Agência Própria Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).<br><br><b>Ticket: {{ticket}}</b><br><b>Data de emissão: {{dataEmissao}}</b><br><b>Data de validade: {{dataValidade}}</b><br><br><span style="color: red;">A data de validade do ticket deverá ser respeitada como prazo para postagem evitando risco de uma nova expiração e o faturamento do produto em questão.</span><br><br>Favor sinalizar caso haja alguma divergência no processo.<br><br>Ficamos à disposição para maiores esclarecimentos.`
        }
    };

    const DESTINATARIOS = {
        matriz: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA<br>ROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8<br>IGUAPE – ILHÉUS/BA  CEP: 45658-335<br>CNPJ: 05.917.486/0001-40 - I.E: 63250303`,
        simoes: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO S.A<br>CNPJ: 05.917.486/0008-17  I.E: 153759695<br>V URBANA, 4466 Complemento: TERREO CIA SUL<br>Cep: 43721-450 SIMOES FILHO/BA`
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

    const setVisibility = (element, isVisible) => {
        if (element) {
            element.classList.toggle('hidden', !isVisible);
        }
    };

    const resetFields = () => {
        document.querySelectorAll('input[type="text"], input[type="tel"]').forEach(input => input.value = '');
        
        const containersToHide = [
            'destinatario_container', 'tipo_operacao_container', 'pdaf_options',
            'solar_options', 
            'ticket_correios_options', 
            'email_preview', 'recusa_nf_options', 'sac_options',
            'apoio_vendas_options', 'primeiro_ticket_options', 'ticket_expirado_options'
        ];
        containersToHide.forEach(id => setVisibility(elements[id], false));
        
        if (elements.destinatario) elements.destinatario.value = '';
        if (elements.tipo_operacao) elements.tipo_operacao.value = '';
        if (elements.tipo_select) elements.tipo_select.value = 'PD';
        if (elements.postagem_correios_template) elements.postagem_correios_template.value = '';

        setVisibility(elements.ean_input, true);
        setVisibility(elements.swqt_input, true);
    };

    // 3. Funções de Atualização de Email

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
            // Injeção direta com as cores solicitadas (Vermelho e Azul)
            obsSimoes = `<br><br><b style="color: red;">ATENÇÃO: OBSERVAÇÃO IMPORTANTE (SIMÕES FILHO/BA)</b><br>` +
                        `Referente às tratativas de devoluções para a unidade de <b>Simões Filho/BA</b>, informamos que é <b>OBRIGATÓRIO</b> o agendamento prévio.<br><br>` +
                        `<b style="color: blue;">Para realizar o agendamento, envie um e-mail para:</b><br>` +
                        `<b style="color: red;">iemilli@toplogba.com.br<br>operacional@toplogba.com.br</b>`;
        }

        if (destinatarioKey) {
            let emailText = TEMPLATES.envio_material_devolucao
                .replace('{{endereco}}', endereco)
                .replace('{{observacao_simoes}}', obsSimoes);
            
            elements.email_content.innerHTML = emailText.trim();
            setVisibility(elements.email_preview, true);
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
        const swqtMessage = swqtArray.join('<br>');

        let emailText = TEMPLATES.pdaf
            .replace('{{tipo}}', tipo)
            .replace('{{notas_servico}}', notasServicoMessage)
            .replace('{{nfs}}', nfsMessage)
            .replace('{{ean}}', ean)
            .replace('{{swqt}}', swqtMessage);
        
        if (tipo === 'AF') {
            emailText = emailText
                .replace(/seguir também com (a nota de serviço|as notas de serviço),/g, '')
                .replace(/EAN .*<br>/g, ''); 
        }

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
    const templateMap = {
        'email-template': {
            sac: () => setVisibility(elements.sac_options, true),
            apoio_vendas: () => setVisibility(elements.apoio_vendas_options, true),
        },
        'sac-template': {
            devolucao: () => {
                setVisibility(elements.destinatario_container, true);
                setVisibility(elements.tipo_operacao_container, true);
            },
            solicitar_entrada_nf: () => setVisibility(elements.pdaf_options, true),
            troca_solar: () => setVisibility(elements.solar_options, true), 
            envio_material_devolucao: () => {
                setVisibility(elements.destinatario_container, true);
                updateEnvioMaterialEmail(); 
            },
            ticket_para_advanceds: () => setVisibility(elements.ticket_correios_options, true),
            recusa_nf: () => setVisibility(elements.recusa_nf_options, true),
        }
    };

    const handleTemplateChange = (templateId, value) => {
        if (templateId === 'email-template') {
            resetFields(); 
            if (templateMap['email-template'][value]) {
                templateMap['email-template'][value]();
            }
        } 
        
        if (templateId === 'sac-template') {
            const sacSubContainersToHide = [
                'destinatario_container', 'tipo_operacao_container', 'pdaf_options', 
                'solar_options', 'recusa_nf_options', 'email_preview', 'ticket_correios_options'
            ];
            sacSubContainersToHide.forEach(id => setVisibility(elements[id], false));
            
            if (templateMap['sac-template'][value]) {
                templateMap['sac-template'][value]();
            }
        }
        
        if (value === 'recusa_nf') updateRecusaNfEmail();
        if (value === 'solicitar_entrada_nf') updatePdAfEmail();
        if (value === 'ticket_para_advanceds' && elements.postagem_correios_template && elements.postagem_correios_template.value) {
             updateTicketParaAdvancedsEmail(elements.postagem_correios_template.value);
        }
    };

    // 5. Associação de Event Listeners
    if (elements.email_template) elements.email_template.addEventListener('change', () => handleTemplateChange('email-template', elements.email_template.value));
    if (elements.sac_template) elements.sac_template.addEventListener('change', () => handleTemplateChange('sac-template', elements.sac_template.value));
    
    if (elements.destinatario) elements.destinatario.addEventListener('change', () => {
        if (elements.sac_template.value === 'envio_material_devolucao') {
            updateEnvioMaterialEmail();
        } else if (elements.sac_template.value === 'devolucao') {
            updateDevolucaoEmail();
        }
    });

    if (elements.tipo_operacao) elements.tipo_operacao.addEventListener('change', updateDevolucaoEmail);
    if (elements.tipo_select) elements.tipo_select.addEventListener('change', updatePdAfEmail);

    ['nfs_input', 'ean_input', 'swqt_input'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', updatePdAfEmail);
    });

    ['nf_input', 'valor_unitario_input', 'quantidade_input', 'ncm_input', 'descricao_input'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', () => {
            const template = elements.sac_template.value;
            if (template === 'troca_solar') updateSolarEmail(template);
        });
    });

    ['nf_recusa_input', 'descricao_recusa_input'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', updateRecusaNfEmail);
    });

    if (elements.postagem_correios_template) {
        elements.postagem_correios_template.addEventListener('change', () => {
            const selectedOption = elements.postagem_correios_template.value;
            setVisibility(elements.primeiro_ticket_options, selectedOption === 'primeiro_ticket');
            setVisibility(elements.ticket_expirado_options, selectedOption === 'ticket_expirado');
            if (selectedOption) updateTicketParaAdvancedsEmail(selectedOption);
            else setVisibility(elements.email_preview, false);
        });
    }

    if (elements.produto_desc_input) {
        elements.produto_desc_input.addEventListener('input', () => {
            if (elements.postagem_correios_template && elements.postagem_correios_template.value)
                updateTicketParaAdvancedsEmail(elements.postagem_correios_template.value);
        });
    }

    ['nf_input_postagem', 'ticket_input', 'data_emissao_input', 'data_validade_input', 'ticket_expirado_input', 'ticket_input_expired', 'data_emissao_input_expired', 'data_validade_input_expired'].forEach(id => {
        if (elements[id]) elements[id].addEventListener('input', () => {
            const opt = elements.postagem_correios_template.value;
            if (opt) updateTicketParaAdvancedsEmail(opt);
        });
    });
});
