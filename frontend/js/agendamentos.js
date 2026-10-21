// endereço da nossa API backend
const API = 'http://127.0.0.1:8000'
protegerPagina() 

// elementos do formulário e do botão de enviar
const formAgendamento = document.getElementById('form-agendamento')
const botaoSubmit = document.getElementById('btn-submit-agendamento')
const blocoStatus = document.getElementById('bloco-status')

// limpa o formulário e devolve para o modo de cadastro
function limparFormulario() {
  formAgendamento.reset()
  delete formAgendamento.dataset.idAgendamento
  botaoSubmit.textContent = 'Cadastrar'
  botaoSubmit.classList.remove('btn-sucesso-custom')
  blocoStatus.style.display = 'none'   // esconde o status de novo — cadastro não usa esse campo
}

// ─── Busca os clientes na API e preenche o <select> ───
async function carregarClientes() {
  const resposta = await fetchAutenticado(`${API}/clientes`)
  const clientes = await resposta.json()

  const select = document.getElementById('idcliente')
  select.innerHTML = '<option value="">Cliente...</option>'

  clientes.forEach(c => {
    select.innerHTML += `<option value="${c.idcliente}">${c.nome}</option>`
  })
}

// ─── Busca os tatuadores na API e preenche o <select> ───
async function carregarTatuadores() {
  const resposta = await fetchAutenticado(`${API}/tatuadores`)
  const tatuadores = await resposta.json()

  const select = document.getElementById('idtatuador')
  select.innerHTML = '<option value="">Tatuador...</option>'

  tatuadores.forEach(t => {
    select.innerHTML += `<option value="${t.idtatuador}">${t.nometatuador}</option>`
  })
}

const clientesCarregados = carregarClientes()
const tatuadoresCarregados = carregarTatuadores()

// ─── Cadastrar e atualizar agendamentos ───
formAgendamento.addEventListener('submit', async (e) => {
  e.preventDefault()

  const agendamento = {
    idcliente: Number(document.getElementById('idcliente').value),
    idtatuador: Number(document.getElementById('idtatuador').value),
    dataagendamento: document.getElementById('dataagendamento').value,
    horaagendamento: document.getElementById('horaagendamento').value,
    descricaotatuagem: document.getElementById('descricaotatuagem').value || null,
    valortatuagem: document.getElementById('valortatuagem').value
      ? Number(document.getElementById('valortatuagem').value)
      : null,
    status: document.getElementById('status').value
  }

  const idAgendamento = formAgendamento.dataset.idAgendamento
  let idParaUpload = idAgendamento   // qual id vamos usar pra anexar a imagem, se houver uma

  if (idAgendamento) {
    const resposta = await fetchAutenticado(`${API}/agendamentos/${idAgendamento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agendamento)
    })
    if (!resposta.ok) {
      alert(`Não foi possível atualizar o agendamento. Erro ${resposta.status}: ${await resposta.text()}`)
      return
    }
  } else {
    const resposta = await fetchAutenticado(`${API}/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agendamento)
    })
    if (!resposta.ok) {
      alert(`Não foi possível cadastrar o agendamento. Erro ${resposta.status}: ${await resposta.text()}`)
      return
    }
    const dados = await resposta.json()
    idParaUpload = dados.idagendamento   // pega o id que acabou de ser criado
  }

  // ─── Se um arquivo foi escolhido, envia numa segunda chamada, separada ───
  const arquivo = document.getElementById('desenho').files[0]
  if (arquivo) {
    const formData = new FormData()   // FormData, não JSON — porque tem um arquivo dentro
    formData.append('arquivo', arquivo)   // "arquivo" precisa ser o mesmo nome do parâmetro no FastAPI

    const resposta = await fetchAutenticado(`${API}/agendamentos/${idParaUpload}/desenho`, {
      method: 'POST',
      body: formData
      // repare que aqui NÃO colocamos o header Content-Type — o navegador
      // define esse cabeçalho sozinho quando o corpo é um FormData
    })
    if (!resposta.ok) {
      alert(`O agendamento foi salvo, mas não foi possível enviar a imagem. Erro ${resposta.status}: ${await resposta.text()}`)
      return
    }
  }

  limparFormulario()
  listarAgendamentos()
})
// ─── Exclui um agendamento ───
async function deletarAgendamento(id) {
  if (!confirm('Tem certeza que deseja excluir este agendamento?')) return

  await fetchAutenticado(`${API}/agendamentos/${id}`, { method: 'DELETE' })
  listarAgendamentos()
}

async function preencherFormularioEdicao(agendamento) {
  await Promise.all([clientesCarregados, tatuadoresCarregados])

  document.getElementById('idcliente').value = agendamento.idcliente
  document.getElementById('idtatuador').value = agendamento.idtatuador
  document.getElementById('dataagendamento').value = String(agendamento.dataagendamento).slice(0, 10)
  document.getElementById('horaagendamento').value = agendamento.horaagendamento
  document.getElementById('valortatuagem').value = agendamento.valortatuagem ?? ''
  document.getElementById('descricaotatuagem').value = agendamento.descricaotatuagem ?? ''
  document.getElementById('status').value = agendamento.status ?? 'pendente'

  formAgendamento.dataset.idAgendamento = agendamento.idagendamento
  blocoStatus.style.display = 'block'
  botaoSubmit.textContent = 'Salvar alteração'
  botaoSubmit.classList.add('btn-sucesso-custom')
  formAgendamento.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function listarAgendamentos() {
  const resposta = await fetchAutenticado(`${API}/agendamentos`)
  const agendamentos = await resposta.json()

  const corpo = document.getElementById('corpo-tabela')
  corpo.innerHTML = ''

  agendamentos.forEach(a => {
    // se existir um desenho salvo, monta uma miniatura; senão, mostra "-"
    const imagemHtml = a.desenhoaprovado
      ? `<img src="${API}/uploads/${encodeURIComponent(a.desenhoaprovado)}" class="tattoo-preview" alt="Desenho aprovado" onerror="this.alt='Imagem indisponível'; this.classList.add('imagem-indisponivel')">`
      : '-'

    corpo.innerHTML += `
      <tr>
        <td>${a.idagendamento}</td>
        <td>${a.cliente}</td>
        <td>${a.tatuador}</td>
        <td>${a.dataagendamento}</td>
        <td>${a.horaagendamento}</td>
        <td>${a.valortatuagem ?? '-'}</td>
        <td>${a.status}</td>
        <td>${imagemHtml}</td>
        <td>
          <button class="btn-acao-editar me-2" onclick='preencherFormularioEdicao(${JSON.stringify(a)})'>Editar</button>
          <button class="btn-acao-excluir" onclick="deletarAgendamento(${a.idagendamento})">Excluir</button>
        </td>
      </tr>`
  })
}

listarAgendamentos()