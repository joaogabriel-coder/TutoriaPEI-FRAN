document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault(); 

  const nome = document.getElementById("name");
  const cpf = document.getElementById("cpf");
  const cpfConfirm = document.getElementById("cpfConfirm");

  if (cpf.value !== cpfConfirm.value) {
    alert("Os CPFs não coincidem!");
    return;
  }

  fetch("http://192.168.15.76:8080/usuarios", {
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
