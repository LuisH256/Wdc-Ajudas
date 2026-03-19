document.addEventListener('DOMContentLoaded', () => {

    // 1. Mapeamento de Elementos (Incluído copy-email)
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
        'pendencias-options', 'edi-select', 'nf-select', 'copy-email'
    ].reduce((acc, id) => {
        const el = document.getElementById(id);
        if (el) {
            acc[id.replace(/-/g, '_')] = el;
        }
        return acc;
    }, {});

    const camposExclusivosCorreios = document.getElementById('campos-exclusivos-correios') || elements.campos_exclusivos_correios;

    
    
    const TEMPLATES = {
        recusa_nf: `<div>{{saudacao}}</div><br>
            <div>Referente a NF <b>{{nf}}</b> na qual {{descricao}}</div><br>
            <div>Precisamos da recusa eletrônica para que possamos realizar a entrada fiscal, favor seguir instrução abaixo. Favor nos confirmar assim que efetuar a operação.</div><br>
            <div><b>*Manifestar como operação não realizada</b></div><br>
            <div><b>Pode realizar a Manifestação de maneira on-line, sem precisar baixar o aplicativo, basta ter acesso ao e-cnpj da empresa e a chave de acesso a nota fiscal.</b></div><br>
            <img src="imgs/teste.png" alt="Instrução de Manifestação"><br><br>
            <div>Favor sinalizar caso haja alguma divergência no processo.</div>
            <div>Ficamos a disposição para maiores esclarecimentos.</div>`,

        primeiro_ticket: `<div>{{saudacao}}</div><br>
            <div>O seu produto <b>{{produto}}</b> trocado referente a NF <b>{{nf}}</b> de compra, já consta como entregue.</div><br>
            <div>Informamos que enviamos um email a parte junto aos correios com uma Autorização de Postagem do produto substituído, você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b></div><br>
            <div><b>Ticket:</b> {{ticket}}</div>
            <div><b>Data de emissão:</b> {{data_emissao}}</div>
            <div><b>Data de validade:</b> {{data_validade}}</div><br>
            <div><b>*A data de validade do ticket deverá ser respeitada como prazo para postagem.</b></div><br>
            <div>Favor sinalizar caso haja alguma divergência no processo.</div>
            <div>Ficamos a disposição para maiores esclarecimentos.</div>`,

        devolucao: `<div>Informamos que a sua solicitação de devolução da NF foi aprovada.</div><br>
            <div><b>Importante:</b> Os produtos remetidos para retorno devem ser embalados de forma que garantam sua integridade física, permitindo a conferência do Número de Série e/ou MAC Address. Os produtos serão vistoriados no recebimento para assegurar que correspondem aos da NF de compra.</div><br>
            <div>Segue abaixo a instrução para emissão da Nota Fiscal de devolução:</div>
            <div>O envio do anexo da NF em resposta a este e-mail é obrigatório para validação antes do envio do material.</div><br>
            <div>• <b>Natureza de Operação:</b> {{operacao}}</div>
            <div>• <b>CFOP:</b> {{cfop}}</div>
            <div>• <b>Destinatário:</b><br>{{destinatario}}</div><br>
            <div>A NF deverá conter os mesmos valores unitários, totais e alíquotas da nota original. Não é necessário devolver a NF inteira, caso se trate de devolução parcial.</div><br>
            <div>No campo de “dados adicionais” da NF, mencionar:</div>
            <div>{{dados_adicionais}}</div><br>
            <div>Aguardamos a nota fiscal emitida para prosseguimento.</div>`,

        pdaf: `<div>Favor verificar entrada no <b>{{tipo}}</b> RMA que virou devolução,</div>
            <div>seguir também com <b>{{notas_servico}}</b>, ref <b>{{nfs}}</b>.</div><br>
            <div><b>EAN:</b> {{ean}}</div><br>
            <div>{{swqt}}</div>`,

        troca_solar: `<div>{{saudacao}}</div><br>
            <div>Seguem instruções para emissão da nota fiscal de retorno de troca em garantia para seguirmos com o processo de troca do seu produto <b>{{nfText}}</b>.</div><br>
            <div>• <b>Natureza da Operação:</b> Entrada para troca em garantia.</div>
            <div>• <b>CFOP:</b> 6949 (outros estados) / 5949</div><br>
            <div><b>VALOR UNITÁRIO:</b> R$ {{valorUnitario}}</div>
            <div><b>QUANTIDADE:</b> {{quantidade}}</div>
            <div><b>NCM DO ITEM:</b> {{ncm}}</div>
            <div><b>DESCRIÇÃO ITEM:</b> {{descricao}}</div><br>
            <div><b>DESTINATÁRIO:</b><br>LIVETECH DA BAHIA INDÚSTRIA E COMERCIO LTDA<br>
            CNPJ: 05.917.486/0001-40 - I.E: 63250303<br>
            ROD BA 262, RODOVIA ILHEUS X URUCUCA, S/N KM 2,8<br>
            IGUAPE – ILHÉUS/BA - CEP: 45658-335</div><br>
            <div><b>OBS:</b> No aguardo da pré nota para validação.</div>`,

        envio_material_devolucao: `<div><b>ENVIO DE MATERIAL - DEVOLUÇÃO</b></div><br>
            <div>Mediante validação da Nota fiscal de devolução enviada, segue abaixo procedimento para envio do material a ser devolvido.</div><br>
            <div><span style="color: #FF0000;"><b>Lembrete:</b></span> Os produtos remetidos para retorno devem ser devolvidos embalados de forma que garantam sua integridade física, que seja possível conferir o Número de série e/ou Mac Address. Os produtos necessariamente serão vistoriados no recebimento, de forma a garantir que sejam os mesmos remetidos na NF de compra.</div><br>
            <div>O material deve acompanhar a nota fiscal física de devolução emitida.</div><br>
            <div><b>Segue endereço para envio do material:</b></div>
            <div>{{endereco}}</div><br>
            <div>{{observacao_simoes}}</div><br>
            <div><b>Favor nos sinalizar assim que o material for enviado e se possível informar o código de rastreio!</b></div>`,

        advanced_emissao_envio: `<div>{{saudacao}}</div><br><div>Referente ao envio do seu produto <b>{{produto}}</b> trocado em advanced, identificamos que recebeu em <b>{{data_recebimento}}</b>.</div><br><div>Para finalização do fechamento fiscal e da operação de troca, precisamos que emita uma NF referente a unidade trocada (defeituosa) e o envio físico dela mesma.</div><br><div>Segue em anexo a nota de compra para embasamento.</div><br><div><b>Favor seguir com a instrução abaixo:</b></div><br><div>Enviar nota fiscal de natureza da operação <b><u>REMESSA DE TROCA EM GARANTIA</u></b> (em resposta a este email para validação)</div><br><div><b>Destinatário:</b><br>{{destinatario}}</div><br><div>Usar na nota fiscal o <b>Código Fiscal de Operação 5.949 ou 6.949</b>, dependendo se for fora ou dentro do estado da Bahia.</div><br><div>Destacar impostos com a mesma alíquota da NF de compra</div><br><div><b>Utilizar o valor de venda de cada produto destacado na nota original de venda;</b></div><br><div><b>No campo informações complementares, inserir:</b></div><div>Número da(s) nota (s) de Venda de cada produto descrito.</div><div>Número da nota de Retorno de conserto (que segue anexa neste email)</div><br><div>Se for contribuinte (ter I.E.) e não emitir nota fiscal, deve enviar Nota Fiscal Avulsa emitida pela Sefaz;</div><br><div><b>Antes da emissão validada, gentileza encaminhar o arquivo da nfe sem valor fiscal, apenas para conferência.</b></div><br><div>Aguardamos o mais breve retorno e ficamos à disposição.</div>`,

        advanced_apenas_envio: `<div>{{saudacao}}</div><br><div>Referente ao envio do seu produto <b>{{produto}}</b> trocado em advanced, identificamos que recebeu em <b>{{data_recebimento}}</b>.</div><br><div><b>Favor seguir com o envio do material:</b></div><br><div>O material deve acompanhar a nota fiscal física de retorno, anteriormente emitida para o endereço:</div><br><div><b>Destinatário:</b><br>{{destinatario}}</div><br><div><b>Favor nos sinalizar assim que o material for enviado e se possível informar o código de rastreio!</b></div>`,

        devolucao_rma: `<div>{{saudacao}}</div><br>
            <div>Após testes identificamos que não será possível reparar os seus produtos referentes ao CRG <b>{{crg}}</b> e não temos novos em estoque para substituição, sendo assim oferecemos crédito em relação aos produtos. Segue em anexo a {{anexo}} e notas fiscais de compras, favor seguir com a instrução abaixo para realizarmos o processo de devolução.</div><br>
            <div><b>Emitir Nota Fiscal de {{tituloOperacao}} (enviar anexa em resposta a este email):</b></div><br>
            <div>QTD {{quantidade}} : {{produtoLabel}} <b>{{descricao}}</b></div><br>
            <div>• <b>Natureza de Operação:</b> {{natureza}}</div>
            <div>• <b>CFOP:</b> {{cfop}}</div>
            <div>• <b>Destinatário:</b><br>{{destinatario}}</div><br>
            <div>{{instrucaoValores}}</div><br>
            <div>No campo de “dados adicionais” da NF, favor mencionar:</div>
            <div>· Devolução recebida por meio da NF nº.......</div>`,

        troca_garantia_nova: `<div>{{saudacao}}</div><br>
            <div>Após testes identificamos que não será possível reparar o seu produto, sendo assim atenderemos com operação de troca em garantia. Segue em anexo recusa da nota favor seguir com a instrução abaixo para realizarmos o processo da troca do produto.</div><br>
            <div><b>Emitir Nota Fiscal de {{tituloOperacao}} (enviar anexa em resposta a este email):</b></div><br>
            <div>• <b>Natureza de Operação:</b> {{natureza}}</div>
            <div>• <b>CFOP:</b> {{cfop}}</div><br>
            <div><b>Destinatário:</b><br>{{destinatario}}</div><br>
            <div>{{instrucaoValores}}</div><br>
            <div>No campo de "dados adicionais" da NF, favor mencionar:</div>
            <div>· Devolução recebida por meio da NF nº.......</div>`,

        ticket_para_advanceds: { 
            primeiro_ticket: `<div>O seu produto <b>{{produtoDesc}}</b> trocado referente à NF <b>{{nf}}</b> de compra, já consta como entregue.</div><br>
                <div>Informamos que enviamos um email a parte junto aos correios com uma Autorização de Postagem do produto substituído. Você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b></div><br>
                <div><b>Ticket:</b> {{ticket}}</div>
                <div><b>Data de emissão:</b> {{dataEmissao}}</div>
                <div><b>Data de validade:</b> {{dataValidade}}</div><br>
                <div>*A data de validade do ticket deverá ser respeitada como prazo para postagem.</div><br>
                <div>Favor sinalizar caso haja alguma divergência no processo.</div>
                <div>Ficamos à disposição para maiores esclarecimentos.</div>`,
            
            ticket_expirado: `<div>Informamos que devido à expiração do ticket <b>{{ticketExpirado}}</b> anteriormente emitido, enviamos um novo e-mail com uma nova Autorização de Postagem.</div><br>
                <div>Você deverá se dirigir a uma Agência dos Correios levando: o Número do e-ticket, o objeto e a nota fiscal em anexo.</div><br>
                <div><b>Ticket:</b> {{ticket}}</div>
                <div><b>Data de emissão:</b> {{dataEmissao}}</div>
                <div><b>Data de validade:</b> {{dataValidade}}</div><br>
                <div><span style="color: red;"><b>A data de validade do ticket deverá ser respeitada como prazo para postagem evitando risco de uma nova expiração e o faturamento do produto.</b></span></div><br>
                <div>Favor sinalizar caso haja alguma divergência no processo.</div>
                <div>Ficamos à disposição para maiores esclarecimentos.</div>`
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
        },
        troca_garantia: {
            titulo: "Troca em Garantia",
            natureza: "Troca em garantia",
            cfop: "5949 ou 6949 (Conforme dentro ou fora do estado)",
            instrucao: "A NF de devolução deverá ser devolvida com os mesmos valores correspondentes aos itens da NF de origem a serem devolvidos. Devem constar os mesmos valores unitários (não destacar impostos)."
        }
    };

    // 3. Funções Auxiliares
    const getSaudacao = () => new Date().getHours() < 12 ? "Bom dia!" : "Boa tarde!";

    const setVisibility = (element, isVisible) => {
        if (element) {
            if (isVisible) element.classList.remove('hidden');
            else element.classList.add('hidden');
        }
    };

    const resetFields = (mode = 'total') => {
        if (mode === 'total') {
            document.querySelectorAll('input[type="text"], input[type="tel"], input[type="date"]').forEach(input => input.value = '');
            const mainOptions = ['sac_options', 'apoio_vendas_options'];
            mainOptions.forEach(id => setVisibility(elements[id], false));
        }
        
        if (mode === 'sac_change') {
            document.querySelectorAll('input[type="text"], input[type="tel"], input[type="date"]').forEach(input => input.value = '');
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

        if (camposExclusivosCorreios) setVisibility(camposExclusivosCorreios, false);
        
        document.querySelectorAll('#solar-options input, #solar-options label, #rma-fields input, #rma-fields label').forEach(el => {
            el.classList.remove('hidden');
            const parent = el.closest('div');
            if(parent && parent.id !== 'solar-options' && parent.id !== 'rma-fields') parent.classList.remove('hidden');
        });

        if (mode !== 'dest_only') {
            if (elements.destinatario) elements.destinatario.value = '';
            if (elements.tipo_operacao) elements.tipo_operacao.value = '';
            if (elements.tipo_select) elements.tipo_select.value = 'PD'; 
            if (elements.postagem_correios_template) elements.postagem_correios_template.value = '';
        }
    };

    // 4. Funções de Atualização de Email
    const updateTrocaGarantiaEmail = () => {
        const opKey = elements.tipo_operacao.value;
        const destKey = elements.destinatario.value;
        if (!opKey || !destKey) return;

        const opData = OPERACOES[opKey];
        const destData = DESTINATARIOS[destKey];

        const emailText = TEMPLATES.troca_garantia_nova
            .replace('{{saudacao}}', getSaudacao())
            .replace('{{tituloOperacao}}', opData.titulo)
            .replace('{{natureza}}', opData.natureza)
            .replace('{{cfop}}', opData.cfop)
            .replace('{{destinatario}}', destData)
            .replace('{{instrucaoValores}}', opData.instrucao || "");

        elements.email_content.innerHTML = emailText.trim().replace(/\n/g, '<br>');
        setVisibility(elements.email_preview, true);
    };

    const updateDevolucaoRmaEmail = () => {
        const opKey = elements.tipo_operacao.value;
        const destKey = elements.destinatario.value;
        if (!opKey || !destKey) return;
        
        const opData = OPERACOES[opKey];
        const destData = DESTINATARIOS[destKey];
        const crg = elements.crg_input.value || '...';
        const anexo = elements.anexo_info_input.value || '...';
        const qtd = parseInt(elements.quantidade_input.value) || 0;
        
        const descricao = elements.descricao_input.value || '';
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
        if (sacVal === 'devolucao_rma') { updateDevolucaoRmaEmail(); return; }
        if (sacVal === 'troca_garantia_nova') { updateTrocaGarantiaEmail(); return; }
        
        const destinatario = DESTINATARIOS[elements.destinatario.value] || '';
        const opMap = {
            locacao: { operacao: "Retorno de Locação", cfop: "5909 ou 6909 (Conforme dentro ou fora do estado)", dados_adicionais: "Retorno de locação, referente à NF nº ......., emitida em ....../....../........" },
            devolucao: { operacao: "Devolução de Compra para Comercialização", cfop: "6202 (Para fora da UF) e 5202 (Para a própria UF)", dados_adicionais: "Devolução recebida por meio da NF nº ......., emitida em ....../....../........" }
        };
        const operacaoInfo = opMap[elements.tipo_operacao.value] || {};
        if (destinatario && operacaoInfo.operacao) {
            const emailText = TEMPLATES.devolucao.replace('{{destinatario}}', destinatario).replace('{{operacao}}', operacaoInfo.operacao).replace('{{cfop}}', operacaoInfo.cfop).replace('{{dados_adicionais}}', operacaoInfo.dados_adicionais);
            elements.email_content.innerHTML = emailText.trim();
            setVisibility(elements.email_preview, true);
        } else { setVisibility(elements.email_preview, false); }
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
            const emailText = TEMPLATES[templateKey].replace('{{saudacao}}', getSaudacao()).replace('{{produto}}', produto).replace('{{data_recebimento}}', dataRecebimento).replace('{{destinatario}}', endereco);
            elements.email_content.innerHTML = emailText.trim();
            setVisibility(elements.email_preview, true);
        } else { setVisibility(elements.email_preview, false); }
    };

   const updatePdAfEmail = () => {
    // 1. Pega o valor do select (PD, AF ou vazio)
    const tipo = elements.tipo_select.value; 

    // 2. Se estiver no "Selecione uma opção", esconde o preview e para
    if (!tipo) {
        setVisibility(elements.email_preview, false);
        return;
    }

    const ean = elements.ean_input.value || '...';
    const nfs = elements.nfs_input.value || '...';
    const swqt = elements.swqt_input.value || '';

    // Tratamento das Notas Fiscais (nfs)
    const nfsArray = nfs.split(',').map(item => item.trim()).filter(i => i);
    const nfsMessage = nfsArray.length > 1 
        ? `as notas fiscais ${nfsArray.join(', ')}` 
        : (nfsArray[0] ? `a nota fiscal ${nfsArray[0]}` : '...');

    // Tratamento das Notas de Serviço (swqt)
    const swqtArray = swqt.split(',').map(item => item.trim()).filter(i => i);
    const notasServicoMessage = swqtArray.length > 1 ? 'as notas de serviço' : 'a nota de serviço';
    
    // Formata a lista de SWQT/Notas de Serviço com quebras de linha
    const swqtFormatado = swqtArray.join('<br>');
    const swqtFinal = swqtArray.length > 0 ? `<br><br>${swqtFormatado}` : '';

    // Montagem do texto base usando o template
    // IMPORTANTE: Certifique-se que no seu objeto TEMPLATES o pdaf usa {{tipo}} e não 'PD' fixo
    let emailText = TEMPLATES.pdaf
        .replace('{{tipo}}', tipo)
        .replace('{{notas_servico}}', notasServicoMessage)
        .replace('{{nfs}}', nfsMessage)
        .replace('{{ean}}', ean)
        .replace('{{swqt}}', swqtFinal);

    // Lógica específica para AF (Apoio de Fabricação)
    if (tipo === 'AF') {
        emailText = emailText
            // Remove a menção às notas de serviço e a vírgula que sobra
            .replace(/seguir também com (a nota de serviço|as notas de serviço),/g, '')
            // Remove a linha do EAN inteira (do "EAN" até o fim da linha ou quebra de linha)
            .replace(/EAN .*/g, '')
            // Remove espaços extras que podem sobrar após as remoções
            .replace(/\s{2,}/g, ' ');
    }

    // Renderiza no HTML convertendo quebras de linha em <br>
    elements.email_content.innerHTML = emailText.trim().replace(/\n/g, '<br>');
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
    
    // 5. Lógica de Eventos
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
            troca_garantia_nova: () => {
                setVisibility(elements.destinatario_container, true);
                setVisibility(elements.tipo_operacao_container, true);
            },
            devolucao_rma: () => { 
                setVisibility(elements.destinatario_container, true); 
                setVisibility(elements.tipo_operacao_container, true); 
                setVisibility(elements.rma_fields, true); 
                setVisibility(elements.solar_options, true); 
                
                // Remove campos não usados no RMA
                ['nf-input', 'valor-unitario-input', 'ncm-input', 'anexo-info-input'].forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.classList.add('hidden');
                        const label = document.querySelector(`label[for="${id}"]`);
                        if (label) label.classList.add('hidden');
                        const parent = input.closest('div');
                        if(parent && parent.id !== 'solar-options' && parent.id !== 'rma-fields') parent.classList.add('hidden');
                    }
                });
                
                if(elements.crg_input) {
                    elements.crg_input.classList.remove('hidden');
                    const lbl = document.querySelector('label[for="crg-input"]');
                    if(lbl) lbl.classList.remove('hidden');
                }
                if(elements.quantidade_input) {
                    elements.quantidade_input.classList.remove('hidden');
                    const lbl = document.querySelector('label[for="quantidade-input"]');
                    if(lbl) lbl.classList.remove('hidden');
                }
                if(elements.descricao_input) {
                    elements.descricao_input.classList.remove('hidden');
                    const lbl = document.querySelector('label[for="descricao-input"]');
                    if(lbl) lbl.classList.remove('hidden');
                }
            },
            solicitar_entrada_nf: () => {
                setVisibility(elements.pdaf_options, true);
                updatePdAfEmail(); // Força a atualização do texto ao selecionar
            },
            troca_solar: () => {
                setVisibility(elements.solar_options, true);
                ['nf-input', 'valor-unitario-input', 'ncm-input', 'quantidade-input', 'descricao-input'].forEach(id => {
                    const el = document.getElementById(id);
                    if(el) {
                        el.classList.remove('hidden');
                        const lbl = document.querySelector(`label[for="${id}"]`);
                        if(lbl) lbl.classList.remove('hidden');
                        const parent = el.closest('div');
                        if(parent && parent.id !== 'solar-options') parent.classList.remove('hidden');
                    }
                });
            }, 
            envio_material_devolucao: () => { setVisibility(elements.destinatario_container, true); },
            ticket_para_advanceds: () => { setVisibility(elements.ticket_correios_options, true); },
            recusa_nf: () => setVisibility(elements.recusa_nf_options, true),
            advanced_emissao_envio: () => { setVisibility(elements.destinatario_container, true); setVisibility(camposExclusivosCorreios, true); },
            advanced_apenas_envio: () => { setVisibility(elements.destinatario_container, true); setVisibility(camposExclusivosCorreios, true); }
        }
    };

    const handleTemplateChange = (templateId, value) => {
        if (templateId === 'email-template') { resetFields('total'); if (templateMap['email-template'][value]) templateMap['email-template'][value](); } 
        if (templateId === 'sac-template') { resetFields('sac_change'); if (templateMap['sac-template'][value]) templateMap['sac-template'][value](); }
        if (value === 'recusa_nf') updateRecusaNfEmail();
        if (value === 'solicitar_entrada_nf') updatePdAfEmail();
    };

    // 6. Listeners
    if (elements.email_template) elements.email_template.addEventListener('change', () => handleTemplateChange('email-template', elements.email_template.value));
    if (elements.sac_template) elements.sac_template.addEventListener('change', () => handleTemplateChange('sac-template', elements.sac_template.value));
    
    if (elements.destinatario) elements.destinatario.addEventListener('change', () => {
        const sacVal = elements.sac_template.value;
        if (sacVal === 'envio_material_devolucao') updateEnvioMaterialEmail();
        else if (sacVal === 'devolucao' || sacVal === 'devolucao_rma') updateDevolucaoEmail();
        else if (sacVal === 'troca_garantia_nova') updateTrocaGarantiaEmail();
        else if (sacVal === 'advanced_emissao_envio' || sacVal === 'advanced_apenas_envio') updateAdvancedNovosTemplates();
    });

    if (elements.tipo_operacao) elements.tipo_operacao.addEventListener('change', () => {
        const sacVal = elements.sac_template.value;
        if (sacVal === 'troca_garantia_nova') updateTrocaGarantiaEmail();
        else updateDevolucaoEmail();
    });

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
    
    ['produto_desc_input', 'data_emissao_input'].forEach(id => { 
        if (elements[id]) { 
            elements[id].addEventListener('input', () => { 
                const sacVal = elements.sac_template.value; 
                if (sacVal === 'advanced_emissao_envio' || sacVal === 'advanced_apenas_envio') updateAdvancedNovosTemplates(); 
                else if (elements.postagem_correios_template?.value) updateTicketParaAdvancedsEmail(elements.postagem_correios_template.value);
            }); 
        } 
    });

    if (elements.postagem_correios_template) {
        elements.postagem_correios_template.addEventListener('change', () => {
            const val = elements.postagem_correios_template.value;
            setVisibility(elements.primeiro_ticket_options, val === 'primeiro_ticket');
            setVisibility(elements.ticket_expirado_options, val === 'ticket_expirado');
            if (val === 'primeiro_ticket') setVisibility(camposExclusivosCorreios, true);
            else setVisibility(camposExclusivosCorreios, false);
            if (val) updateTicketParaAdvancedsEmail(val); else setVisibility(elements.email_preview, false);
        });
    }

    ['nf_input_postagem', 'ticket_input', 'data_validade_input'].forEach(id => { if (elements[id]) elements[id].addEventListener('input', () => { if (elements.postagem_correios_template?.value === 'primeiro_ticket') updateTicketParaAdvancedsEmail('primeiro_ticket'); }); });
    ['ticket_expirado_input', 'ticket_input_expired', 'data_emissao_input_expired', 'data_validade_input_expired'].forEach(id => { if (elements[id]) elements[id].addEventListener('input', () => { if (elements.postagem_correios_template?.value === 'ticket_expirado') updateTicketParaAdvancedsEmail('ticket_expirado'); }); });

   // Lógica do botão de copiar (Correção definitiva para fundo cinza)
    if (elements.copy_email) {
        elements.copy_email.addEventListener('click', () => {
            const content = elements.email_content;
            if (!content) return;

            // 1. Cria um elemento temporário fora da tela
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.backgroundColor = '#ffffff'; // Garante fundo branco
            tempDiv.innerHTML = content.innerHTML;
            document.body.appendChild(tempDiv);

            // 2. Seleciona o conteúdo deste elemento temporário
            const range = document.createRange();
            range.selectNodeContents(tempDiv);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            try {
                // 3. Executa a cópia
                const successful = document.execCommand('copy');
                if (successful) {
                    const originalText = elements.copy_email.innerText;
                    elements.copy_email.innerText = "Copiado! ✅";
                    elements.copy_email.style.backgroundColor = "#28a745";
                    
                    setTimeout(() => {
                        elements.copy_email.innerText = originalText;
                        elements.copy_email.style.backgroundColor = ""; 
                    }, 2000);
                }
            } catch (err) {
                console.error('Erro ao copiar:', err);
                alert('Não foi possível copiar o e-mail.');
            }

            // 4. Limpa tudo
            window.getSelection().removeAllRanges();
            document.body.removeChild(tempDiv);
        });
    }
});








