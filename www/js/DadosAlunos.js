function salvarDados() {
  const form = document.getElementById("formAluno");
  const dados = {};
  new FormData(form).forEach((value, key) => (dados[key] = value));
  console.log("Dados salvos:", dados);
  alert("Dados salvos com sucesso!");
}
