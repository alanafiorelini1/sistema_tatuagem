const API = 'http://127.0.0.1:8000'
protegerPagina() 
const formEstilo = document.getElementById('form-estilo')
const botaoSubmit = document.getElementById('btn-submit-estilo')
const avisoSomenteLeitura = document.getElementById('aviso-somente-leitura')

if (!usuarioEhAdmin()) {
  formEstilo.classList.add('d-none')
  avisoSomenteLeitura.classList.remove('d-none')
}

function limparFormulario() {
  formEstilo.reset()
  delete formEstilo.dataset.idEstilo
  botaoSubmit.textContent = 'Cadastrar'
  botaoSubmit.classList.remove('btn-sucesso-custom')
}

async function listarEstilos() {
  const resposta = await fetchAutenticado(`${API}/estilos`)
  const estilos = await resposta.json()

  const corpo = document.getElementById('corpo-tabela')
  corpo.innerHTML = ''

  estilos.forEach(e => {
    corpo.innerHTML += `
      <tr>
        <td>${e.idestilo}</td>
        <td>${e.descricao}</td>
        <td>
          <button class="btn-acao-editar me-2" onclick='preencherFormularioEdicao(${JSON.stringify(e)})'>Editar</button>
          <button class="btn-acao-excluir" onclick="deletarEstilo(${e.idestilo})">Excluir</button>
        </td>
      </tr>`
  })
}

listarEstilos()

formEstilo.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (!usuarioEhAdmin()) {
    avisarAcessoRestrito()
    return
  }

  const estilo = { descricao: document.getElementById('descricao').value }
  const idEstilo = formEstilo.dataset.idEstilo

  if (idEstilo) {
    const resposta = await fetchAutenticado(`${API}/estilos/${idEstilo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estilo)
    })
    if (!resposta.ok) {
      if (resposta.status === 403) avisarAcessoRestrito()
      else alert('Não foi possível atualizar o estilo.')
      return
    }
  } else {
    const resposta = await fetchAutenticado(`${API}/estilos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estilo)
    })
    if (!resposta.ok) {
      if (resposta.status === 403) avisarAcessoRestrito()
      else alert('Não foi possível cadastrar o estilo.')
      return
    }
  }

  limparFormulario()
  listarEstilos()
})

function preencherFormularioEdicao(estilo) {
  if (!usuarioEhAdmin()) {
    avisarAcessoRestrito()
    return
  }

  document.getElementById('descricao').value = estilo.descricao
  formEstilo.dataset.idEstilo = estilo.idestilo
  botaoSubmit.textContent = 'Salvar alteração'
  botaoSubmit.classList.add('btn-sucesso-custom')
}

async function deletarEstilo(id) {
  if (!usuarioEhAdmin()) {
    avisarAcessoRestrito()
    return
  }

  if (!confirm('Tem certeza que deseja excluir este estilo?')) return
  const resposta = await fetchAutenticado(`${API}/estilos/${id}`, { method: 'DELETE' })
  if (!resposta.ok) {
    if (resposta.status === 403) avisarAcessoRestrito()
    else alert('Não foi possível excluir o estilo.')
    return
  }
  listarEstilos()
}