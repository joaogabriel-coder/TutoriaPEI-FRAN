 document.getElementById("registerForm").addEventListener("submit", async function (e) {
      e.preventDefault(); // impede recarregar a página

      const nome = document.getElementById("name").value;
      const cpf = document.getElementById("cpf").value;
      const cpfConfirm = document.getElementById("cpfConfirm").value;

      if (cpf !== cpfConfirm) {
        alert("Os CPFs não coincidem!");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ nome: nome, cpf: cpf })
        });

        if (response.ok) {
          alert("Usuário registrado com sucesso!");
          window.location.href = "Alunos.html"; // redireciona para página de alunos
        } else {
          alert("Erro ao registrar usuário.");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível conectar ao servidor.");
      }
    });