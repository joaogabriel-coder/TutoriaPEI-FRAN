const ra = localStorage.getItem('alunoId')

if (!ra) {
  alert('RA não encontrado. Retorne à tela de opções.')
  location.href = 'Opcoes.html'
}
document.addEventListener('DOMContentLoaded', () => {
  const ra = localStorage.getItem('alunoId')
  if (!ra) return

  carregarOcorrencias(ra)
  carregarLeituras()
})

function coletarLeituras() {
  const linhas = document.querySelectorAll('#tabelaLeituras tr')
  const leituras = []

  linhas.forEach(linha => {
    const inputs = linha.querySelectorAll('input')

    inputs.forEach((input, index) => {
      const livro = input.value.trim()
      if (livro !== '') {
        leituras.push({
          bimestre: index + 1,
          livro: livro,
        })
      }
    })
  })

  return leituras
}
async function salvarSomenteOcorrencias() {
  const ra = localStorage.getItem('alunoId')

  const ocorrencia = {
    numBi1: document.getElementById('bi1').value,
    numBi2: document.getElementById('bi2').value,
    numBi3: document.getElementById('bi3').value,
    numBi4: document.getElementById('bi4').value,
  }

  try {
    const resp = await fetch(`http://localhost:8080/alunos/${ra}/ocorrencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ocorrencia),
    })

    if (resp.ok) {
      alert('Ocorrências salvas com sucesso!')
    } else {
      alert('Erro ao salvar ocorrências.')
    }
  } catch (e) {
    alert('Falha na conexão.')
    console.error(e)
  }
}
function coletarLeituras() {
  const linhas = document.querySelectorAll('#tabelaLeituras tr')
  const leituras = []

  linhas.forEach(linha => {
    const inputs = linha.querySelectorAll('input')

    inputs.forEach((input, index) => {
      const livro = input.value.trim()
      if (livro !== '') {
        const leituraId = input.dataset.leituraId || null

        leituras.push({
          id: leituraId,
          bimestre: index + 1,
          livro: livro,
        })
      }
    })
  })

  return leituras
}

async function salvarSomenteLeituras() {
  const ra = localStorage.getItem('alunoId')
  const leituras = coletarLeituras()

  try {
    for (const leitura of leituras) {
      const url = leitura.id
        ? `http://localhost:8080/alunos/${ra}/leituras/${leitura.id}`
        : `http://localhost:8080/alunos/${ra}/leituras`

      const method = leitura.id ? 'PUT' : 'POST'

      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leitura),
      })

      if (!resp.ok) {
        alert('Erro ao salvar leitura: ' + JSON.stringify(leitura))
        return
      }
    }
    alert('Leituras salvas com sucesso!')
  } catch (e) {
    alert('Falha na conexão.')
    console.error(e)
  }
}
async function carregarOcorrencias(ra) {
  try {
    const resp = await fetch(`http://localhost:8080/alunos/${ra}/ocorrencias`)

    if (!resp.ok) return

    const dados = await resp.json()

    document.getElementById('bi1').value = dados.numBi1 || ''
    document.getElementById('bi2').value = dados.numBi2 || ''
    document.getElementById('bi3').value = dados.numBi3 || ''
    document.getElementById('bi4').value = dados.numBi4 || ''
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

    leituras.forEach(l => {
      const bimestre = l.bimestre
      const livro = l.livro
      const id = l.id
      const inputs = document.querySelectorAll(`input[id^="bm${bimestre}"]`)

      for (let inp of inputs) {
        if (inp.value.trim() === '') {
          inp.value = livro
          inp.dataset.leituraId = id
          break
        }
      }
    })
  } catch (err) {
    console.error('Erro ao carregar leituras:', err)
  }
}
