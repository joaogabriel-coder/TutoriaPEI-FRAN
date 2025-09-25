
async function carregarAluno(ra) {
  try {
   
    const response = await fetch(`https://192.168.15.76:8443/alunos/${ra}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar aluno: " + response.status);
    }

    const aluno = await response.json();
    const form = document.getElementById("formAluno");

    // --- Dados básicos ---
    form.elements["nome"].value = aluno.nome || "";
    form.elements["serie"].value = `${aluno.serie || ""} - ${aluno.idade || ""} anos`;
    form.elements["nascimento"].value = formatarData(aluno.dataNasc);
    form.elements["endereco"].value = aluno.endereco || "";
    form.elements["telefone"].value = aluno.telefone || "";
    form.elements["email"].value = aluno.email || "";
    form.elements["transporte"].value = aluno.transporte || "";
    form.elements["projeto"].value = aluno.projetoVida || "";

    // --- Dados familiares ---
    if (aluno.dadoFamilia) {
      form.elements["pai"].value = aluno.dadoFamilia.pai || "";
      form.elements["mae"].value = aluno.dadoFamilia.mae || "";
      form.elements["responsavel"].value = aluno.dadoFamilia.responsavel || "";
      form.elements["contato"].value = aluno.dadoFamilia.numPai || "";
      form.elements["pais"].value = aluno.dadoFamilia.estruturaFamiliar || "";
    }

    // --- Escolaridade ---
    if (aluno.escolaridade) {
      marcarRadio(form.elements["reprovado"], aluno.escolaridade.reprovado);
      form.elements["serie_reprovado"].value = aluno.escolaridade.serieAnoReprovado || "";

      marcarRadio(form.elements["fala"], aluno.escolaridade.difFala || aluno.escolaridade.difEscrita);
      marcarRadio(form.elements["aprendizagem"], aluno.escolaridade.difAprendizagem);
      marcarRadio(form.elements["apoio"], aluno.escolaridade.apoioPedagogico);
      marcarRadio(form.elements["atividade"], aluno.escolaridade.atividadeExtra);
      marcarRadio(form.elements["locomocao"], aluno.escolaridade.difLocomotiva);
      marcarRadio(form.elements["visao"], aluno.escolaridade.difVisao);
      marcarRadio(form.elements["atencao"], aluno.escolaridade.difAtencao);
      marcarRadio(form.elements["adaptacao"], aluno.escolaridade.adaptacaoGrupo);
      marcarRadio(form.elements["colegas"], aluno.escolaridade.contatoFora);

      // Disciplinas
      form.elements["facilidade"].value = (aluno.escolaridade.disciplinasFacilidade || []).join(", ");
      form.elements["dificuldade"].value = (aluno.escolaridade.disciplinasDificuldade || []).join(", ");
    }

    console.log("Aluno carregado:", aluno); // debug no console
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os dados do aluno.");
  }
}

// --- Função auxiliar para marcar Sim/Não ---
function marcarRadio(radioNodeList, valor) {
  if (!radioNodeList) return;
  const value = valor ? "sim" : "nao";
  [...radioNodeList].forEach(r => {
    r.checked = (r.value === value);
  });
}

// --- Função auxiliar para formatar datas ---
function formatarData(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// --- Exemplo: carregar aluno RA 123456789 quando a página abrir ---
window.onload = () => {
  carregarAluno(123456789);
};
