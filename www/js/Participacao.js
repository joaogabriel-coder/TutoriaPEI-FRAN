const ra = localStorage.getItem('alunoId')

if (!ra) {
  alert('RA não encontrado. Retorne à tela de opções.')
  location.href = 'Opcoes.html'
}
document.addEventListener('DOMContentLoaded', () => {
  const ra = localStorage.getItem('alunoId')
  if (!ra) return

  carregarDados()
  carregarOcorrencias(ra)
  carregarLeituras()
})

async function salvarDados(data) {
  const formatedData = {
    clubeJuvenil1: data.clube1,
    eletiva1: data.eletiva1,
    liderTurma1: data.lider1 === 'sim' ? true : false,
    alunoGremista1: data.gremista1 === 'sim' ? true : false,
    jovemAcolhedor1: data.acolhedor1 === 'sim' ? true : false,
    clubeJuvenil2: data.clube2,
    eletiva2: data.eletiva2,
    liderTurma2: data.lider2 === 'sim' ? true : false,
    alunoGremista2: data.gremista2 === 'sim' ? true : false,
    jovemAcolhedor2: data.acolhedor2 === 'sim' ? true : false,
  }

  console.log(formatedData)

  try {
    const resp = await fetch(`http://localhost:8080/alunos/${ra}/participacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatedData),
    })

    if (!resp.ok) {
      alert('Erro ao salvar um dos registros.')
      return
    }

    alert('Todos os resultados foram enviados com sucesso!')
  } catch (error) {
    console.error(error)
    alert('Falha ao conectar com o servidor.')
  }
}

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault()
  const formData = new FormData(document.querySelector('form'))
  const data = Object.fromEntries(formData.entries())

  salvarDados(data)
})

document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('click', e => {
    e.preventDefault()
  })
})

async function carregarDados() {
  const ra = localStorage.getItem('alunoId')
  if (!ra) return

  try {
    const resp = await fetch(`http://localhost:8080/alunos/${ra}/participacao`)

    if (!resp.ok) {
      console.warn('Nenhuma participacao encontrada.')
      return
    }

    const participacao = await resp.json()
    console.log('Participacao carregada:', participacao)

    document.querySelector('input[name="clube1"]').value = participacao.clubeJuvenil1
    document.querySelector('input[name="clube2"]').value = participacao.clubeJuvenil2
    
    document.querySelector('input[name="eletiva1"]').value = participacao.eletiva1
    document.querySelector('input[name="eletiva2"]').value = participacao.eletiva2
  
    preencherRadio("lider1", participacao.liderTurma1)
    preencherRadio("lider2", participacao.liderTurma2)

    preencherRadio("gremista1", participacao.alunoGremista1)
    preencherRadio("gremista2", participacao.alunoGremista2)

    preencherRadio("acolhedor1", participacao.jovemAcolhedor1)
    preencherRadio("acolhedor2", participacao.jovemAcolhedor2)

  } catch (err) {
    console.error('Erro ao carregar Participacao:', err)
  }
}

function preencherRadio(nome, valorBoolean) {
  const valor = valorBoolean ? "sim" : "nao"
  const radio = document.querySelector(`input[name="${nome}"][value="${valor}"]`)
  if (radio) radio.checked = true
}


async function carregarOcorrencias(ra) {
  try {
    const resp = await fetch(`http://localhost:8080/alunos/${ra}/ocorrencias`)

    if (!resp.ok) return

    const dados = await resp.json()

    console.log(dados)

    if (dados.numBi1 > 0) {
      document.querySelector('input[name="ocorrencia1"]').checked = true
    }

    if (dados.numBi2 > 0) {
      document.querySelector('input[name="ocorrencia2"]').checked = true
    }

    if (dados.numBi3 > 0) {
      document.querySelector('input[name="ocorrencia3"]').checked = true
    }

    if (dados.numBi4 > 0) {
      document.querySelector('input[name="ocorrencia4"]').checked = true
    }
  } catch (e) {
    console.error('Erro ao carregar ocorrências:', e)
  }
}

async function carregarLeituras() {
  const ra = localStorage.getItem('alunoId')
  if (!ra) return

  try {
    const resp = await fetch(`http://localhost:8080/alunos/${ra}/leituras`)

    if (!resp.ok) {
      console.warn('Nenhuma leitura encontrada.')
      return
    }

    const leituras = await resp.json()
    console.log('Leituras carregadas:', leituras)

    leituras.forEach(leitura => {
      const el = document.querySelector(`.leituras-${leitura.bimestre}`)
      if (el) {
        el.textContent += (el.textContent ? ', ' : '') + leitura.livro
      }
    })
  } catch (err) {
    console.error('Erro ao carregar leituras:', err)
  }
}


