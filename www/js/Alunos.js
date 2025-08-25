const lista = document.getElementById("lista-alunos");
const addBtn = document.getElementById("add");

// Função para criar aluno dinamicamente
function criarAluno(nome) {
  const novoAluno = document.createElement("div");
  novoAluno.classList.add("aluno");

  novoAluno.innerHTML = `
    <a href="#" class="user-wrapper">
      <img src="img/user (1).png" alt="User" class="user">
    </a>
    <input type="file" accept="image/*" class="upload" hidden>
    <input type="button" value="${nome}" class="entrar" onclick="location.href='Opcoes.html'">
    <a href="#"><img src="img/lapis.png" alt="Editar" class="pincel"></a>
    <a href="#" class="remover"><img src="img/lixeira.png" alt="Excluir" class="trash"></a>
  `;

  // botão excluir
  novoAluno.querySelector(".remover").addEventListener("click", (e) => {
    e.preventDefault();
    novoAluno.remove();
  });

  // clique no ícone de usuário abre input de arquivo
  const userIcon = novoAluno.querySelector(".user-wrapper");
  const fileInput = novoAluno.querySelector(".upload");
  const img = novoAluno.querySelector(".user");

  userIcon.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });

  // quando escolher arquivo, mostra foto
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result; // troca o ícone pela foto escolhida
      };
      reader.readAsDataURL(file);
    }
  });

  // evento do lápis para editar nome
  const lapis = novoAluno.querySelector(".pincel");
  lapis.addEventListener("click", (e) => {
    e.preventDefault();
    habilitarEdicao(novoAluno);
  });

  return novoAluno;
}

// Evento para adicionar novo aluno
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  lista.appendChild(criarAluno("Nome do Aluno"));
});

// Configura o aluno inicial do HTML
document.querySelectorAll(".aluno").forEach((alunoDiv) => {
  const remover = alunoDiv.querySelector(".remover");
  if (remover) {
    remover.addEventListener("click", (e) => {
      e.preventDefault();
      alunoDiv.remove();
    });
  }

  const userIcon = alunoDiv.querySelector(".user-wrapper");
  const fileInput = alunoDiv.querySelector(".upload");
  const img = alunoDiv.querySelector(".user");

  if (userIcon && fileInput) {
    userIcon.addEventListener("click", (e) => {
      e.preventDefault();
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const lapis = alunoDiv.querySelector(".pincel");
  if (lapis) {
    lapis.addEventListener("click", (e) => {
      e.preventDefault();
      habilitarEdicao(alunoDiv);
    });
  }
});

// Função para habilitar edição do nome
function habilitarEdicao(alunoDiv) {
  const nomeBtn = alunoDiv.querySelector("input.entrar");
  const lapis = alunoDiv.querySelector(".pincel");
  const nomeAtual = nomeBtn.value;

  const input = document.createElement("input");
  input.type = "text";
  input.value = nomeAtual;
  input.className = "edit-nome";

  nomeBtn.replaceWith(input);
  lapis.style.display = "none";

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
    }
  });

  input.focus();
}
