document.addEventListener('DOMContentLoaded', () => {
    const emailTemplate = document.getElementById('email-template');
    const apoioVendasTemplate = document.getElementById('apoio-vendas-template');
    const pendenciasOptions = document.getElementById('pendencias-options');
    const recusaNfOptions = document.getElementById('recusa-nf-options');
    const postagemCorreiosTemplate = document.getElementById('postagem-correios-template');
    const primeiroTicketOptions = document.getElementById('primeiro-ticket-options');
    const ticketExpiradoOptions = document.getElementById('ticket-expirado-options');
    const emailPreview = document.getElementById('email-preview');
    const emailContent = document.getElementById('email-content');
    const nfsRetidasOptions = document.getElementById('nfs-retidas-options');
    const nfRetidaInput = document.getElementById('nf-retida-input');
    
    const ediSelect = document.getElementById('edi-select');
    const nfSelect = document.getElementById('nf-select');
    const nfRecusaInput = document.getElementById('nf-recusa-input');
    const descricaoRecusaInput = document.getElementById('descricao-recusa-input');
    const produtoDescInput = document.getElementById('produto-desc-input');
    const ticketInput = document.getElementById('ticket-input');
    const dataEmissaoInput = document.getElementById('data-emissao-input');
    const dataValidadeInput = document.getElementById('data-validade-input');
    const ticketExpiradoInput = document.getElementById('ticket-expirado-input');
    const ticketInputExpired = document.getElementById('ticket-input-expired');
    const dataEmissaoInputExpired = document.getElementById('data-emissao-input-expired');
    const dataValidadeInputExpired = document.getElementById('data-validade-input-expired');

    const emailTemplates = {
        atrasos2: `{{saudacao}}

        Favor nos posicionar quanto as entregas das NFs abaixo que estão em atraso ou estão no prazo e não recebemos atualizações de EDI.
        Verificar também se as NFs que recebemos ocorrências precisarão da nossa intervenção para resolução.`,
        atrasos_detalhado: `{{saudacao}}\n\nFavor nos posicionar urgente quanto as entregas das NFs abaixo que constam em atraso, não recebemos EDI de entrega ou estão com algum tipo de pendência que poderiamos intervir para que a entrega seja realizada no prazo.\n`,
        atrasos: `{{saudacao}}\n\nFavor nos posicionar quanto as entregas das NFs abaixo que estão em atraso ou não recebemos EDI de entrega.\n`,
        pendencias_singular: `{{saudacao}}\n\nRecebemos EDI de {{edi}} da NF {{nf}}. Favor nos posicionar urgente quanto ao status dessa entrega e se possui alguma pendencia que poderiamos intervir para que a entrega seja realizada no prazo.\n`,
        pendencias_plural: `{{saudacao}}\n\nRecebemos EDI de {{edi}} das NFs {{nf}}. Favor nos posicionar urgente quanto ao status dessas entregas e se possuem alguma pendencia que poderiamos intervir para que as entregas sejam realizadas no prazo.\n`,
        pendencias_lista: `{{saudacao}}\n\nRecebemos EDI de pendencias das NFs listadas abaixo. Favor nos posicionar urgente quanto aos status dessas entregas e se poderiamos intervir para que as entregas sejam realizadas no prazo.\n\n[Lista de NFs]`,
        recusa_nf: `{{saudacao}}\n\nReferente a NF {{nf}} na qual {{descricao}} \n\nPrecisamos da recusa eletrônica para que possamos realizar a entrada fiscal, favor seguir instrução abaixo. Favor nos confirmar assim que efetuar a operação. \n\n*Manifestar como operação não realizada \n\n<b>Pode realizar a Manifestação de maneira on-line, sem precisar baixar o aplicativo, basta ter acesso ao e-cnpj da empresa e a chave de acesso a nota fiscal.</b>\n\n<img src="imgs/teste.png" alt="Instrução de Manifestação"> \n\nFavor sinalizar caso haja alguma divergência no processo. \n\nFicamos a disposição para maiores esclarecimentos.`,
        primeiro_ticket: `{{saudacao}}\n\nO seu produto {{produto}} trocado referente a NF {{nf}} de compra, já consta como entregue.  Informamos que enviamos um  email a parte junto aos correios com uma Autorização de Postagem do produto  substituído, você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b>\n\nTicket: {{ticket}}\n\nData de emissão: {{data_emissao}}\n\nData de validade: {{data_validade}}\n\n<b>*A data de validade do ticket deverá ser respeitada como prazo para postagem.</b>\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.`,
        ticket_expirado: `{{saudacao}}\n\nInformamos que devido a expiração do ticket {{ticket_expirado}} anteriormente emitido, emitimos um novo e enviamos um  email a parte junto aos correios com uma nova Autorização de Postagem do item substituído, você deverá se dirigir a uma Agência Própria Franqueada dos Correios, <b>levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).</b>\n\nTicket: {{ticket}}\n\nData de emissão: {{data_emissao}}\n\nData de validade: {{data_validade}}\n\n<b>*A data de validade do ticket deverá ser respeitada como prazo para postagem evitando risco de uma nova expiração e o faturamento do produto em questão.</b>\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.`,
        nfs_retidas: `Prezado cliente,

Informamos que o material da NF {{nf}} encontra-se retido junto a fiscalização, segue em anexo termo de retenção. Favor nos enviar o comprovante de pagamento assim que for realizado para darmos sequencia no processo de liberação e entrega da carga.

Prezado cliente,

Material da NF em anexo encontra-se retida na fiscalização, gentileza solucionar a pendência junto a SEFAZ para regularização. Por favor, assim que pago nos envie o comprovante de pagamento para darmos sequencia no processo de liberação e entrega da carga.

Segue em anexo comprovante pago, gentileza dar seguimento na liberação e entrega da carga.

Desde já agradeço.`
    };

    function resetFields() {
        // Oculta todas as opções específicas
        pendenciasOptions.classList.add('hidden');
        recusaNfOptions.classList.add('hidden');
        primeiroTicketOptions.classList.add('hidden');
        ticketExpiradoOptions.classList.add('hidden');
    
        // Limpa valores dos campos de entrada
        ediSelect.value = '';
        nfSelect.value = '';
        nfRecusaInput.value = '';
        descricaoRecusaInput.value = '';
        produtoDescInput.value = '';
        ticketInput.value = '';
        dataEmissaoInput.value = '';
        dataValidadeInput.value = '';
        ticketExpiradoInput.value = '';
        ticketInputExpired.value = '';
        dataEmissaoInputExpired.value = '';
        dataValidadeInputExpired.value = '';
    
        // Oculta os campos de entrada específicos
        nfRecusaInput.classList.add('hidden');
        descricaoRecusaInput.classList.add('hidden');
    
        // Esconde a prévia do email
        emailContent.textContent = '';
        emailPreview.classList.add('hidden');
    }
    function updateAtrasosDetalhadoEmail() {
        const emailText = emailTemplates.atrasos_detalhado.replace('{{saudacao}}', getSaudacao());
        emailContent.textContent = emailText.trim();
        emailPreview.classList.remove('hidden');
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

    function updateRecusaNfEmail() {
        const nf = nfRecusaInput.value || '...';
        const descricao = descricaoRecusaInput.value || '...';

        const emailText = emailTemplates.recusa_nf
            .replace('{{saudacao}}', getSaudacao())
            .replace('{{nf}}', nf)
            .replace('{{descricao}}', descricao);

        emailContent.innerHTML = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    function updatePrimeiroTicketEmail() {
        const descricaoProduto = produtoDescInput.value || '...';
        const nf = nfInput.value || '...';
        const ticket = ticketInput.value || '...';
        const dataEmissao = dataEmissaoInput.value || '...';
        const dataValidade = dataValidadeInput.value || '...';

        const emailText = `${getSaudacao()}\n\nO seu produto ${descricaoProduto} trocado referente a NF ${nf} de compra, já consta como entregue. Informamos que enviamos um email a parte junto aos correios com uma Autorização de Postagem do produto substituído, você deverá se dirigir a uma Agência Própria ou Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).\n\nTicket: ${ticket}\n\nData de emissão: ${dataEmissao}\n\nData de validade: ${dataValidade}\n\n*A data de validade do ticket deverá ser respeitada como prazo para postagem.\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.\n`;

        emailContent.textContent = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    function updateTicketExpiradoEmail() {
        const ticketExpirado = ticketExpiradoInput.value || '...';
        const novoTicket = ticketInputExpired.value || '...';
        const dataEmissao = dataEmissaoInputExpired.value || '...';
        const dataValidade = dataValidadeInputExpired.value || '...';

        const emailText = `${getSaudacao()}\n\nInformamos que devido a expiração do ticket ${ticketExpirado} anteriormente emitido, emitimos um novo e enviamos um email a parte junto aos correios com uma nova Autorização de Postagem do item substituído, você deverá se dirigir a uma Agência Própria Franqueada dos Correios, levando consigo, obrigatoriamente, o Número do e-ticket, o objeto para postagem e a nota fiscal que consta em anexo neste email (a nota deverá acompanhar o produto).\n\nTicket: ${novoTicket}\n\nData de emissão: ${dataEmissao}\n\nData de validade: ${dataValidade}\n\n*A data de validade do ticket deverá ser respeitada como prazo para postagem evitando risco de uma nova expiração e o faturamento do produto em questão.\n\nFavor sinalizar caso haja alguma divergência no processo.\n\nFicamos a disposição para maiores esclarecimentos.\n`;

        emailContent.textContent = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    function updateNfsRetidasEmail() {
        const nf = nfRecusaInput.value || '...';

        const emailText = emailTemplates.nfs_retidas
            .replace('{{nf}}', nf);

        emailContent.innerHTML = emailText.trim();
        emailPreview.classList.remove('hidden');
    }

    // Listener para mudança na seleção de Apoio a Vendas
    apoioVendasTemplate.addEventListener('change', () => {
        // Reseta os campos ao mudar de seleção
        resetFields();
    
        const selectedTemplate = apoioVendasTemplate.value;
    
        // Oculta todas as opções específicas
        pendenciasOptions.classList.add('hidden');
        recusaNfOptions.classList.add('hidden');
        primeiroTicketOptions.classList.add('hidden');
        ticketExpiradoOptions.classList.add('hidden');
        nfRecusaInput.classList.add('hidden');
        descricaoRecusaInput.classList.add('hidden');
    

        if (selectedTemplate === 'atrasos2') {
            const emailText = emailTemplates.atrasos.replace('{{saudacao}}', getSaudacao());
            emailContent.textContent = emailText.trim();
            emailPreview.classList.remove('hidden');
        }
        if (selectedTemplate === 'atrasos') {
            const emailText = emailTemplates.atrasos.replace('{{saudacao}}', getSaudacao());
            emailContent.textContent = emailText.trim();
            emailPreview.classList.remove('hidden');
        } else if (selectedTemplate === 'pendencias') {
            pendenciasOptions.classList.remove('hidden');
        } else if (selectedTemplate === 'pendencias_lista') {
            updatePendenciasListaEmail();
        } else if (selectedTemplate === 'recusa_nf') {
            recusaNfOptions.classList.remove('hidden');
            nfRecusaInput.classList.remove('hidden');
            descricaoRecusaInput.classList.remove('hidden');
        } else if (selectedTemplate === 'primeiro_ticket') {
            primeiroTicketOptions.classList.remove('hidden');
            updatePrimeiroTicketEmail();
        } else if (selectedTemplate === 'ticket_expirado') {
            ticketExpiradoOptions.classList.remove('hidden');
            updateTicketExpiradoEmail();
        } else if (selectedTemplate === 'nfs_retidas') {
            nfRecusaInput.classList.remove('hidden');  // Mostrar campo NF
            descricaoRecusaInput.classList.add('hidden'); // Esconder campo de descrição
            updateNfsRetidasEmail();
        } else if (selectedTemplate === 'atrasos_detalhado') {
            updateAtrasosDetalhadoEmail();
        }
    });
    

    // Listeners para inputs de Pendencias
    ediSelect.addEventListener('input', updatePendenciasEmail);
    nfSelect.addEventListener('input', updatePendenciasEmail);
    
    // Listeners para inputs de Recusa de NF e NFs Retidas
    nfRecusaInput.addEventListener('input', () => {
        if (apoioVendasTemplate.value === 'recusa_nf') {
            descricaoRecusaInput.classList.remove('hidden'); // Mostra descricaoRecusaInput para recusa_nf
            updateRecusaNfEmail();
        } else if (apoioVendasTemplate.value === 'nfs_retidas') {
            descricaoRecusaInput.classList.add('hidden'); // Esconder descricaoRecusaInput para nfs_retidas
            updateNfsRetidasEmail();
        }
    });

    descricaoRecusaInput.addEventListener('input', () => {
        if (apoioVendasTemplate.value === 'recusa_nf') {
            updateRecusaNfEmail();
        }
    });

    
    // Listeners para inputs de Primeiro Ticket
    produtoDescInput.addEventListener('input', updatePrimeiroTicketEmail);
    nfInput.addEventListener('input', updatePrimeiroTicketEmail);
    ticketInput.addEventListener('input', updatePrimeiroTicketEmail);
    dataEmissaoInput.addEventListener('input', updatePrimeiroTicketEmail);
    dataValidadeInput.addEventListener('input', updatePrimeiroTicketEmail);
    nfRetidaInput.addEventListener('input', updateNfsRetidasEmail);

    // Listeners para inputs de Ticket Expirado
    ticketExpiradoInput.addEventListener('input', updateTicketExpiradoEmail);
    ticketInputExpired.addEventListener('input', updateTicketExpiradoEmail);
    dataEmissaoInputExpired.addEventListener('input', updateTicketExpiradoEmail);
    dataValidadeInputExpired.addEventListener('input', updateTicketExpiradoEmail);
});
