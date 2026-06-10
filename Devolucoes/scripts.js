// scripts.js - Controle de Devoluções — WDC Networks
// Usa a API do GitHub como banco de dados (dados.json no repositório)

// ══════════════════════════════════════════════════════
//  CONFIGURAÇÃO DO REPOSITÓRIO
// ══════════════════════════════════════════════════════
const GITHUB_OWNER = 'LuisH256';
const GITHUB_REPO  = 'Wdc-Ajudas';
const GITHUB_FILE  = 'dados.json';
const GITHUB_BRANCH = 'main';

const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_FILE}`;

// ══════════════════════════════════════════════════════
//  ESTADO DA APLICAÇÃO
// ══════════════════════════════════════════════════════
var dados = [];
var PRODS = {};
var fileSHA = null; // SHA necessário para commits no GitHub
var itensFiltrados = [];
var paginaAtual = 1;
const itensPorPagina = 15;
var ordenacao = { coluna: 'id', ascendente: false };
var editId = null;

const fmt = v => (+v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ══════════════════════════════════════════════════════
//  TOKEN DO GITHUB (armazenado no navegador do admin)
// ══════════════════════════════════════════════════════
function getToken() {
  return localStorage.getItem('wdc_github_token') || '';
}

function salvarToken() {
  const input = document.getElementById('tokenInput');
  const token = input.value.trim();
  if (!token) return alert('Cole o token antes de salvar.');
  localStorage.setItem('wdc_github_token', token);
  document.getElementById('tokenOverlay').classList.remove('open');
  atualizarBotaoConfig();
  alert('Token salvo! Agora você pode adicionar, editar e excluir registros.');
}

function removerToken() {
  localStorage.removeItem('wdc_github_token');
  atualizarBotaoConfig();
  alert('Token removido. Modo somente leitura.');
}

function abrirConfig() {
  document.getElementById('tokenInput').value = getToken();
  document.getElementById('tokenOverlay').classList.add('open');
}

function fecharConfig() {
  document.getElementById('tokenOverlay').classList.remove('open');
}

function atualizarBotaoConfig() {
  const tem = !!getToken();
  const el = document.getElementById('statusToken');
  if (el) {
    el.innerHTML = tem
      ? '<span style="color:#3B6D11">● Conectado</span>'
      : '<span style="color:#BA7517">● Somente leitura</span>';
  }
  // Mostrar/ocultar botões de escrita
  document.querySelectorAll('.needs-token').forEach(b => {
    b.style.display = tem ? '' : 'none';
  });
}

// ══════════════════════════════════════════════════════
//  COMUNICAÇÃO COM O GITHUB
// ══════════════════════════════════════════════════════

// Helpers UTF-8 ↔ Base64
function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function base64ToUtf8(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

// Lê dados.json do repositório
async function carregarDados() {
  mostrarLoading(true);
  try {
    const token = getToken();
    // Usa API com token (sem cache), ou raw URL sem token
    if (token) {
      const resp = await fetch(API_URL + '?t=' + Date.now(), {
        headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (!resp.ok) throw new Error('Erro API: ' + resp.status);
      const json = await resp.json();
      fileSHA = json.sha;
      const conteudo = JSON.parse(base64ToUtf8(json.content));
      dados = conteudo.dados || [];
      PRODS = conteudo.prods || {};
    } else {
      // Sem token: lê do raw (público) com cache-bust
      const resp = await fetch(RAW_URL + '?t=' + Date.now());
      if (!resp.ok) throw new Error('Erro ao carregar: ' + resp.status);
      const conteudo = await resp.json();
      dados = conteudo.dados || [];
      PRODS = conteudo.prods || {};
      // Pega o SHA para futuras escritas (se token for adicionado depois)
      try {
        const apiResp = await fetch(API_URL, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
        if (apiResp.ok) {
          const apiJson = await apiResp.json();
          fileSHA = apiJson.sha;
        }
      } catch (e) { /* SHA será pego quando necessário */ }
    }
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    // Fallback: usa dados locais do dados.js se existir
    if (typeof dadosIniciais !== 'undefined') {
      dados = JSON.parse(JSON.stringify(dadosIniciais));
    }
    if (typeof PRODS_INICIAL !== 'undefined') {
      PRODS = JSON.parse(JSON.stringify(PRODS_INICIAL));
    }
  }
  mostrarLoading(false);
  renderStats();
  filtrar();
  atualizarBotaoConfig();
}

// Salva dados.json no repositório (faz commit automático)
async function salvarNoGitHub(mensagem) {
  const token = getToken();
  if (!token) {
    alert('Configure o token do GitHub para salvar alterações.\nClique no ícone ⚙ no topo da página.');
    return false;
  }

  mostrarLoading(true, 'Salvando...');

  try {
    // Pega SHA mais recente para evitar conflitos
    const shaResp = await fetch(API_URL, {
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (shaResp.ok) {
      const shaJson = await shaResp.json();
      fileSHA = shaJson.sha;
    }

    const conteudo = JSON.stringify({ dados: dados, prods: PRODS }, null, 2);
    const body = {
      message: mensagem || 'Atualização de devoluções',
      content: utf8ToBase64(conteudo),
      sha: fileSHA,
      branch: GITHUB_BRANCH
    };

    const resp = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': 'token ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message || 'Erro ao salvar');
    }

    const result = await resp.json();
    fileSHA = result.content.sha; // Atualiza SHA para próximo commit
    mostrarLoading(false);
    return true;
  } catch (e) {
    mostrarLoading(false);
    console.error('Erro ao salvar no GitHub:', e);
    alert('Erro ao salvar: ' + e.message + '\n\nVerifique se o token está correto e tem permissão de escrita.');
    return false;
  }
}

// ══════════════════════════════════════════════════════
//  LOADING INDICATOR
// ══════════════════════════════════════════════════════
function mostrarLoading(show, msg) {
  let el = document.getElementById('loadingBar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loadingBar';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;height:3px;background:#185FA5;z-index:9999;transition:opacity .3s;';
    const inner = document.createElement('div');
    inner.style.cssText = 'height:100%;width:30%;background:#1DA8D8;animation:loadSlide 1.2s ease-in-out infinite;border-radius:0 2px 2px 0;';
    el.appendChild(inner);
    const style = document.createElement('style');
    style.textContent = '@keyframes loadSlide{0%{margin-left:0;width:30%}50%{margin-left:40%;width:50%}100%{margin-left:100%;width:10%}}';
    document.head.appendChild(style);
    document.body.appendChild(el);
  }
  el.style.opacity = show ? '1' : '0';
  el.style.pointerEvents = show ? 'auto' : 'none';
}

// ══════════════════════════════════════════════════════
//  FUNÇÕES DE EXIBIÇÃO
// ══════════════════════════════════════════════════════
function getCat(m) {
  if (!m) return '';
  const u = m.toUpperCase();
  if (u.includes('(CLI)')) return 'cli';
  if (u.includes('(COM)')) return 'com';
  if (u.includes('(LOG)')) return 'log';
  if (u.includes('(PRO)')) return 'pro';
  return 'com';
}

function motivoBadge(m) {
  if (!m || m === '—') return '—';
  const cat = getCat(m);
  const cls = { cli: 'b-cli', com: 'b-com', log: 'b-log', pro: 'b-pro' }[cat] || 'b-com';
  const tag = m.match(/^\((\w+)\)/i) ? m.match(/^\((\w+)\)/i)[0].toUpperCase() : '(COM)';
  const desc = m.replace(/^\(\w+\)\s*/i, '');
  return `<div style="display:inline-flex;align-items:center;gap:4px;max-width:100%"><span class="badge ${cls}" style="flex-shrink:0">${tag}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${desc}</span></div>`;
}

function prodCell(prods) {
  if (!prods || prods.length === 0) return '<span style="color:#aaa;font-size:10px">—</span>';
  return `<div class="prod-cell">${prods.map(p => `<div class="prod-item"><span class="prod-fab">${p.fabricante || ''}</span> ${p.produto || ''} <span style="color:#888;font-size:9px">(${p.codProduto || ''})</span> <span class="prod-qtd">×${p.quantidade || 1}</span></div>`).join('')}</div>`;
}

// ══════════════════════════════════════════════════════
//  STATS, FILTROS, TABELA, PAGINAÇÃO
// ══════════════════════════════════════════════════════
function renderStats() {
  const statsEl = document.getElementById('stats');
  if (!statsEl) return;

  let andamento = 0, finalizado = 0, cancelado = 0, totalValor = 0;
  let valorAnd = 0, valorFin = 0;
  dados.forEach(d => {
    totalValor += (d.valor || 0);
    if (d.status === 'Em andamento') { andamento++; valorAnd += (d.valor || 0); }
    else if (d.status === 'Finalizado') { finalizado++; valorFin += (d.valor || 0); }
    else if (d.status === 'Cancelado') { cancelado++; }
  });

  statsEl.innerHTML = `
    <div class="stat"><div class="stat-lbl">Total de solicitações</div><div class="stat-val cv-blue">${dados.length}</div></div>
    <div class="stat"><div class="stat-lbl">Em andamento</div><div class="stat-val cv-amber">${andamento}</div></div>
    <div class="stat"><div class="stat-lbl">Finalizados</div><div class="stat-val cv-green">${finalizado}</div></div>
    <div class="stat"><div class="stat-lbl">Valor em andamento</div><div class="stat-val cv-amber" style="font-size:15px">${fmt(valorAnd)}</div></div>
    <div class="stat" style="border-left-color:#3B6D11;background:#EAF3DE"><div class="stat-lbl" style="color:#27500A">Valor finalizado</div><div class="stat-val cv-green" style="font-size:15px">${fmt(valorFin)}</div></div>
    <div class="stat"><div class="stat-lbl">Valor total</div><div class="stat-val cv-blue" style="font-size:15px">${fmt(totalValor)}</div></div>
  `;
}

function filtrar() {
  const busca = document.getElementById('busca').value.toLowerCase();
  const bu = document.getElementById('fBuF').value;
  const status = document.getElementById('fStatus').value;
  const mod = document.getElementById('fMod').value;
  const tipo = document.getElementById('fTipo').value;

  itensFiltrados = dados.filter(d => {
    if (bu && d.bu !== bu) return false;
    if (status && d.status !== status) return false;
    if (mod && d.modalidade !== mod) return false;
    if (tipo && d.tipoDev !== tipo) return false;
    if (busca) {
      const matchCampos = [d.nf, d.razao, d.vendedor, d.bu, d.motivo, d.desc, d.etapa].some(v => String(v || '').toLowerCase().includes(busca));
      if (matchCampos) return true;
      const prods = PRODS[d.nf] || [];
      return prods.some(p => [p.codProduto, p.fabricante, p.produto].some(v => String(v || '').toLowerCase().includes(busca)));
    }
    return true;
  });

  ordenarDados();
  paginaAtual = 1;
  renderTabela();
}

function ord(coluna) {
  if (ordenacao.coluna === coluna) ordenacao.ascendente = !ordenacao.ascendente;
  else { ordenacao.coluna = coluna; ordenacao.ascendente = true; }
  filtrar();
}

function ordenarDados() {
  const col = ordenacao.coluna;
  const asc = ordenacao.ascendente ? 1 : -1;
  itensFiltrados.sort((a, b) => {
    let va = a[col], vb = b[col];
    if (col === 'valor') return (Number(va) - Number(vb)) * asc;
    if (col === 'abertura' || col === 'finalizacao') {
      const parseData = s => {
        if (!s || s === '—') return 0;
        const p = s.split('/');
        return p.length === 3 ? new Date(p[2], p[1] - 1, p[0]).getTime() : new Date(s).getTime();
      };
      return (parseData(va) - parseData(vb)) * asc;
    }
    return String(va || '').localeCompare(String(vb || '')) * asc;
  });
}

function renderTabela() {
  const tbody = document.getElementById('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (itensFiltrados.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="15">Nenhum registro encontrado.</td></tr>`;
    document.getElementById('pgInfo').innerText = '0 de 0 registros';
    document.getElementById('pgBtns').innerHTML = '';
    return;
  }

  const total = itensFiltrados.length;
  const totalPaginas = Math.ceil(total / itensPorPagina);
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = Math.min(inicio + itensPorPagina, total);
  const itensPagina = itensFiltrados.slice(inicio, fim);

  const temToken = !!getToken();

  itensPagina.forEach(d => {
    const clsStatus = d.status === 'Finalizado' ? 'b-fin' : (d.status === 'Cancelado' ? 'b-canc' : 'b-and');
    const clsTipo = d.tipoDev === 'Total' ? 'b-total' : (d.tipoDev === 'Parcial' ? 'b-parc' : '');
    const pList = PRODS[d.nf] || [];

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${d.nf || '—'}</b></td>
      <td>${d.abertura || '—'}</td>
      <td title="${d.modalidade || ''}" style="font-size:10px">${d.modalidade || '—'}</td>
      <td><span class="badge ${clsStatus}">${d.status || '—'}</span>${d.status === 'Cancelado' && d.motivoCancelamento ? `<br><span style="font-size:9px;color:#5C4A1E">${d.motivoCancelamento}</span>` : ''}</td>
      <td title="${d.etapa || ''}" style="font-size:10px">${d.etapa || '—'}</td>
      <td><span style="font-weight:700;color:#185FA5">${d.bu || '—'}</span></td>
      <td>${motivoBadge(d.motivo)}</td>
      <td title="${d.razao || ''}">${d.razao || '—'}</td>
      <td>${clsTipo ? `<span class="badge ${clsTipo}">${d.tipoDev}</span>` : (d.tipoDev || '—')}</td>
      <td>${d.tipoCli || '—'}</td>
      <td title="${d.vendedor || ''}" style="font-size:10px">${d.vendedor || '—'}</td>
      <td>${prodCell(pList)}</td>
      <td style="font-weight:700;color:#0C447C">${fmt(d.valor || 0)}</td>
      <td>${d.finalizacao || '—'}</td>
      <td>
        <div style="display:flex;gap:4px">
          ${temToken ? `
            <button class="act-btn" onclick="editar(${d.id})" title="Editar"><i class="ti ti-pencil"></i></button>
            <button class="act-btn del" onclick="excluir(${d.id})" title="Excluir"><i class="ti ti-trash"></i></button>
          ` : `<span style="color:#aaa;font-size:9px">—</span>`}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('pgInfo').innerText = `${total} registro${total !== 1 ? 's' : ''} · página ${paginaAtual} de ${totalPaginas}`;
  let btnsHtml = '';
  for (let i = 1; i <= totalPaginas; i++) {
    btnsHtml += `<button class="pg-btn ${i === paginaAtual ? 'on' : ''}" onclick="mudarPagina(${i})">${i}</button>`;
  }
  document.getElementById('pgBtns').innerHTML = btnsHtml;
}

function mudarPagina(p) { paginaAtual = p; renderTabela(); }

// ══════════════════════════════════════════════════════
//  MODAL — ABRIR / FECHAR / STATUS
// ══════════════════════════════════════════════════════
function abrirModal() {
  if (!getToken()) {
    alert('Configure o token do GitHub para adicionar registros.\nClique no ícone ⚙ no topo da página.');
    return;
  }
  editId = null;
  document.getElementById('mTitle').innerText = 'Nova solicitação de devolução';
  document.getElementById('fNf').disabled = false;

  ['fNf','fRazao','fVendedor','fBu','fTipoCli','fModalidade','fTipoDev','fEtapa','fValor','fFinalizacao','fMotivo2','fDesc','fMotivoCancelamento'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.getElementById('fStatusP').value = 'Em andamento';
  document.getElementById('prodList').innerHTML = '';
  onStatusChange('Em andamento');
  document.getElementById('overlay').classList.add('open');
  document.getElementById('overlay').scrollTop = 0;
  document.querySelector('.modal').scrollTop = 0;
}

function fecharModal() { document.getElementById('overlay').classList.remove('open'); }

function onStatusChange(val) {
  const etapaEl = document.getElementById('fEtapa');
  const etapaWrap = etapaEl.closest('div');
  const motivoCancWrap = document.getElementById('wrapMotivoCancelamento');
  const finalizacaoWrap = document.getElementById('wrapFinalizacao');
  const isEncerrado = val === 'Finalizado' || val === 'Cancelado';

  if (isEncerrado) {
    etapaEl.value = '';
    etapaWrap.style.opacity = '0.4';
    etapaWrap.style.pointerEvents = 'none';
    etapaEl.disabled = true;
  } else {
    etapaWrap.style.opacity = '1';
    etapaWrap.style.pointerEvents = 'auto';
    etapaEl.disabled = false;
  }

  motivoCancWrap.style.display = val === 'Cancelado' ? 'block' : 'none';
  if (val !== 'Cancelado') document.getElementById('fMotivoCancelamento').value = '';

  finalizacaoWrap.style.display = val === 'Finalizado' ? 'block' : 'none';
  if (val !== 'Finalizado') document.getElementById('fFinalizacao').value = '';
}

// ══════════════════════════════════════════════════════
//  PRODUTOS NO MODAL
// ══════════════════════════════════════════════════════
function addProdRow(cod, fab, prod, qtd) {
  cod = cod || ''; fab = fab || ''; prod = prod || ''; qtd = qtd || '';
  const container = document.getElementById('prodList');
  const div = document.createElement('div');
  div.className = 'prod-row';
  div.innerHTML = `
    <input type="text" placeholder="Código" value="${cod}" class="p-cod">
    <input type="text" placeholder="Fabricante" value="${fab}" class="p-fab">
    <input type="text" placeholder="Produto" value="${prod}" class="p-prod">
    <input type="number" placeholder="Qtd" value="${qtd}" min="1" class="p-qtd">
    <button class="btn-rm-prod" type="button" onclick="this.parentElement.remove()" title="Remover"><i class="ti ti-trash"></i></button>
  `;
  container.appendChild(div);
}

function getProdRows() {
  const rows = document.querySelectorAll('.prod-row');
  const res = [];
  rows.forEach(r => {
    const cod = r.querySelector('.p-cod').value.trim();
    const fab = r.querySelector('.p-fab').value.trim();
    const prod = r.querySelector('.p-prod').value.trim();
    const qtd = parseInt(r.querySelector('.p-qtd').value) || 1;
    if (cod || prod) res.push({ codProduto: cod, fabricante: fab, produto: prod, quantidade: qtd });
  });
  return res;
}

function fmtDI(v) {
  if (!v) return '';
  const p = v.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : '';
}

// ══════════════════════════════════════════════════════
//  SALVAR (commit no GitHub)
// ══════════════════════════════════════════════════════
async function salvar() {
  const nf = document.getElementById('fNf').value.trim();
  if (!nf) return alert('O número da NF é obrigatório.');

  const hoje = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const statusVal = document.getElementById('fStatusP').value;

  const registro = {
    id: editId ? editId : (dados.length > 0 ? Math.max(...dados.map(d => d.id)) + 1 : 1),
    nf: nf,
    abertura: editId ? dados.find(d => d.id === editId).abertura : hoje(),
    modalidade: document.getElementById('fModalidade').value || '—',
    status: statusVal,
    motivoCancelamento: statusVal === 'Cancelado' ? document.getElementById('fMotivoCancelamento').value : '',
    etapa: document.getElementById('fEtapa').value || '',
    bu: document.getElementById('fBu').value || '—',
    razao: document.getElementById('fRazao').value.trim() || '—',
    tipoDev: document.getElementById('fTipoDev').value || '—',
    tipoCli: document.getElementById('fTipoCli').value || '—',
    vendedor: document.getElementById('fVendedor').value.trim() || '—',
    valor: parseFloat(document.getElementById('fValor').value) || 0,
    finalizacao: fmtDI(document.getElementById('fFinalizacao').value),
    motivo: statusVal === 'Cancelado'
      ? document.getElementById('fMotivoCancelamento').value
      : (document.getElementById('fMotivo2').value || '—'),
    desc: document.getElementById('fDesc').value || ''
  };

  // Atualiza dados locais
  if (editId) {
    dados = dados.map(d => d.id === editId ? registro : d);
  } else {
    dados.push(registro);
  }
  PRODS[nf] = getProdRows();

  // Commit no GitHub
  const acao = editId ? 'Edição' : 'Nova';
  const ok = await salvarNoGitHub(`${acao} devolução NF ${nf}`);

  if (ok) {
    fecharModal();
    renderStats();
    filtrar();
  } else {
    // Reverte alteração local se falhou
    await carregarDados();
  }
}

// ══════════════════════════════════════════════════════
//  EDITAR
// ══════════════════════════════════════════════════════
function editar(id) {
  const d = dados.find(x => x.id === id);
  if (!d) return;
  abrirModal();
  editId = id;
  document.getElementById('mTitle').innerText = `Editar devolução — NF ${d.nf}`;

  document.getElementById('fNf').value = d.nf;
  document.getElementById('fNf').disabled = true;
  document.getElementById('fRazao').value = d.razao === '—' ? '' : d.razao;
  document.getElementById('fVendedor').value = d.vendedor === '—' ? '' : d.vendedor;
  document.getElementById('fBu').value = d.bu === '—' ? '' : d.bu;
  document.getElementById('fTipoCli').value = d.tipoCli === '—' ? '' : d.tipoCli;
  document.getElementById('fModalidade').value = d.modalidade === '—' ? '' : d.modalidade;
  document.getElementById('fTipoDev').value = d.tipoDev === '—' ? '' : d.tipoDev;
  document.getElementById('fStatusP').value = d.status;

  onStatusChange(d.status);
  document.getElementById('fEtapa').value = d.etapa;
  document.getElementById('fValor').value = d.valor || '';

  if (d.status === 'Finalizado' && d.finalizacao) {
    const p = d.finalizacao.split('/');
    if (p.length === 3) document.getElementById('fFinalizacao').value = `${p[2]}-${p[1]}-${p[0]}`;
  }

  if (d.status === 'Cancelado') {
    document.getElementById('fMotivoCancelamento').value = d.motivoCancelamento || d.motivo;
  } else {
    document.getElementById('fMotivo2').value = d.motivo === '—' ? '' : d.motivo;
  }

  document.getElementById('fDesc').value = d.desc;

  const list = PRODS[d.nf] || [];
  const container = document.getElementById('prodList');
  container.innerHTML = '';
  list.forEach(p => addProdRow(p.codProduto, p.fabricante, p.produto, p.quantidade));

  document.getElementById('overlay').classList.add('open');
  document.getElementById('overlay').scrollTop = 0;
  document.querySelector('.modal').scrollTop = 0;
}

// ══════════════════════════════════════════════════════
//  EXCLUIR (commit no GitHub)
// ══════════════════════════════════════════════════════
async function excluir(id) {
  const d = dados.find(x => x.id === id);
  if (!d) return;
  if (!confirm(`Deseja realmente excluir a devolução NF ${d.nf}?`)) return;

  dados = dados.filter(d => d.id !== id);
  const ok = await salvarNoGitHub(`Exclusão devolução NF ${d.nf}`);

  if (ok) {
    renderStats();
    filtrar();
  } else {
    await carregarDados();
  }
}

// ══════════════════════════════════════════════════════
//  EXPORTAR EXCEL
// ══════════════════════════════════════════════════════
function exportarExcel() {
  if (typeof XLSX === 'undefined') return alert('Biblioteca Excel não carregada.');
  const fonte = itensFiltrados.length > 0 ? itensFiltrados : dados;
  const linhas = [];

  fonte.forEach(d => {
    const prods = PRODS[d.nf] || [];
    const prodList = prods.length > 0 ? prods : [{ codProduto: '', fabricante: '', produto: '', quantidade: '' }];
    prodList.forEach((p, i) => {
      linhas.push({
        'Nº NF': d.nf, 'Data Abertura': d.abertura, 'Modalidade': d.modalidade,
        'Status': d.status, 'Motivo Cancelamento': d.motivoCancelamento || '',
        'Etapa': d.etapa || '', 'BU': d.bu, 'Motivo': d.motivo,
        'Razão Social': d.razao, 'Tipo Devolução': d.tipoDev,
        'Tipo Cliente': d.tipoCli, 'Vendedor': d.vendedor,
        'Cód. Produto': p.codProduto, 'Fabricante': p.fabricante,
        'Produto': p.produto, 'Quantidade': p.quantidade,
        'Valor Total': i === 0 ? d.valor : '',
        'Data Finalização': i === 0 ? (d.finalizacao || '') : ''
      });
    });
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(linhas);
  ws['!cols'] = [{wch:10},{wch:14},{wch:26},{wch:14},{wch:24},{wch:12},{wch:36},{wch:38},{wch:16},{wch:16},{wch:22},{wch:16},{wch:14},{wch:22},{wch:10},{wch:14},{wch:14}];
  XLSX.utils.book_append_sheet(wb, ws, 'Devoluções');
  const h = new Date();
  const dt = `${String(h.getDate()).padStart(2,'0')}${String(h.getMonth()+1).padStart(2,'0')}${h.getFullYear()}`;
  XLSX.writeFile(wb, `controle_devolucoes_WDC_${dt}.xlsx`);

  const info = document.getElementById('exportInfo');
  info.style.display = 'block';
  info.textContent = `✓ Relatório gerado com ${fonte.length} NF${fonte.length !== 1 ? 's' : ''}.`;
  setTimeout(() => { info.style.display = 'none'; }, 5000);
}

// ══════════════════════════════════════════════════════
//  INICIALIZAÇÃO
// ══════════════════════════════════════════════════════
window.onload = function () {
  carregarDados();
  document.getElementById('overlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModal();
  });
  document.getElementById('tokenOverlay').addEventListener('click', function (e) {
    if (e.target === this) fecharConfig();
  });
};
