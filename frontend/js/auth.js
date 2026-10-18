// ============================================================
// js/auth.js — Funções compartilhadas de autenticação
// Descrição: Usadas por toda tela protegida, pra checar login
//            e mandar o token em toda requisição pra API.
// ============================================================

// ─── Bloqueia a página se não tiver um token guardado ───
function protegerPagina() {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = 'login.html'
  }
}

function usuarioEhAdmin() {
  const token = localStorage.getItem('token')
  const segmentoPayload = token && token.split('.')[1]

  if (!segmentoPayload) return false

  try {
    const base64 = segmentoPayload.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
    return payload.tipo === 'admin'
  } catch {
    return false
  }
}

function avisarAcessoRestrito() {
  alert('Esta ação é restrita a administradores. Funcionários podem apenas visualizar.')
}

document.addEventListener('click', (evento) => {
  if (usuarioEhAdmin() || !(evento.target instanceof Element)) return

  const link = evento.target.closest('a[href]')
  if (!link) return

  const destino = new URL(link.href, window.location.href)
  if (destino.pathname.toLowerCase().endsWith('/cadastro.html')) {
    evento.preventDefault()
    alert('O cadastro de funcionários é restrito a administradores.')
  }
})

// ─── Faz um fetch normal, mas já anexando o token no cabeçalho ───
async function fetchAutenticado(url, opcoes = {}) {
  const token = localStorage.getItem('token')

  opcoes.headers = {
    ...opcoes.headers,           // mantém qualquer header que a chamada já tivesse (tipo Content-Type)
    'Authorization': `Bearer ${token}`
  }

  const resposta = await fetch(url, opcoes)

  if (resposta.status === 401) {
    // o token não é mais válido (expirou, ou foi removido) — manda de volta pro login
    localStorage.removeItem('token')
    window.location.href = 'login.html'
  }

  return resposta
}

// ─── Desloga: apaga o token e volta pra tela de login ───
function sair() {
  localStorage.removeItem('token')
  window.location.href = 'login.html'
}