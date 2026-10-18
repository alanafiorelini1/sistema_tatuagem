const token = localStorage.getItem('token')

if (!token) {
  protegerPagina()
} else if (!usuarioEhAdmin()) {
  alert('O cadastro de funcionários é restrito a administradores.')
  window.location.replace('dashboard.html')
} else {
  const API = 'http://127.0.0.1:8000'
  const formCadastro = document.getElementById('form-cadastro')

  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault()

    const usuario = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value
    }

    const resposta = await fetchAutenticado(`${API}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    })

    if (resposta.ok) {
      alert('Cadastro feito com sucesso!')
      window.location.href = 'dashboard.html'
    } else if (resposta.status === 403) {
      avisarAcessoRestrito()
    } else {
      const erro = await resposta.json()
      alert('Erro ao cadastrar: ' + JSON.stringify(erro))
    }
  })
}