document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const cpf = document.getElementById("cpf").value.trim();

  if (!cpf) {
    alert("Por favor, digite o CPF.");
    return;
  }

  try {
    const res = await fetch("http://192.168.1.108:8080/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, cpf })
    });

    if (!res.ok) {
      const msg = await res.text();
      alert(msg || "CPF incorreto ou usuário não encontrado!");
      return;
    }

    const data = await res.json(); // ✅ data é o usuário retornado
    localStorage.setItem("usuarioId", data.id); // ✅ corrigido aqui
    localStorage.setItem("usuario", JSON.stringify(data));
    alert(`Bem-vindo, ${data.nome}!`);
    
    window.location.href = "Alunos.html";
  } catch (err) {
    console.error("Erro de conexão:", err);
    alert("Não foi possível conectar ao servidor.");
  }
});