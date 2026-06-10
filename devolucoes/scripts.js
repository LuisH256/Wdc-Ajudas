// scripts.js - Controle de Devoluções — WDC Networks

// Inicialização direta a partir do arquivo dados.js (compartilhado entre usuários)
let dados = JSON.parse(JSON.stringify(dadosIniciais));

const fmt = v => (+v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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

// Paginação e filtros
let itensFiltrados = [];
let paginaAtual = 1;
const itensPorPagina = 15;
let ordenacao = { coluna: 'id', ascendente: false };
let editId = null;

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
  if (ordenacao.coluna === coluna) {
    ordenacao.ascendente = !ordenacao.ascendente;
  } else {
    ordenacao.coluna = coluna;
    ordenacao.ascendente = true;
  }
  filtrar();
}

function ordenarDados() {
  const col = ordenacao.coluna;
  const asc = ordenacao.ascendente ? 1 : -1;

  itensFiltrados.sort((a, b) => {
    let va = a[col], vb = b[col];
    if (col === 'valor') {
      return (Number(va) - Number(vb)) * asc;
    }
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
          <button class="act-btn" onclick="editar(${d.id})" title="Editar registro"><i class="ti ti-pencil"></i></button>
          <button class="act-btn del" onclick="excluir(${d.id})" title="Excluir registro"><i class="ti ti-trash"></i></button>
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

function mudarPagina(p) {
  paginaAtual = p;
  renderTabela();
}

function abrirModal() {
  editId = null;
  document.getElementById('mTitle').innerText = 'Nova solicitação de devolução';
  document.getElementById('fNf').disabled = false;

  // Limpar campos
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

function fecharModal() {
  document.getElementById('overlay').classList.remove('open');
}

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

  if (val === 'Cancelado') {
    motivoCancWrap.style.display = 'block';
  } else {
    motivoCancWrap.style.display = 'none';
    document.getElementById('fMotivoCancelamento').value = '';
  }

  if (val === 'Finalizado') {
    finalizacaoWrap.style.display = 'block';
  } else {
    finalizacaoWrap.style.display = 'none';
    document.getElementById('fFinalizacao').value = '';
  }
}

function addProdRow(cod, fab, prod, qtd) {
  cod = cod || '';
  fab = fab || '';
  prod = prod || '';
  qtd = qtd || '';
  const container = document.getElementById('prodList');
  const div = document.createElement('div');
  div.className = 'prod-row';
  div.innerHTML = `
    <input type="text" placeholder="Código" value="${cod}" class="p-cod">
    <input type="text" placeholder="Fabricante" value="${fab}" class="p-fab">
    <input type="text" placeholder="Produto" value="${prod}" class="p-prod">
    <input type="number" placeholder="Qtd" value="${qtd}" min="1" class="p-qtd">
    <button class="btn-rm-prod" type="button" onclick="this.parentElement.remove()" title="Remover produto"><i class="ti ti-trash"></i></button>
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

function salvar() {
  const nf = document.getElementById('fNf').value.trim();
  if (!nf) return alert('O número da NF é obrigatório.');

  const hoje = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const statusVal = document.getElementById('fStatusP').value;

  let r = {
    id: editId ? editId : (dados.length ? Math.max(...dados.map(d => d.id)) + 1 : 1),
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

  // Salva lista de produtos associados ao número da NF
  PRODS[nf] = getProdRows();

  if (editId) {
    dados = dados.map(d => d.id === editId ? r : d);
  } else {
    dados.push(r);
  }

  fecharModal();
  renderStats();
  filtrar();
}

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

  // Injetar produtos vinculados
  const list = PRODS[d.nf] || [];
  const container = document.getElementById('prodList');
  container.innerHTML = '';
  list.forEach(p => addProdRow(p.codProduto, p.fabricante, p.produto, p.quantidade));

  document.getElementById('overlay').classList.add('open');
  document.getElementById('overlay').scrollTop = 0;
  document.querySelector('.modal').scrollTop = 0;
}

function excluir(id) {
  if (!confirm('Deseja realmente remover esta devolução?')) return;
  dados = dados.filter(d => d.id !== id);
  renderStats();
  filtrar();
}

function exportarExcel() {
  if (typeof XLSX === 'undefined') return alert('Biblioteca Excel não carregada.');
  const fonte = itensFiltrados.length > 0 ? itensFiltrados : dados;
  const linhas = [];

  fonte.forEach(d => {
    const prods = PRODS[d.nf] || [];
    const prodList = prods.length > 0 ? prods : [{ codProduto: '', fabricante: '', produto: '', quantidade: '' }];
    prodList.forEach((p, i) => {
      linhas.push({
        'Nº NF': d.nf,
        'Data Abertura': d.abertura,
        'Modalidade': d.modalidade,
        'Status': d.status,
        'Motivo Cancelamento': d.motivoCancelamento || '',
        'Etapa': d.etapa || '',
        'BU': d.bu,
        'Motivo': d.motivo,
        'Razão Social': d.razao,
        'Tipo Devolução': d.tipoDev,
        'Tipo Cliente': d.tipoCli,
        'Vendedor': d.vendedor,
        'Cód. Produto': p.codProduto,
        'Fabricante': p.fabricante,
        'Produto': p.produto,
        'Quantidade': p.quantidade,
        'Valor Total': i === 0 ? d.valor : '',
        'Data Finalização': i === 0 ? (d.finalizacao || '') : ''
      });
    });
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(linhas);
  ws['!cols'] = [
    { wch: 10 }, { wch: 14 }, { wch: 26 }, { wch: 14 }, { wch: 24 },
    { wch: 12 }, { wch: 36 }, { wch: 38 }, { wch: 16 }, { wch: 16 },
    { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 22 }, { wch: 10 },
    { wch: 14 }, { wch: 14 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Devoluções');
  const h = new Date();
  const dt = `${String(h.getDate()).padStart(2, '0')}${String(h.getMonth() + 1).padStart(2, '0')}${h.getFullYear()}`;
  XLSX.writeFile(wb, `controle_devolucoes_WDC_${dt}.xlsx`);

  const info = document.getElementById('exportInfo');
  info.style.display = 'block';
  info.textContent = `✓ Relatório gerado com ${fonte.length} NF${fonte.length !== 1 ? 's' : ''} exportada${fonte.length !== 1 ? 's' : ''}.`;
  setTimeout(() => { info.style.display = 'none'; }, 5000);
}

// Inicializadores automáticos ao carregar a página
window.onload = function () {
  renderStats();
  filtrar();

  document.getElementById('overlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModal();
  });
};
