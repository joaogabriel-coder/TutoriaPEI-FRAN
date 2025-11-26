const ra = localStorage.getItem('alunoId')

if (!ra) {
  alert('RA não encontrado. Retorne à tela de opções.')
  location.href = 'Opcoes.html'
}

document.addEventListener('input', function (e) {
  if (e.target.tagName.toLowerCase() === 'textarea') {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  let countNum = 1

  async function carregarResultados() {
    const ra = localStorage.getItem('alunoId')
    if (!ra) return

    try {
      const resp = await fetch(`http://localhost:8080/alunos/${ra}/registroAtendimentos`)
      if (!resp.ok) return

      const atendimentos = await resp.json()
      if (!Array.isArray(atendimentos) || atendimentos.length === 0) {
        const table = document.querySelector('table')
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
            <td>
              <input class="data-input" type="text" name="data${countNum}" placeholder="DD/MM/AAAA"   />
            </td>
            <td style="text-align:center;">
              <label><input type="radio" name="assunto${countNum}" value="Academico" />A</label>
              <label><input type="radio" name="assunto${countNum}" value="Pessoal" />P</label>
            </td> 
            <td>
              <textarea
                placeholder="Digite as observações..."
                oninput="autoResize(this)"
                name="observacoesProfessor${countNum}"
              ></textarea>
            </td>
          `
        table.appendChild(newRow)
        countNum++
      }

      atendimentos.forEach(av => {
        console.log(av)
        const table = document.querySelector('table')
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
            <td>
              <input class="data-input" type="text" name="data${countNum}" placeholder="DD/MM/AAAA" value="${dataFormatter(
          av.data
        )}" data-id="${av.id}"   />
            </td>
            <td style="text-align:center;">
              <label><input type="radio" name="assunto${countNum}" value="Academico" ${
          av.assunto.toLowerCase() === 'academico' ? 'checked' : ''
        } data-id="${av.id}" />A</label>
              <label><input type="radio" name="assunto${countNum}" value="Pessoal" ${
          av.assunto.toLowerCase() === 'pessoal' ? 'checked' : ''
        } data-id="${av.id}" />P</label>
            </td> 
            <td>
              <textarea
                placeholder="Digite as observações..."
                oninput="autoResize(this)"
                name="observacoesProfessor${countNum}"
                data-id="${av.id}"
              >${av.observacoesProfessor}</textarea>
            </td>
          `
        table.appendChild(newRow)
        countNum++
      })
    } catch (e) {
      console.error('Erro ao carregar resultados:', e)
    }
  }

  carregarResultados()

  const addBtn = document.getElementById('add')
  const table = document.querySelector('table')

  window.autoResize = function (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  addBtn.addEventListener('click', e => {
    e.preventDefault()

    const newRow = document.createElement('tr')

    newRow.innerHTML = `
      <td>
        <input class="data-input" type="text" name="data${countNum}" placeholder=""/>
      </td>
      <td style="text-align:center;">
        <label><input type="radio" name="assunto${countNum}" value="Academico" />A</label>
        <label><input type="radio" name="assunto${countNum}" value="Pessoal" />P</label>
      </td> 
      <td>
        <textarea
          placeholder="Digite as observações..."
          oninput="autoResize(this)"
          name="observacoesProfessor${countNum}"
        ></textarea>
      </td>
    `

    table.appendChild(newRow)
    countNum++
  })

  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    const data = coletarResultados()
    const arrData = Object.values(data)
    salvarResultado(arrData)
  })
})

function dataFormatter(data) {
  if (data.includes('/')) {
    const arrData = data.split('/')
    return `${arrData[2]}-${arrData[1]}-${arrData[0]}`
  }
  const arrData = data.split('-')
  return `${arrData[2]}/${arrData[1]}/${arrData[0]}`
}

function coletarResultados() {
  const formData = new FormData(document.querySelector('form'))
  const registros = {}

  formData.forEach((valor, chave) => {
    if (!valor.trim()) return

    const match = chave.match(/^([a-zA-Z]+)(\d+)$/)
    if (!match) return

    const [, campo, num] = match

    const key = `registro_${num}`

    const elemento = document.querySelector(`[name="${chave}"]`)
    const id = elemento?.dataset?.id || null

    if (!registros[key]) {
      registros[key] = {
        id: id,
        data: '',
        assunto: '',
        observacoesProfessor: '',
      }
    }

    if (campo === 'data') {
      registros[key].data = dataFormatter(valor)
    }

    if (campo === 'assunto') {
      registros[key].assunto = valor
    }

    if (campo === 'observacoesProfessor') {
      registros[key].observacoesProfessor = valor
    }
  })

  return registros
}

async function salvarResultado(arrData) {
  try {
    for (const registro of arrData) {
      const urlBase = `http://localhost:8080/alunos/${ra}/registroAtendimentos`

      const url = registro.id ? `${urlBase}/${registro.id}` : urlBase

      const method = registro.id ? 'PUT' : 'POST'

      const resp = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro),
      })

      if (!resp.ok) {
        alert('Erro ao salvar um dos registros.')
        return
      }
    }

    alert('Todos os resultados foram enviados com sucesso!')
    location.reload();
  } catch (e) {
    console.error(e)
    alert('Falha ao conectar com o servidor.')
  }
}
