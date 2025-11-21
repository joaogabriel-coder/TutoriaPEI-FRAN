function getRA() {
  const ra = localStorage.getItem("alunoId");
  if (!ra) {
    alert("Aluno não identificado. Faça login novamente.");
    location.href = "index.html";
    return null;
  }
  return ra;
}

function irInfoAdicional() {
  if (!getRA()) return;
  location.href = "infoAdd.html";
}

function irResultados(){
    if (!getRA()) return;
  location.href = "Resultados.html";
}

function irParticipacao(){
    if (!getRA()) return;
  location.href = "Participacao.html";
}

function irAtendimento(){
    if (!getRA()) return;
  location.href = "Atendimentos.html";
}

function irDadosAluno(){
    if (!getRA()) return;
  location.href = "DadosAlunos.html";
}

function irTutoria(){
    if (!getRA()) return;
  location.href = "Tutoria.html";
}

function irIndex() {
  if (!getRA()) return;
  location.href = "index.html";
}

function irAlunos() {
  if (!getRA()) return;
  location.href = "Alunos.html";
}


