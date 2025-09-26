const lista = document.getElementById("lista-alunos");
const addBtn = document.getElementById("add");

// Array global para guardar os alunos
let alunos = [];

// Função para criar aluno dinamicamente
function criarAluno(nome, ra) {
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
  const confirmar = confirm(`Tem certeza que deseja remover o aluno "${nome}"?`);
  if (confirmar) {
    novoAluno.remove();
    alunos = alunos.filter(a => a.ra !== ra); // remove também do array
    console.log(`Aluno "${nome}" removido com sucesso!`);
  }
});


  // clique no ícone de usuário abre input de arquivo
  const userIcon = novoAluno.querySelector(".user-wrapper");
  const fileInput = novoAluno.querySelector(".upload");
  const img = novoAluno.querySelector(".user");

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

  // evento do lápis para editar nome
  const lapis = novoAluno.querySelector(".pincel");
  lapis.addEventListener("click", (e) => {
    e.preventDefault();
    habilitarEdicao(novoAluno, ra);
  });

  return novoAluno;
}

// Evento para adicionar novo aluno
addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // cria um mini formulário
  const form = document.createElement("div");
  form.classList.add("form-aluno");
  form.innerHTML = `
  <input type="text" placeholder="Nome do Aluno" id="inputNome">
  <input type="text" placeholder="RA do Aluno" id="inputRA">
  <div style="display:flex; gap:10px; justify-content:center; width:100%;">
    <button id="salvarAluno" class="btn btn-salvar">Salvar</button>
    <button id="cancelarAluno" class="btn btn-cancelar">Cancelar</button>
  </div>
`;

  lista.appendChild(form);

  form.querySelector("#salvarAluno").addEventListener("click", () => {
    const nome = form.querySelector("#inputNome").value.trim();
    const ra = form.querySelector("#inputRA").value.trim();

    if (nome && ra) {
      alunos.push({ nome, ra }); // salva no array
      lista.appendChild(criarAluno(nome, ra));
      form.remove();
      console.log("Alunos cadastrados:", alunos);
    } else {
      alert("Preencha todos os campos!");
    }
  });

  form.querySelector("#cancelarAluno").addEventListener("click", () => {
    form.remove();
  });
});

// Função para habilitar edição do nome
function habilitarEdicao(alunoDiv, ra) {
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

      // atualiza no array global
      const aluno = alunos.find(a => a.ra === ra);
      if (aluno) aluno.nome = novoNomeBtn.value;
    }
  });

  input.focus();
}


