// endereço da nossa API backend
const API = 'http://127.0.0.1:8000'
protegerPagina() 

// elementos do formulário e do botão de enviar
const formSenioridade = document.getElementById('form-senioridade')
const botaoSubmit = document.getElementById('btn-submit-senioridade')
const avisoSomenteLeitura = document.getElementById('aviso-somente-leitura')

if (!usuarioEhAdmin()) {
  formSenioridade.classList.add('d-none')
  avisoSomenteLeitura.classList.remove('d-none')
}

// limpa o formulário e devolve o botão para o modo de cadastro
function limparFormulario() {
  formSenioridade.reset()
  delete formSenioridade.dataset.idSenioridade
  botaoSubmit.textContent = 'Cadastrar'
  botaoSubmit.classList.remove('btn-sucesso-custom')
}

// ─── Carrega a lista de senioridades ao abrir a página ───
async function listarSenioridades() {
  const resposta = await fetchAutenticado(`${API}/senioridade`)
  const senioridades = await resposta.json()

  const corpo = document.getElementById('corpo-tabela')
  corpo.innerHTML = ''

  senioridades.forEach(s => {
    corpo.innerHTML += `
      <tr>
        <td>${s.idsenioridade}</td>
        <td>${s.nome}</td>
        <td>
          <button class="btn-acao-editar me-2" onclick='preencherFormularioEdicao(${JSON.stringify(s)})'>Editar</button>
          <button class="btn-acao-excluir" onclick="deletarSenioridade(${s.idsenioridade})">Excluir</button>
        </td>
      </tr>`
  })
}

listarSenioridades()

// ─── Cadastrar e atualizar senioridades ───
formSenioridade.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (!usuarioEhAdmin()) {
    avisarAcessoRestrito()
    return
  }

  const senioridade = { nome: document.getElementById('nome').value }
  const idSenioridade = formSenioridade.dataset.idSenioridade

  if (idSenioridade) {
    const resposta = await fetchAutenticado(`${API}/senioridade/${idSenioridade}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(senioridade)
    })
    if (!resposta.ok) {
      if (resposta.status === 403) avisarAcessoRestrito()
      else alert('Não foi possível atualizar a senioridade.')
      return
    }
  } else {
    const resposta = await fetchAutenticado(`${API}/senioridade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(senioridade)
    })
    if (!resposta.ok) {
      if (resposta.status === 403) avisarAcessoRestrito()
      else alert('Não foi possível cadastrar a senioridade.')
      return
    }
  }

  limparFormulario()
  listarSenioridades()
})

// ─── Abre os dados da senioridade no formulário para edição ───
function preencherFormularioEdicao(senioridade) {
  if (!usuarioEhAdmin()) {
    avisarAcessoRestrito()
    return
  }

  document.getElementById('nome').value = senioridade.nome
  formSenioridade.dataset.idSenioridade = senioridade.idsenioridade

  botaoSubmit.textContent = 'Salvar alteração'
  botaoSubmit.classList.add('btn-sucesso-custom')
}

// ─── Exclui uma senioridade ───
async function deletarSenioridade(id) {
  if (!usuarioEhAdmin()) {
    avisarAcessoRestrito()
    return
  }

  if (!confirm('Tem certeza que deseja excluir esta senioridade?')) return

  const resposta = await fetchAutenticado(`${API}/senioridade/${id}`, { method: 'DELETE' })
  if (!resposta.ok) {
    if (resposta.status === 403) avisarAcessoRestrito()
    else alert('Não foi possível excluir a senioridade.')
    return
  }
  listarSenioridades()
}