document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault(); 

  const nome = document.getElementById("name");
  const cpf = document.getElementById("cpf");
  const cpfConfirm = document.getElementById("cpfConfirm");

  if (cpf.value !== cpfConfirm.value) {
    alert("Os CPFs não coincidem!");
    return;
  }
  console.log("Tentando conectar ao servidor...");
  fetch("https://172.100.125.200:8443/usuarios", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        cpf: cpf.value,
        nome: nome.value
      })
    })
    .then(res => {
      if (res.ok) {
        alert("Usuário cadastrado com sucesso!");
        // Limpa os campos
        nome.value = "";
        cpf.value = "";
        cpfConfirm.value = "";
      } else {
        alert("Erro ao cadastrar usuário");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Não foi possível conectar ao servidor");
    });
});
