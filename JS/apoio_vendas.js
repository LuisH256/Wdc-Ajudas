// apoio_vendas.js

// Função para aplicar a máscara de data (DD/MM/AAAA)
function applyDateMask(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito

    // Limita a 8 dígitos (DDMMYYYY)
    if (value.length > 8) {
        value = value.substring(0, 8);
    }

    // Aplica a máscara: DD/MM/YYYY
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
        value = value.substring(0, 5) + '/' + value.substring(5);
    }

    input.value = value;
}


document.addEventListener('DOMContentLoaded', () => {

    // 1. OTIMIZAÇÃO: Agrupando todos os elementos DOM em um objeto
    const elements = {
        // Containers Principais
        emailTemplatePrincipal: document.getElementById('email-template'),
        emailPreview: document.getElementById('email-preview'),
        emailContent: document.getElementById('email-content'),
        apoioVendasTemplate: document.getElementById('apoio-vendas-template'),
        copyBtn: document.getElementById('copy-email'),

        // Opções de Campos
        pendenciasOptions: document.getElementById('pendencias-options'),
        recusaNfOptions: document.getElementById('recusa-nf-options'),
        primeiroTicketOptions: document.getElementById('primeiro-ticket-options'), 
        ticketExpiradoOptions: document.getElementById('ticket-expirado-options'),
        ticketCorreiosOptions: document.getElementById('ticket-correios-options'),
        
        // Inputs de Pendências
        ediSelect: document.getElementById('edi-select'),
        nfSelect: document.getElementById('nf-select'),

        // Inputs de Recusa NF / NF Retida
        nfRecusaInput: document.getElementById('nf-recusa-input'),
        descricaoRecusaInput: document.getElementById('descricao-recusa-input'),
        nfRetidaInput: document.getElementById('nf-retida-input'), 

        // Inputs de Primeiro Ticket (do HTML, que é nf-input-postagem)
        nfInputPostagem: document.getElementById('nf-input-postagem'), 
        ticketInput: document.getElementById('ticket-input'),
        dataEmissaoInput: document.getElementById('data-emissao-input'),
        dataValidadeInput: document.getElementById('data-validade-input'),

        // Inputs de Ticket Expirado
        ticketExpiradoInput: document.getElementById('ticket-expirado-input'),
        ticketInputExpired: document.getElementById('ticket-input-expired'),
        dataEmissaoInputExpired: document.getElementById('data-emissao-input-expired'),
        dataValidadeInputExpired: document.getElementById('data-validade-input-expired'),
        
        // Novo seletor do HTML para ticket correios
        postagemCorreiosTemplate: document.getElementById('postagem-correios-template'),
    };
    
    // Lista de todos os contêineres de opções a serem ocultados no reset
    const optionContainers = [
        elements.pendenciasOptions,
        elements.recusaNfOptions,
        elements.primeiroTicketOptions,
        elements.ticketExpiradoOptions,
        elements.ticketCorreiosOptions
    ].filter(el => el);
    
    // Lista de todos os inputs a serem resetados
    const allInputs = Object.values(elements).filter(el => el instanceof HTMLInputElement || el instanceof HTMLSelectElement);

    // 2. Templates de E-mail
    const emailTemplates = {
        
        relatorio_geral: `{{saudacao}}\n\nFavor nos posicionar urgente quanto as entregas das NFs abaixo que constam em atraso.(listar NFs atrasadas)\n\nRecebemos EDI de pendencias das NFs listadas abaixo. Favor informar se poderiamos intervir de alguma forma para resolução.(listar NFs com pendencias)\n\nAs NFs listadas abaixo não estão em atraso, porem  não recebemos ocorrencias(atualizações de EDI), precisamos que nos atualize quanto aos status e verifique internamente o envio de e-mails com atualizações de EDI.(listar NFs no prazo e sem ocorrencias)\n\nNão recebemos por email CTEs das NFs listadas abaixo, precisamos do envio urgente para monitoramento de entrega(listar NFs no prazo e sem ocorrencias)`,
        
        pendencias_singular: `{{saudacao}}\n\nRecebemos EDI de {{edi}} da NF {{nf}}. Favor nos posicionar urgente quanto ao status dessa entrega e se possui alguma pendencia que poderiamos intervir para que a entrega seja realizada no prazo.\n`,
        pendencias_plural: `{{saudacao}}\n\nRecebemos EDI de {{edi}} das NFs {{nf}}. Favor nos posicionar urgente quanto ao status dessas entregas e se possuem alguma pendencia que poderiamos intervir para que as entregas sejam realizadas no prazo.\n`,
        pendencias_lista: `{{saudacao}}\n\nRecebemos EDI de pendencias das NFs listadas abaixo. Favor nos posicionar urgente quanto aos status dessas entregas e se poderiamos intervir para que as entregas sejam realizadas no prazo.\n\n[Lista de NFs]`,
        recusa_nf: `{{saudacao}}\n\nReferente a NF {{nf_recusa}} na qual {{descricao}} \n\nPrecisamos da recusa eletrônica para que possamos realizar a entrada fiscal, favor seguir instrução abaixo. Favor nos confirmar assim que efetuar a operação. \n\n*Manifestar como operação não realizada \n\n<b>Pode realizar a Manifestação de maneira on-line, sem precisar baixar o aplicativo, basta ter acesso ao e-cnpj da empresa e a chave de acesso a nota fiscal.</b>\n\n<img src="imgs/teste.png" alt="Instrução de Manifestação"> \n\nFavor sinalizar caso haja alguma divergência no processo. \n\nFicamos a disposição para maiores esclarecimentos.`,
        nfs_retidas: `Prezado cliente,\n\nInformamos que o material da NF {{nf_recusa}} encontra-se retido junto a fiscalização, segue em anexo termo de retenção. Favor nos enviar o comprovante de pagamento assim que for realizado para darmos sequencia no processo de liberação e entrega da carga.\n\nPrezado cliente,\n\nMaterial da NF em anexo encontra-se retida na fiscalização, gentileza solucionar a pendência junto a SEFAZ para regularização. Por favor, assim que pago nos envie o comprovante de pagamento para darmos sequencia no processo de liberação e entrega da carga.\n\nSegue em anexo comprovante pago, gentileza dar seguimento na liberação e entrega da carga.\n\nDesde já agradeço.`,
        
        primeiro_ticket: `{{saudacao}}\n\nInformo que geramos junto aos correios uma Autorização de Postagem.\n\nVocê deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o(s)item(s) para postagem e a nota fiscal de retorno(a nota deverá acompanhar o produto).\n\nTicket: {{ticket}}\n\nData de emissão: {{data_emissao}}\n\nData de validade: {{data_validade}}\n\n*A data de validade do ticket deverá ser respeitada como prazo para postagem.\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.`,
        
        ticket_expirado: `{{saudacao}}\n\nInformamos que devido à expiração do ticket {{ticket_expirado}} anteriormente emitido, emitimos um novo e enviamos um email a parte junto aos correios com uma nova Autorização de Postagem do item substituído.\n\nVocê deverá se dirigir a uma Agência Própria Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).\n\nTicket: {{ticket_input_expired}}\n\nData de emissão: {{data_emissao_expired}}\n\nData de validade: {{data_validade_expired}}\n\nA data de validade do ticket deverá ser respeitada como prazo para postagem evitando risco de uma nova expiração e o faturamento do produto em questão.\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos à disposição para maiores esclarecimentos.`,
    };
    
    // 3. Funções Auxiliares 
    
    function getSaudacao() {
        const horaAtual = new Date().getHours();
        return horaAtual < 12 ? "Bom dia!" : "Boa tarde!";
    }

    function resetFields() {
        // Oculta contêineres específicos do Apoio
        optionContainers.forEach(container => container.classList.add('hidden'));

        // Limpa inputs (apenas se o template ativo for Apoio Vendas)
        if (elements.emailTemplatePrincipal.value === 'apoio_vendas') {
            allInputs.forEach(input => {
                if (input.id !== 'email-template' && input.id !== 'apoio-vendas-template' && input.type !== 'select-one') {
                     input.value = '';
                }
            });
            elements.emailContent.textContent = '';
            elements.emailPreview.classList.add('hidden');
        }
    }

    function updateEmail(templateKey, customReplacements = {}) {
        // Bloqueia execução se não estiver no modo Apoio Vendas
        if (elements.emailTemplatePrincipal.value !== 'apoio_vendas') return;

        let template = emailTemplates[templateKey];
        if (!template) return;

        let emailText = template.replace('{{saudacao}}', getSaudacao());

        const fieldMap = {
            '{{edi}}': elements.ediSelect,
            '{{nf}}': elements.nfSelect,
            '{{nf_recusa}}': elements.nfRecusaInput,
            '{{descricao}}': elements.descricaoRecusaInput,
            '{{nf_input}}': elements.nfInputPostagem, 
            '{{ticket}}': elements.ticketInput,
            '{{data_emissao}}': elements.dataEmissaoInput,
            '{{data_validade}}': elements.dataValidadeInput,
            '{{ticket_expirado}}': elements.ticketExpiradoInput,
            '{{ticket_input_expired}}': elements.ticketInputExpired,
            '{{data_emissao_expired}}': elements.dataEmissaoInputExpired,
            '{{data_validade_expired}}': elements.dataValidadeInputExpired,
        };
        
        for (const placeholder in fieldMap) {
            const element = fieldMap[placeholder];
            const value = element ? element.value || '...' : '...';
            emailText = emailText.replace(new RegExp(placeholder, 'g'), value);
        }
        
        for (const placeholder in customReplacements) {
            emailText = emailText.replace(new RegExp(placeholder, 'g'), customReplacements[placeholder]);
        }

        if (templateKey === 'recusa_nf' || templateKey === 'nfs_retidas') {
            elements.emailContent.innerHTML = emailText.trim();
        } else {
            elements.emailContent.textContent = emailText.trim();
        }
        
        elements.emailPreview.classList.remove('hidden');
    }

    // 4. Lógica de Atualização Centralizada

    function handleTemplateChange() {
        if (elements.emailTemplatePrincipal.value !== 'apoio_vendas') return;
        
        const selectedTemplate = elements.apoioVendasTemplate.value;
        resetFields();

        const templateMapping = {
            'relatorio_geral': () => updateEmail('relatorio_geral'), 
            'pendencias': () => elements.pendenciasOptions.classList.remove('hidden'),
            'pendencias_lista': () => updateEmail('pendencias_lista'),
            'recusa_nf': () => {
                elements.recusaNfOptions.classList.remove('hidden');
                updateEmail('recusa_nf');
            },
            'nfs_retidas': () => {
                elements.recusaNfOptions.classList.remove('hidden');
                updateEmail('nfs_retidas');
            },
            'ticket_correios': () => {
                elements.ticketCorreiosOptions.classList.remove('hidden');
                handlePostagemCorreiosChange();
            }
        };

        if (templateMapping[selectedTemplate]) {
            templateMapping[selectedTemplate]();
        }
    }
    
    function handlePostagemCorreiosChange() {
        if (elements.emailTemplatePrincipal.value !== 'apoio_vendas') return;
        const selectedTicketType = elements.postagemCorreiosTemplate.value;
        
        elements.primeiroTicketOptions.classList.add('hidden');
        elements.ticketExpiradoOptions.classList.add('hidden');

        if (selectedTicketType === 'primeiro_ticket') {
            elements.primeiroTicketOptions.classList.remove('hidden');
            updateEmail('primeiro_ticket');
        } else if (selectedTicketType === 'ticket_expirado') {
            elements.ticketExpiradoOptions.classList.remove('hidden');
            updateEmail('ticket_expirado');
        }
    }

    function handlePendenciasUpdate() {
        if (elements.apoioVendasTemplate.value === 'pendencias') {
            const nf = elements.nfSelect.value || '...';
            const templateKey = nf.includes(',') ? 'pendencias_plural' : 'pendencias_singular';
            updateEmail(templateKey);
        }
    }
    
    // 5. Listeners

    elements.apoioVendasTemplate.addEventListener('change', handleTemplateChange);
    
    if (elements.postagemCorreiosTemplate) {
        elements.postagemCorreiosTemplate.addEventListener('change', handlePostagemCorreiosChange);
    }

    if (elements.ediSelect) elements.ediSelect.addEventListener('input', handlePendenciasUpdate);
    if (elements.nfSelect) elements.nfSelect.addEventListener('input', handlePendenciasUpdate);

    const recusaUpdate = () => {
        const val = elements.apoioVendasTemplate.value;
        if (val === 'recusa_nf' || val === 'nfs_retidas') updateEmail(val);
    };

    if (elements.nfRecusaInput) elements.nfRecusaInput.addEventListener('input', recusaUpdate);
    if (elements.descricaoRecusaInput) elements.descricaoRecusaInput.addEventListener('input', recusaUpdate);

    const dateInputs = [
        elements.dataEmissaoInput, elements.dataValidadeInput,
        elements.dataEmissaoInputExpired, elements.dataValidadeInputExpired
    ].filter(el => el);

    dateInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            applyDateMask(event);
            const subType = elements.postagemCorreiosTemplate.value;
            if (subType) updateEmail(subType);
        });
    });

    const ticketInputs = [
        elements.nfInputPostagem, elements.ticketInput,
        elements.ticketExpiradoInput, elements.ticketInputExpired
    ].filter(el => el);

    ticketInputs.forEach(input => {
        input.addEventListener('input', () => {
            const subType = elements.postagemCorreiosTemplate.value;
            if (subType) updateEmail(subType);
        });
    });

    // Lógica do botão de copiar (Fundo Branco Definitivo)
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', () => {
            const content = elements.emailContent;
            if (!content || content.innerText.trim() === "") return;

            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.backgroundColor = '#ffffff'; 
            tempDiv.style.color = '#000000';
            tempDiv.style.padding = '10px';
            tempDiv.innerHTML = content.innerHTML; 
            document.body.appendChild(tempDiv);

            const range = document.createRange();
            range.selectNodeContents(tempDiv);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            try {
                if (document.execCommand('copy')) {
                    const originalText = elements.copyBtn.innerText;
                    elements.copyBtn.innerText = "Copiado! ✅";
                    elements.copyBtn.style.backgroundColor = "#28a745";
                    setTimeout(() => {
                        elements.copyBtn.innerText = originalText;
                        elements.copyBtn.style.backgroundColor = ""; 
                    }, 2000);
                }
            } catch (err) {
                console.error('Erro ao copiar:', err);
            }

            selection.removeAllRanges();
            document.body.removeChild(tempDiv);
        });
    }
});
