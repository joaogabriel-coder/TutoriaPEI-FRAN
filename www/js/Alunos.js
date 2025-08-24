const lista = document.getElementById("lista-alunos");
const addBtn = document.getElementById("add");

// Função para criar aluno dinamicamente
function criarAluno(nome) {
  const novoAluno = document.createElement("div");
  novoAluno.classList.add("aluno");

  novoAluno.innerHTML = `
    <a href="#"><img src="img/user (1).png" alt="User" class="user"></a>
    <input type="button" value="${nome}" class="entrar" onclick="location.href='Opcoes.html'">
    <a href="#"><img src="img/lapis.png" alt="Editar" class="pincel"></a>
    <a href="#" class="remover"><img src="img/lixeira.png" alt="Excluir" class="trash"></a>
  `;

  // evento do botão excluir
  novoAluno.querySelector(".remover").addEventListener("click", (e) => {
    e.preventDefault();
    novoAluno.remove();
  });

  // evento do lápis para editar nome
  novoAluno.querySelector(".pincel").addEventListener("click", (e) => {
    e.preventDefault();
    habilitarEdicao(novoAluno);
  });

  return novoAluno;
}

// Evento para adicionar novo aluno
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  lista.appendChild(criarAluno(`Nome do Aluno`));
});

// Ativa o botão de excluir do aluno inicial
document.querySelectorAll(".remover").forEach((botao) => {
  botao.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.closest(".aluno").remove();
  });
});

// Função para habilitar edição do nome
function habilitarEdicao(alunoDiv) {
  const nomeBtn = alunoDiv.querySelector("input.entrar");
  const lapis = alunoDiv.querySelector(".pincel");
  const nomeAtual = nomeBtn.value;

  // Cria input para edição
  const input = document.createElement("input");
  input.type = "text";
  input.value = nomeAtual;
  input.className = "edit-nome";

  nomeBtn.replaceWith(input);
  lapis.style.display = "none";

  // Evento para salvar ao pressionar Enter
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const novoNomeBtn = document.createElement("input");
      novoNomeBtn.type = "button";
      novoNomeBtn.value = input.value;
      novoNomeBtn.className = "entrar";
      novoNomeBtn.onclick = function () {
        location.href = "Opcoes.html";
      };
      input.replaceWith(novoNomeBtn);
      lapis.style.display = "";
      // Reativa edição ao clicar novamente
      lapis.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          habilitarEdicao(alunoDiv);
        },
        { once: true }
      );
    }
  });

  // Foca no input automaticamente
  input.focus();
}

// Ativa edição ao clicar no lápis (para alunos existentes)
document.querySelectorAll(".aluno").forEach((alunoDiv) => {
  const lapis = alunoDiv.querySelector(".pincel");
  lapis.addEventListener("click", function (e) {
    e.preventDefault();
    habilitarEdicao(alunoDiv);
  });
});
