// --- Função auxiliar para marcar Sim/Não ---
function marcarRadio(radioNodeList, valor) {
  if (!radioNodeList) return
  const value = valor ? 'sim' : 'nao'
  ;[...radioNodeList].forEach(r => {
    r.checked = r.value === value
  })
}

// --- Função auxiliar para formatar datas ---
function formatarData(dataISO) {
  if (!dataISO) return ''
  const [ano, mes, dia] = dataISO.split('-')
  return `${dia}/${mes}/${ano}`
}

const ra = localStorage.getItem('alunoId')
const usuarioId = localStorage.getItem('usuarioId')

if (!ra) {
  alert('RA não encontrado. Retorne à tela de opções.')
  location.href = 'Opcoes.html'
}
document.addEventListener('DOMContentLoaded', () => {
  const ra = localStorage.getItem('alunoId')
  if (!ra) return

  carregarAluno(ra)

  function dataFormatter(data) {
  if (data.includes('/')) {
    const arrData = data.split('/')
    return `${arrData[2]}-${arrData[1]}-${arrData[0]}`
  }
  const arrData = data.split('-')
  return `${arrData[2]}/${arrData[1]}/${arrData[0]}`
}

  document.querySelector('#salvar').addEventListener('click', async () => {
    const form = document.querySelector('form')
    const formData = new FormData(form)
    const data = {}

    for (const [key, value] of formData.entries()) {
      if (value === 'sim') {
        data[key] = true
      } else if (value === 'nao') {
        data[key] = false
      } else {
        data[key] = value
      }
    }

    const aluno = {
      nome: data.nome,
      email: data.email,
      dataNasc: dataFormatter(data.dataNasc),
      idade: data.idade,
      telefone: data.telefone,
      transporte: data.transporte,
      projetoVida: data.projetoVida,
      serie: data.serie.toString(),
      endereco: data.endereco,
      imgUrl: null,
      usuarioId: usuarioId,
    }

    console.log(aluno)

    const dadosFamilia = {
      pai: data.pai,
      mae: data.mae,
      responsavel: data.responsavel,
      estruturaFamiliar: data.estruturaFamiliar,
      numPai: data.numPai,
      numMae: data.numMae,
      numResponsavel: data.numResponsavel,
    }

    console.log(dadosFamilia)

    const escolaridade = {
      contatoFora: data.contatoFora,
      difAprendizagem: data.difAprendizagem,
      apoioPedagogico: data.apoioPedagogico,
      disciplinasFacilidade: data.disciplinasFacilidade
        ? data.disciplinasFacilidade
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '')
        : [],
      disciplinasDificuldade: data.disciplinasDificuldade
        ? data.disciplinasDificuldade
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '')
        : [],
      atividadeExtra: data.atividadeExtra,
      difLocomotiva: data.difLocomotiva,
      difVisao: data.difVisao,
      difAtencao: data.difAtencao,
      difFala: data.difFala,
      difEscrita: data.difEscrita,
      adaptacaoGrupo: data.adaptacaoGrupo,
      reprovado: data.reprovado,
      serieAnoReprovado: data.serieAnoReprovado,
    }

    console.log(escolaridade)

    try {
      const resp = await fetch(`http://localhost:8080/alunos/${ra}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
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

    try {
      const resp = await fetch(`http://localhost:8080/alunos/${ra}/dadosFamilia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFamilia),
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

    try {
      const resp = await fetch(`http://localhost:8080/alunos/${ra}/escolaridade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(escolaridade),
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
  })

  async function carregarAluno(ra) {
    try {
      const response = await fetch(`http://localhost:8080/alunos/${ra}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar aluno: ' + response.status)
      }

      const aluno = await response.json()
      const form = document.getElementById('formAluno')

      // --- Dados básicos ---
      form.elements['nome'].value = aluno.nome || ''
      form.elements['serie'].value = `${aluno.serie || ''}`
      form.elements['idade'].value = `${aluno.idade || ''}`
      form.elements['dataNasc'].value = aluno.dataNasc ? formatarData(aluno.dataNasc) : ''
      form.elements['endereco'].value = aluno.endereco || ''
      form.elements['telefone'].value = aluno.telefone || ''
      form.elements['email'].value = aluno.email || ''
      form.elements['transporte'].value = aluno.transporte || ''
      form.elements['projetoVida'].value = aluno.projetoVida || ''
      // --- Dados familiares ---
      form.elements['pai'].value = aluno.dadoFamilia ? aluno.dadoFamilia.pai : ''
      form.elements['mae'].value = aluno.dadoFamilia ? aluno.dadoFamilia.mae : ''
      form.elements['responsavel'].value = aluno.dadoFamilia ? aluno.dadoFamilia.responsavel : ''
      form.elements['numPai'].value = aluno.dadoFamilia ? aluno.dadoFamilia.numPai : ''
      form.elements['numMae'].value = aluno.dadoFamilia ? aluno.dadoFamilia.numMae : ''
      form.elements['numResponsavel'].value = aluno.dadoFamilia ? aluno.dadoFamilia.numResponsavel : ''
      form.elements['estruturaFamiliar'].value = aluno.dadoFamilia
        ? aluno.dadoFamilia.estruturaFamiliar
        : ''

      // --- Escolaridade ---
      marcarRadio(form.elements['reprovado'], aluno.escolaridade ? aluno.escolaridade.reprovado : false)
      form.elements['serieAnoReprovado'].value = aluno.escolaridade ? aluno.escolaridade.serieAnoReprovado : ''

      marcarRadio(form.elements['difFala'], aluno.escolaridade ? aluno.escolaridade.difFala : false)
      marcarRadio(form.elements['difAprendizagem'], aluno.escolaridade ? aluno.escolaridade.difAprendizagem : false)
      marcarRadio(form.elements['apoioPedagogico'], aluno.escolaridade ? aluno.escolaridade.apoioPedagogico : false)
      marcarRadio(form.elements['atividadeExtra'], aluno.escolaridade ? aluno.escolaridade.atividadeExtra : false)
      marcarRadio(form.elements['difLocomotiva'], aluno.escolaridade ? aluno.escolaridade.difLocomotiva : false)
      marcarRadio(form.elements['difVisao'], aluno.escolaridade ? aluno.escolaridade.difVisao : false)
      marcarRadio(form.elements['difAtencao'], aluno.escolaridade ? aluno.escolaridade.difAtencao : false)
      marcarRadio(form.elements['adaptacaoGrupo'], aluno.escolaridade ? aluno.escolaridade.adaptacaoGrupo : false)
      marcarRadio(form.elements['contatoFora'], aluno.escolaridade ? aluno.escolaridade.contatoFora : false)
      marcarRadio(form.elements['difEscrita'], aluno.escolaridade ? aluno.escolaridade.difEscrita : false)

      if (aluno.escolaridade && aluno.escolaridade.disciplinasFacilidade) {
        form.elements['disciplinasFacilidade'].value =
          aluno.escolaridade.disciplinasFacilidade.length > 0
            ? aluno.escolaridade.disciplinasFacilidade.join(', ')
            : ''
      } else {
        form.elements['disciplinasFacilidade'].value = ''
      }

      if (aluno.escolaridade && aluno.escolaridade.disciplinasDificuldade) {
        form.elements['disciplinasDificuldade'].value =
          aluno.escolaridade.disciplinasDificuldade.length > 0
            ? aluno.escolaridade.disciplinasDificuldade.join(', ')
            : ''
      } else {
        form.elements['disciplinasDificuldade'].value = ''
      }

      console.log('Aluno carregado:', aluno)
    } catch (error) {
      console.error('Erro:', error)
      alert('Não foi possível carregar os dados do aluno.')
    }
  }
})
