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
        emailPreview: document.getElementById('email-preview'),
        emailContent: document.getElementById('email-content'),
        apoioVendasTemplate: document.getElementById('apoio-vendas-template'),

        // Opções de Campos
        pendenciasOptions: document.getElementById('pendencias-options'),
        recusaNfOptions: document.getElementById('recusa-nf-options'),
        primeiroTicketOptions: document.getElementById('primeiro-ticket-options'), 
        ticketExpiradoOptions: document.getElementById('ticket-expirado-options'),
        
        // Inputs de Pendências
        ediSelect: document.getElementById('edi-select'),
        nfSelect: document.getElementById('nf-select'),

        // Inputs de Recusa NF / NF Retida
        nfRecusaInput: document.getElementById('nf-recusa-input'),
        descricaoRecusaInput: document.getElementById('descricao-recusa-input'),
        nfRetidaInput: document.getElementById('nf-retida-input'), 

        // Inputs de Primeiro Ticket (do HTML, que é nf-input-postagem)
        // REMOVIDO: produtoDescInput
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
    elements.ticketCorreiosOptions // Adicionado
].filter(el => el);
    
    // Lista de todos os inputs a serem resetados
    const allInputs = Object.values(elements).filter(el => el instanceof HTMLInputElement || el instanceof HTMLSelectElement);

    // 2. Templates de E-mail (REVISADO para garantir que {{produto_desc}} seja removido)
    const emailTemplates = {
        
        relatorio_geral: `{{saudacao}}\n\nFavor nos posicionar urgente quanto as entregas das NFs abaixo que constam em atraso.(listar NFs atrasadas)\n\nRecebemos EDI de pendencias das NFs listadas abaixo. Favor informar se poderiamos intervir de alguma forma para resolução.(listar NFs com pendencias)\n\nAs NFs listadas abaixo não estão em atraso, porem  não recebemos ocorrencias(atualizações de EDI), precisamos que nos atualize quanto aos status e verifique internamente o envio de e-mails com atualizações de EDI.(listar NFs no prazo e sem ocorrencias)\n\nNão recebemos por email CTEs das NFs listadas abaixo, precisamos do envio urgente para monitoramento de entrega(listar NFs no prazo e sem ocorrencias)`,
        
        pendencias_singular: `{{saudacao}}\n\nRecebemos EDI de {{edi}} da NF {{nf}}. Favor nos posicionar urgente quanto ao status dessa entrega e se possui alguma pendencia que poderiamos intervir para que a entrega seja realizada no prazo.\n`,
        pendencias_plural: `{{saudacao}}\n\nRecebemos EDI de {{edi}} das NFs {{nf}}. Favor nos posicionar urgente quanto ao status dessas entregas e se possuem alguma pendencia que poderiamos intervir para que as entregas sejam realizadas no prazo.\n`,
        pendencias_lista: `{{saudacao}}\n\nRecebemos EDI de pendencias das NFs listadas abaixo. Favor nos posicionar urgente quanto aos status dessas entregas e se poderiamos intervir para que as entregas sejam realizadas no prazo.\n\n[Lista de NFs]`,
        recusa_nf: `{{saudacao}}\n\nReferente a NF {{nf_recusa}} na qual {{descricao}} \n\nPrecisamos da recusa eletrônica para que possamos realizar a entrada fiscal, favor seguir instrução abaixo. Favor nos confirmar assim que efetuar a operação. \n\n*Manifestar como operação não realizada \n\n<b>Pode realizar a Manifestação de maneira on-line, sem precisar baixar o aplicativo, basta ter acesso ao e-cnpj da empresa e a chave de acesso a nota fiscal.</b>\n\n<img src="imgs/teste.png" alt="Instrução de Manifestação"> \n\nFavor sinalizar caso haja alguma divergência no processo. \n\nFicamos a disposição para maiores esclarecimentos.`,
        nfs_retidas: `Prezado cliente,

Informamos que o material da NF {{nf_recusa}} encontra-se retido junto a fiscalização, segue em anexo termo de retenção. Favor nos enviar o comprovante de pagamento assim que for realizado para darmos sequencia no processo de liberação e entrega da carga.

Prezado cliente,

Material da NF em anexo encontra-se retida na fiscalização, gentileza solucionar a pendência junto a SEFAZ para regularização. Por favor, assim que pago nos envie o comprovante de pagamento para darmos sequencia no processo de liberação e entrega da carga.

Segue em anexo comprovante pago, gentileza dar seguimento na liberação e entrega da carga.

Desde já agradeço.`,
        
        // TICKET CORREIOS - Primeira Emissão (Texto Revisado)
        primeiro_ticket: `{{saudacao}}\n\nInformo que geramos junto aos correios uma Autorização de Postagem.\n\nVocê deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o(s)item(s) para postagem e a nota fiscal de retorno(a nota deverá acompanhar o produto).\n\nTicket: {{ticket}}\n\nData de emissão: {{data_emissao}}\n\nData de validade: {{data_validade}}\n\n*A data de validade do ticket deverá ser respeitada como prazo para postagem.\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.`,
        
        // TICKET CORREIOS - Ticket Expirado (Texto Revisado)
        ticket_expirado: `{{saudacao}}\n\nInformamos que devido à expiração do ticket {{ticket_expirado}} anteriormente emitido, emitimos um novo e enviamos um email a parte junto aos correios com uma nova Autorização de Postagem do item substituído.\n\nVocê deverá se dirigir a uma Agência Própria Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).\n\nTicket: {{ticket_input_expired}}\n\nData de emissão: {{data_emissao_expired}}\n\nData de validade: {{data_validade_expired}}\n\nA data de validade do ticket deverá ser respeitada como prazo para postagem evitando risco de uma nova expiração e o faturamento do produto em questão.\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos à disposição para maiores esclarecimentos.`,
    };
    
    // 3. Funções Auxiliares 
    
    function getSaudacao() {
        const horaAtual = new Date().getHours();
        return horaAtual < 12 ? "Bom dia!" : "Boa tarde!";
    }

    function resetFields() {
        // Oculta todos os contêineres de opções
        optionContainers.forEach(container => container.classList.add('hidden'));

        // Limpa todos os inputs
        allInputs.forEach(input => {
            if (input.type !== 'select-one') {
                 input.value = '';
            }
        });

        // Esconde a prévia do email
        elements.emailContent.textContent = '';
        elements.emailPreview.classList.add('hidden');
    }

    /**
     * Centraliza a lógica de preenchimento e exibição do e-mail.
     */
    function updateEmail(templateKey, customReplacements = {}) {
        let template = emailTemplates[templateKey];
        if (!template) return;

        // Substituição básica de Saudação
        let emailText = template.replace('{{saudacao}}', getSaudacao());

        // Mapeamento de campos para templates
        const fieldMap = {
            '{{edi}}': elements.ediSelect,
            '{{nf}}': elements.nfSelect,
            '{{nf_recusa}}': elements.nfRecusaInput,
            '{{descricao}}': elements.descricaoRecusaInput,
            // REMOVIDO: '{{produto_desc}}'
            '{{nf_input}}': elements.nfInputPostagem, 
            '{{ticket}}': elements.ticketInput,
            '{{data_emissao}}': elements.dataEmissaoInput,
            '{{data_validade}}': elements.dataValidadeInput,
            '{{ticket_expirado}}': elements.ticketExpiradoInput,
            '{{ticket_input_expired}}': elements.ticketInputExpired,
            '{{data_emissao_expired}}': elements.dataEmissaoInputExpired,
            '{{data_validade_expired}}': elements.dataValidadeInputExpired,
        };
        
        // Substituições genéricas
        for (const placeholder in fieldMap) {
            const element = fieldMap[placeholder];
            const value = element ? element.value || '...' : '...';
            emailText = emailText.replace(new RegExp(placeholder, 'g'), value);
        }
        
        // Substituições customizadas
        for (const placeholder in customReplacements) {
            emailText = emailText.replace(new RegExp(placeholder, 'g'), customReplacements[placeholder]);
        }

        // Caso Recusa NF (que usa HTML na imagem)
        if (templateKey === 'recusa_nf' || templateKey === 'nfs_retidas') {
            elements.emailContent.innerHTML = emailText.trim();
        } else {
            elements.emailContent.textContent = emailText.trim();
        }
        
        elements.emailPreview.classList.remove('hidden');
    }

    // 4. Lógica de Atualização Centralizada

    function handleTemplateChange() {
        const selectedTemplate = elements.apoioVendasTemplate.value;
        resetFields(); // Limpa e oculta tudo

        // Mapeamento de template para o container de opções e função de atualização
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
            // NOVO TÓPICO: Ticket correios-Geral
            'ticket_correios': () => {
                // Oculta todas as sub-opções
                elements.primeiroTicketOptions.classList.add('hidden');
                elements.ticketExpiradoOptions.classList.add('hidden');
                // Mostra o container pai (ticket-correios-options)
                const ticketCorreiosContainer = document.getElementById('ticket-correios-options');
                if (ticketCorreiosContainer) ticketCorreiosContainer.classList.remove('hidden'); 
                
                handlePostagemCorreiosChange();
            }
        };

        if (templateMapping[selectedTemplate]) {
            templateMapping[selectedTemplate]();
        }
    }
    
    // NOVA FUNÇÃO para lidar com o seletor de tickets Correios
    function handlePostagemCorreiosChange() {
        const selectedTicketType = elements.postagemCorreiosTemplate.value;
        
        // Oculta as sub-opções de ticket
        elements.primeiroTicketOptions.classList.add('hidden');
        elements.ticketExpiradoOptions.classList.add('hidden');

        if (selectedTicketType === 'primeiro_ticket') {
            elements.primeiroTicketOptions.classList.remove('hidden');
            updateEmail('primeiro_ticket');
        } else if (selectedTicketType === 'ticket_expirado') {
            elements.ticketExpiradoOptions.classList.remove('hidden');
            updateEmail('ticket_expirado');
        } else {
            // Limpa a pré-visualização se "Selecione" for escolhido
            elements.emailContent.textContent = '';
            elements.emailPreview.classList.add('hidden');
        }
    }

    function handlePendenciasUpdate() {
        const nf = elements.nfSelect.value || '...';
        const templateKey = nf.includes(',') ? 'pendencias_plural' : 'pendencias_singular';
        updateEmail(templateKey);
    }
    
    // 5. OTIMIZAÇÃO: Listeners

    // Listener principal para o dropdown de templates
    elements.apoioVendasTemplate.addEventListener('change', handleTemplateChange);
    
    // Listener para o dropdown de tickets Correios
    if (elements.postagemCorreiosTemplate) elements.postagemCorreiosTemplate.addEventListener('change', handlePostagemCorreiosChange);

    // Listeners agrupados para Pendencias
    if (elements.ediSelect) elements.ediSelect.addEventListener('input', handlePendenciasUpdate);
    if (elements.nfSelect) elements.nfSelect.addEventListener('input', handlePendenciasUpdate);

    // Listeners agrupados para Recusa NF e NFs Retidas
    const recusaUpdate = () => {
        if (elements.apoioVendasTemplate.value === 'recusa_nf') {
            updateEmail('recusa_nf');
        } else if (elements.apoioVendasTemplate.value === 'nfs_retidas') {
            updateEmail('nfs_retidas');
        }
    };

    if (elements.nfRecusaInput) elements.nfRecusaInput.addEventListener('input', recusaUpdate);
    if (elements.descricaoRecusaInput) elements.descricaoRecusaInput.addEventListener('input', () => {
        if (elements.apoioVendasTemplate.value === 'recusa_nf') {
             updateEmail('recusa_nf');
        }
    });

    // Inputs de data para aplicar a máscara e forçar a atualização do email
    const dateInputs = [
        elements.dataEmissaoInput, elements.dataValidadeInput,
        elements.dataEmissaoInputExpired, elements.dataValidadeInputExpired
    ].filter(el => el);

    dateInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            applyDateMask(event);
            // Chama o updateEmail após a máscara
            const selectedTicketType = elements.postagemCorreiosTemplate.value;
            if (selectedTicketType === 'primeiro_ticket') {
                updateEmail('primeiro_ticket');
            } else if (selectedTicketType === 'ticket_expirado') {
                updateEmail('ticket_expirado');
            }
        });
    });

    // Listeners agrupados para Primeiro Ticket (sem o produtoDescInput)
    const primeiroTicketInputs = [
        elements.nfInputPostagem, elements.ticketInput,
    ].filter(el => el);

    primeiroTicketInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (elements.postagemCorreiosTemplate && elements.postagemCorreiosTemplate.value === 'primeiro_ticket') {
                updateEmail('primeiro_ticket');
            }
        });
    });

    // Listeners agrupados para Ticket Expirado
    const ticketExpiredInputs = [
        elements.ticketExpiradoInput, elements.ticketInputExpired,
    ].filter(el => el);

    ticketExpiredInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (elements.postagemCorreiosTemplate && elements.postagemCorreiosTemplate.value === 'ticket_expirado') {
                updateEmail('ticket_expirado');
            }
        });
    });
});
