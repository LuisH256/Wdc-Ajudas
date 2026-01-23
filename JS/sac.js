document.addEventListener('DOMContentLoaded', () => {

    // 1. Mapeamento de Elementos (IDs convertidos para snake_case no objeto elements)
    const elements = [
        'email-template', 'sac-template', 'sac-options', 'apoio-vendas-options',
        'destinatario-container', 'tipo-operacao-container', 'pdaf-options',
        'solar-options', 'rma-fields',
        'ticket-correios-options', 
        'email-preview', 'email-content', 'recusa-nf-options',
        'destinatario', 'tipo-operacao', 'tipo-select', 'nfs-input',
        'ean-input', 'swqt-input', 'nf-input', 'valor-unitario-input',
        'quantidade-input', 'ncm-input', 'descricao-input', 'nf-recusa-input',
        'descricao-recusa-input', 'produto-desc-input', 'ticket-input',
        'data-emissao-input', 'data-validade-input', 'ticket-expirado-input',
        'ticket-input-expired', 'data-emissao-input-expired',
        'data-validade-input-expired', 'postagem-correios-template',
        'primeiro-ticket-options', 'ticket-expirado-options',
        'nf-input-postagem', 'crg-input', 'anexo-info-input',
        'pendencias-options', 'edi-select', 'nf-select'
    ].reduce((acc, id) => {
        const el = document.getElementById(id);
        if (el) {
            acc[id.replace(/-/g, '_')] = el;
        }
        return acc;
    }, {});

    const camposExclusivosCorreios = document.getElementById('campos-exclusivos-correios');

    // Mantenha os templates e dados estáticos
    const TEMPLATES = {
        recusa_nf: `{{saudacao}}\n\nReferente a NF {{nf}} na qual {{descricao}} \n\nPrecisamos da recusa eletrônica para que possamos realizar a entrada fiscal, favor seguir instrução abaixo. Favor nos confirmar assim que efetuar a operação. \n\n*Manifestar como operação não realizada \n\n<b>Pode realizar a Manifestação de maneira on-line, sem precisar baixar o aplicativo, basta ter acesso ao e-cnpj da empresa e a chave de acesso a nota fiscal.</b>\n\n<img src="imgs/teste.png" alt="Instrução de Manifestação"> \n\nFavor sinalizar caso haja alguma divergência no processo. \n\nFicamos a disposição para maiores esclarecimentos.`,
        primeiro_ticket: `{{saudacao}}\n\nO seu produto {{produto}} trocado referente a NF {{nf}} de compra, já consta como entregue. Informamos que enviamos um email a parte junto aos correios com uma Autorização de Postagem do produto substituído, você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b>\n\nTicket: {{ticket}}\n\nData de emissão: {{data_emissao}}\n\nData de validade: {{data_validade}}\n\n<b>*A data de validade do ticket deverá ser respeitada como prazo para postagem.</b>\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.`,
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
        envio_material_devolucao: `<b>ENVIO DE MATERIAL - DEVOLUÇÃO</b>

<br><br>Mediante validação da Nota fiscal de devolução enviada, segue abaixo procedimento para envio do material a ser devolvido.

<br><br><span style="color: #FF0000;"><b>Lembrete:</b></span> Os produtos remetidos para retorno devem be devolvidos embalados de forma que garantam sua integridade física, que seja possível conferir o Número de série e/ou Mac Address. Os produtos necessariamente serão vistoriados no recebimento, de forma a garantir que sejam os mesmos remetidos na NF de compra.

<br><br>O material deve acompanhar a nota fiscal física de devolução emitida.

<br><br><b>Segue endereço para envio do material:</b><br>
{{endereco}}

{{observacao_simoes}}

<br><br><b>Favor nos sinalizar assim que o material for enviado e se possível informar o código de rastreio!</b>`,

        advanced_emissao_envio: `<div>{{saudacao}}</div><br><div>Referente ao envio do seu produto <b>{{produto}}</b> trocado em advanced, identificamos que recebeu em <b>{{data_recebimento}}</b>.</div><br><div>Para finalização do fechamento fiscal e da operação de troca, precisamos que emita uma NF referente a unidade trocada (defeituosa) e o envio físico da mesma.</div><br><div>Segue em anexo a nota de compra para embasamento.</div><br><div><b>Favor seguir com a instrução abaixo:</b></div><br><div>Enviar nota fiscal de natureza da operação <b><u>REMESSA DE TROCA EM GARANTIA</u></b> (em resposta a este email para validação)</div><br><div><b>Destinatário:</b><br>{{destinatario}}</div><br><div>Usar na nota fiscal o <b>Código Fiscal de Operação 5.949 ou 6.949</b>, dependendo se for fora ou dentro do estado da Bahia.</div><br><div>Destacar impostos com a mesma alíquota da NF de compra</div><br><div><b>Utilizar o valor de venda de cada produto destacado na nota original de venda;</b></div><br><div><b>No campo informações complementares, inserir:</b></div><div>Número da(s) nota (s) de Venda de cada produto descrito.</div><div>Número da nota de Retorno de conserto (que segue anexa neste email)</div><br><div>Se for contribuinte (ter I.E.) e não emitir nota fiscal, deve enviar Nota Fiscal Avulsa emitida pela Sefaz;</div><br><div><b>Antes da emissão validada, gentileza encaminhar o arquivo da nfe sem valor fiscal, apenas para conferência.</b></div><br><div>Aguardamos o mais breve retorno e ficamos à disposição.</div>`,

        advanced_apenas_envio: `<div>{{saudacao}}</div><br><div>Referente ao envio do seu produto <b>{{produto}}</b> trocado em advanced, identificamos que recebeu em <b>{{data_recebimento}}</b>.</div><br><div><b>Favor seguir com o envio do material:</b></div><br><div>O material deve acompanhar a nota fiscal física de retorno, anteriormente emitida para o endereço:</div><br><div><b>Destinatário:</b><br>{{destinatario}}</div><br><div><b>Favor nos sinalizar assim que o material for enviado e se possível informar o código de rastreio!</b></div>`,

        devolucao_rma: `<div>{{saudacao}}</div><br>
        <div>Após testes identificamos que não será possível reparar os seus produtos referentes ao CRG <b>{{crg}}</b> e não temos novos em estoque para substituição, sendo assim oferecemos crédito em relação aos produtos. Segue em anexo a {{anexo}} e notas fiscais de compras, favor seguir com a instrução abaixo para realizarmos o processo de devolução.</div><br>
        <div><b>Emitir Nota Fiscal de {{tituloOperacao}} (enviar anexa em resposta a este email):</b></div><br>
        <div>QTD {{quantidade}}: {{produtoLabel}} <b>{{descricao}}</b></div><br>
        <div>• <b>Natureza de Operação:</b> {{natureza}}</div>
        <div>• <b>CFOP:</b> {{cfop}}</div>
        <div>• <b>Destinatário:</b><br>{{destinatario}}</div><br>
        <div>{{instrucaoValores}}</div><br>
        <div>No campo de “dados adicionais” da NF, favor mencionar:</div>
        <div>· Devolução recebida por meio da NF nº.......</div>`,

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
        }
    };

    const DESTINATARIOS = {
        matriz: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA<br>
ROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8 IGUAPE – ILHÉUS/BA<br>
CEP: 45658-335  CNPJ: 05.917.486/0001-40 - I.E: 63250303`,
        simoes: `LIVETECH DA BAHIA INDÚSTRIA E COMERCIO S.A<br>
CNPJ: 05.917.486/0008-17  I.E: 153759695<br>
V URBANA, 4466 Complemento: TERREO CIA SUL<br>
Cep: 43721-450 SIMOES FILHO/BA`
    };

    const OPERACOES = {
        locacao: {
            titulo: "Retorno de Locação",
            natureza: "Retorno de Locação",
            cfop: "5909 ou 6909 (Conforme dentro ou fora do estado)",
            instrucao: "A NF de devolução deverá ser devolvida com os mesmos valores correspondentes aos itens da NF de origem a serem devolvidos. Devem constar os mesmos valores unitários (não destacar impostos)."
        },
        devolucao: {
            titulo: "Devolução de Compra",
            natureza: "Devolução de Compra para Comercialização",
            cfop: "6202 (Para fora da UF) E 5202 (Para a própria UF)",
            instrucao: "A NF de devolução deverá ser devolvida com os mesmos valores correspondentes aos itens da NF de origem a serem devolvidos. Devem constar os mesmos valores unitários, valor total, IPI, ICMS e alíquota."
        }
    };

    // 2. Funções Auxiliares
    const getSaudacao = () => new Date().getHours() < 12 ? "Bom dia!" : "Boa tarde!";

    const setVisibility = (element, isVisible) => {
        if (element) {
            element.classList.toggle('hidden', !isVisible);
        }
    };

    const resetFields = (mode = 'total') => {
        if (mode === 'total') {
            document.querySelectorAll('input[type="text"], input[type="tel"]').forEach(input => input.value = '');
            const mainOptions = ['sac_options', 'apoio_vendas_options'];
            mainOptions.forEach(id => setVisibility(elements[id], false));
        }
        
        if (mode === 'sac_change') {
            document.querySelectorAll('input[type="text"], input[type="tel"]').forEach(input => input.value = '');
        }

        const containersToHide = [
            'destinatario_container', 'tipo_operacao_container', 'pdaf_options',
            'solar_options', 'rma_fields', 'ticket_correios_options', 'email_preview', 
            'recusa_nf_options', 'primeiro_ticket_options', 'ticket_expirado_options',
            'pendencias_options'
        ];

        containersToHide.forEach(id => {
            if (elements[id]) setVisibility(elements[id], false);
        });
        
        if (mode !== 'dest_only') {
            if (elements.destinatario) elements.destinatario.value = '';
            if (elements.tipo_operacao) elements.tipo_operacao.value = '';
            if (elements.tipo_select) elements.tipo_select.value = 'PD'; 
            if (elements.postagem_correios_template) elements.postagem_correios_template.value = '';
        }

        if (camposExclusivosCorreios) setVisibility(camposExclusivosCorreios, false);
    };

    // 3. Funções de Atualização de Email

    const updateDevolucaoRmaEmail = () => {
        const opKey = elements.tipo_operacao.value;
        const destKey = elements.destinatario.value;
        if (!opKey || !destKey) return;

        const opData = OPERACOES[opKey];
        const destData = DESTINATARIOS[destKey];
        const crg = elements.crg_input.value || '...';
        const anexo = elements.anexo_info_input.value || '...';
        const qtd = parseInt(elements.quantidade_input.value) || 0;
        const descricao = elements.descricao_input.value || '...';
        
        const produtoLabel = qtd > 1 ? "produtos" : "produto";

        const emailText = TEMPLATES.devolucao_rma
            .replace('{{saudacao}}', getSaudacao())
            .replace('{{crg}}', crg)
            .replace('{{anexo}}', anexo)
            .replace('{{tituloOperacao}}', opData.titulo)
            .replace('{{quantidade}}', qtd || '___')
            .replace('{{produtoLabel}}', produtoLabel)
            .replace('{{descricao}}', descricao)
            .replace('{{natureza}}', opData.natureza)
            .replace('{{cfop}}', opData.cfop)
            .replace('{{destinatario}}', destData)
            .replace('{{instrucaoValores}}', opData.instrucao);

        elements.email_content.innerHTML = emailText.trim();
        setVisibility(elements.email_preview, true);
    };

    const updateRecusaNfEmail = () => {
        const nf = elements.nf_recusa_input.value || '...';
        const descricao = elements.descricao_recusa_input.value || '...';
        const emailText = TEMPLATES.recusa_nf.replace('{{saudacao}}', getSaudacao()).replace('{{nf}}', nf).replace('{{descricao}}', descricao);
        elements.email_content.innerHTML = emailText.trim();
        setVisibility(elements.email_preview, true);
    };

    const updateDevolucaoEmail = () => {
        const sacVal = elements.sac_template.value;
        if (sacVal === 'devolucao_rma') {
            updateDevolucaoRmaEmail();
            return;
        }

        const destinatario = DESTINATARIOS[elements.destinatario.value] || '';
        const opMap = {
            locacao: {
                operacao: "Retorno de Locação",
                cfop: "5909 ou 6909 (Conforme dentro ou fora do estado)",
                dados_adicionais: "Retorno de locação, referente à NF nº ......., emitida em ....../....../........"
            },
            devolucao: {
                operacao: "Devolução de Compra para Comercialização",
                cfop: "6202 (Para fora da UF) e 5202 (Para a própria UF)",
                dados_adicionais: "Devolução recebida por meio da NF nº ......., emitida em ....../....../........"
            }
        };

        const operacaoInfo = opMap[elements.tipo_operacao.value] || {};
        if (destinatario && operacaoInfo.operacao) {
            const emailText = TEMPLATES.devolucao.replace('{{destinatario}}', destinatario).replace('{{operacao}}', operacaoInfo.operacao).replace('{{cfop}}', operacaoInfo.cfop).replace('{{dados_adicionais}}', operacaoInfo.dados_adicionais);
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
            obsSimoes = `<br><br><span style="color: #FF0000; font-size: 16px;"><b>ATENÇÃO: OBSERVAÇÃO IMPORTANTE (SIMÕES FILHO/BA)</b></span><br>Referente às entregas de devoluções para a unidade de <b>Simões Filho/BA</b>, informamos que é <b>OBRIGATÓRIO</b> o agendamento prévio.<br><br><span style="color: #0000FF;"><b>Para realizar o agendamento, envie um e-mail para:</b></span><br><span style="color: #FF0000;"><b>iemilli@toplogba.com.br</b></span><br><span style="color: #FF0000;"><b>operacional@toplogba.com.br</b></span>`;
        }
        if (destinatarioKey) {
            const emailText = TEMPLATES.envio_material_devolucao.replace('{{endereco}}', endereco).replace('{{observacao_simoes}}', obsSimoes);
            elements.email_content.innerHTML = emailText.trim();
            setVisibility(elements.email_preview, true);
        }
    };

    const updateAdvancedNovosTemplates = () => {
        const templateKey = elements.sac_template.value;
        const destinatarioKey = elements.destinatario.value;
        const endereco = DESTINATARIOS[destinatarioKey] || '...';
        const produto = elements.produto_desc_input.value || '...';
        const dataRecebimento = elements.data_emissao_input.value || '__/__/____';

        if (destinatarioKey) {
            const emailText = TEMPLATES[templateKey]
                .replace('{{saudacao}}', getSaudacao())
                .replace('{{produto}}', produto)
                .replace('{{data_recebimento}}', dataRecebimento)
                .replace('{{destinatario}}', endereco);
            
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
        let emailText = TEMPLATES.pdaf.replace('{{tipo}}', tipo).replace('{{notas_servico}}', notasServicoMessage).replace('{{nfs}}', nfsMessage).replace('{{ean}}', ean).replace('{{swqt}}', swqtArray.join('\n'));
        if (tipo === 'AF') emailText = emailText.replace(/seguir também com (a nota de serviço|as notas de serviço),/g, '').replace(/EAN .*\n/g, ''); 
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
        const emailText = TEMPLATES[templateKey].replace('{{saudacao}}', getSaudacao()).replace('{{nfText}}', nfText).replace('{{valorUnitario}}', valorUnitario).replace('{{quantidade}}', quantidade).replace('{{ncm}}', ncm).replace('{{descricao}}', descricao);
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
            emailText = emailText.replace('{{produtoDesc}}', produtoDesc).replace('{{nf}}', nf).replace('{{ticket}}', elements.ticket_input.value || '...').replace('{{dataEmissao}}', elements.data_emissao_input.value || '...').replace('{{dataValidade}}', elements.data_validade_input.value || '...');
        } else if (templateKey === 'ticket_expirado') {
            emailText = emailText.replace('{{ticketExpirado}}', elements.ticket_expirado_input.value || '...').replace('{{ticket}}', elements.ticket_input_expired.value || '...').replace('{{dataEmissao}}', elements.data_emissao_input_expired.value || '...').replace('{{dataValidade}}', elements.data_validade_input_expired.value || '...');
        }
        elements.email_content.innerHTML = emailText.trim();
        setVisibility(elements.email_preview, true);
    };
    
    // 4. Lógica de Eventos
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
            devolucao_rma: () => { 
                setVisibility(elements.destinatario_container, true); 
                setVisibility(elements.tipo_operacao_container, true); 
                setVisibility(elements.rma_fields, true);
                setVisibility(elements.solar_options, true);
                setVisibility(camposExclusivosCorreios, false);
            },
            solicitar_entrada_nf: () => setVisibility(elements.pdaf_options, true), 
            troca_solar: () => setVisibility(elements.solar_options, true), 
            envio_material_devolucao: () => { setVisibility(elements.destinatario_container, true); updateEnvioMaterialEmail(); },
            ticket_para_advanceds: () => { 
                setVisibility(elements.ticket_correios_options, true); 
                setVisibility(camposExclusivosCorreios, false); // CORREÇÃO: Fica oculto aqui, aparece via sub-opção se necessário
            },
            recusa_nf: () => setVisibility(elements.recusa_nf_options, true),
            advanced_emissao_envio: () => { 
                setVisibility(elements.destinatario_container, true); 
                setVisibility(camposExclusivosCorreios, true); 
            },
            advanced_apenas_envio: () => { 
                setVisibility(elements.destinatario_container, true); 
                setVisibility(camposExclusivosCorreios, true); 
            }
        }
    };

    const handleTemplateChange = (templateId, value) => {
        if (templateId === 'email-template') {
            resetFields('total');
            if (templateMap['email-template'][value]) templateMap['email-template'][value]();
        } 
        if (templateId === 'sac-template') {
            resetFields('sac_change');
            if (templateMap['sac-template'][value]) templateMap['sac-template'][value]();
        }
        if (value === 'recusa_nf') updateRecusaNfEmail();
        if (value === 'solicitar_entrada_nf') updatePdAfEmail();
    };

    // 5. Listeners
    if (elements.email_template) elements.email_template.addEventListener('change', () => handleTemplateChange('email-template', elements.email_template.value));
    if (elements.sac_template) elements.sac_template.addEventListener('change', () => handleTemplateChange('sac-template', elements.sac_template.value));
    
    if (elements.destinatario) elements.destinatario.addEventListener('change', () => {
        const sacVal = elements.sac_template.value;
        if (sacVal === 'envio_material_devolucao') updateEnvioMaterialEmail();
        else if (sacVal === 'devolucao' || sacVal === 'devolucao_rma') updateDevolucaoEmail();
        else if (sacVal === 'advanced_emissao_envio' || sacVal === 'advanced_apenas_envio') updateAdvancedNovosTemplates();
    });

    if (elements.tipo_operacao) elements.tipo_operacao.addEventListener('change', updateDevolucaoEmail);
    if (elements.tipo_select) elements.tipo_select.addEventListener('change', updatePdAfEmail);
    ['nfs_input', 'ean_input', 'swqt_input'].forEach(id => { if (elements[id]) elements[id].addEventListener('input', updatePdAfEmail); });
    ['nf_input', 'valor_unitario_input', 'quantidade_input', 'ncm_input', 'descricao_input'].forEach(id => { 
        if (elements[id]) elements[id].addEventListener('input', () => { 
            const sacVal = elements.sac_template.value;
            if (sacVal === 'troca_solar') updateSolarEmail('troca_solar'); 
            else if (sacVal === 'devolucao_rma') updateDevolucaoRmaEmail();
        }); 
    });
    ['crg_input', 'anexo_info_input'].forEach(id => { if (elements[id]) elements[id].addEventListener('input', updateDevolucaoRmaEmail); });
    ['nf_recusa_input', 'descricao_recusa_input'].forEach(id => { if (elements[id]) elements[id].addEventListener('input', updateRecusaNfEmail); });
    ['produto_desc_input', 'data_emissao_input'].forEach(id => { if (elements[id]) { elements[id].addEventListener('input', () => { const sacVal = elements.sac_template.value; if (sacVal === 'advanced_emissao_envio' || sacVal === 'advanced_apenas_envio') updateAdvancedNovosTemplates(); else if (elements.postagem_correios_template?.value) updateTicketParaAdvancedsEmail(elements.postagem_correios_template.value); }); } });

    if (elements.postagem_correios_template) {
        elements.postagem_correios_template.addEventListener('change', () => {
            const val = elements.postagem_correios_template.value;
            setVisibility(elements.primeiro_ticket_options, val === 'primeiro_ticket');
            setVisibility(elements.ticket_expirado_options, val === 'ticket_expirado');
            
            // Reativa campos de produto/data apenas se for "primeiro_ticket" dentro de Advanceds
            if (val === 'primeiro_ticket') setVisibility(camposExclusivosCorreios, true);
            else setVisibility(camposExclusivosCorreios, false);

            if (val) updateTicketParaAdvancedsEmail(val); else setVisibility(elements.email_preview, false);
        });
    }

    ['nf_input_postagem', 'ticket_input', 'data_validade_input'].forEach(id => { if (elements[id]) elements[id].addEventListener('input', () => { if (elements.postagem_correios_template?.value === 'primeiro_ticket') updateTicketParaAdvancedsEmail('primeiro_ticket'); }); });
    ['ticket_expirado_input', 'ticket_input_expired', 'data_emissao_input_expired', 'data_validade_input_expired'].forEach(id => { if (elements[id]) elements[id].addEventListener('input', () => { if (elements.postagem_correios_template?.value === 'ticket_expirado') updateTicketParaAdvancedsEmail('ticket_expirado'); }); });

    // Botão de Copiar
    const copyBtn = document.getElementById('copy-email');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const range = document.createRange();
            range.selectNode(elements.email_content);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            alert('E-mail copiado com sucesso!');
        });
    }
});
