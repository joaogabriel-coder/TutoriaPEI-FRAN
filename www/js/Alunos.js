const lista = document.getElementById("lista-alunos");
const addBtn = document.getElementById("add");

let alunos = [];
document.addEventListener("DOMContentLoaded", async () => {
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Usuário não identificado! Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`http://192.168.1.108:8080/alunos/simple?usuarioId=${usuarioId}`);
    if (!res.ok) {
      const msg = await res.text();
      alert(msg || "Erro ao carregar alunos.");
      return;
    }

    const alunos = await res.json();
    console.log("Alunos do usuário:", alunos);
    // aqui você pode renderizar os alunos na tela

  } catch (error) {
    console.error("Erro de conexão:", error);
    alert("Não foi possível conectar ao servidor.");
  }
});
// =============================
// 1️⃣  Carregar alunos do backend
// =============================
async function carregarAlunos() {
  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Usuário não identificado!");
    return;
  }

  try {
    const res = await fetch(`http://192.168.1.108:8080/alunos/usuario/${usuarioId}`);
    if (!res.ok) throw new Error("Erro ao buscar alunos");
    const dados = await res.json();
    alunos = dados;
    lista.innerHTML = "";
    alunos.forEach(a => lista.appendChild(criarAluno(a.nome, a.ra)));
  } catch (err) {
    console.error("Falha ao carregar alunos:", err);
  }
}

// =============================
// 2️⃣  Função para criar aluno dinamicamente
// =============================
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
  novoAluno.querySelector(".remover").addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmar = confirm(`Tem certeza que deseja remover o aluno "${nome}"?`);
    if (confirmar) {
      // se quiser deletar no backend, descomente:
      // await fetch(`http://192.168.1.108:8080/alunos/${ra}`, { method: "DELETE" });
      novoAluno.remove();
      alunos = alunos.filter(a => a.ra !== ra);
      console.log(`Aluno "${nome}" removido.`);
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

// =============================
// 3️⃣  Adicionar novo aluno
// =============================
addBtn.addEventListener("click", (e) => {
  e.preventDefault();

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

  const btnSalvar = form.querySelector("#salvarAluno");
  const btnCancelar = form.querySelector("#cancelarAluno");

  btnSalvar.addEventListener("click", async function (e) {
    e.preventDefault();

    const nomeInput = form.querySelector("#inputNome");
    const raInput = form.querySelector("#inputRA");
    const nome = nomeInput.value.trim();
    const ra = raInput.value.trim();

    if (!nome || !ra) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      console.log("Enviando aluno para o backend...");
      const usuarioId = localStorage.getItem("usuarioId");
      const res = await fetch("http://192.168.1.108:8080/alunos/simple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      nome,
      ra,
      usuarioId
    })
  });

      if (res.ok) {
        alert("Aluno cadastrado com sucesso!");
        await carregarAlunos(); // atualiza lista
      } else {
        alert("Erro ao cadastrar aluno.");
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível conectar ao servidor");
    }

    form.remove();
  });

  btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    form.remove();
  });

  lista.appendChild(form);
});

// =============================
// 4️⃣  Edição do nome do aluno
// =============================
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

      const aluno = alunos.find(a => a.ra === ra);
      if (aluno) aluno.nome = novoNomeBtn.value;
    }
  });

  input.focus();
}

// =============================
// 5️⃣  Executa carregamento ao abrir página
// =============================
document.addEventListener("DOMContentLoaded", carregarAlunos);