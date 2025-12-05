document.addEventListener("DOMContentLoaded", () => {
    let countNum = 1;
  document.addEventListener("input", function (e) {
    if (e.target.tagName.toLowerCase() === "textarea") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  window.autoResize = function (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const addBtn = document.getElementById("add");
  const table = document.querySelector("table");

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>
        <input class="data-input" type="text" name="data${countNum}" placeholder="DD/MM/AAAA"/>
      </td>

      <td>
        <div class="assuntos">
          <label><input type="checkbox" name="tarefaCMSP${countNum}"/> Tarefa CMSP</label>
          <label><input type="checkbox" name="leitura${countNum}"/> Leitura</label>
          <label><input type="checkbox" name="redacao${countNum}"/> Redação</label>
          <label><input type="checkbox" name="provaPaulista${countNum}"/> Prova Paulista</label>
          <label><input type="checkbox" name="avaliacoes${countNum}"/> Avaliações</label>
          <label><input type="checkbox" name="dificuldades${countNum}"/> Dificuldades</label>
          <label><input type="checkbox" name="outros${countNum}"/> Outros</label>
        </div>
      </td>

      <td>
        <textarea
          placeholder="Digite aqui as orientações do tutor..."
          oninput="autoResize(this)"
          name="observacoesProfessor${countNum}"
        ></textarea>
      </td>
    `;

    table.appendChild(newRow);
    countNum++;
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const ra = localStorage.getItem("alunoId");
  const addBtn = document.getElementById("add");
  const table = document.querySelector("table");
  let countNum = 1;

  if (!ra) {
    alert("RA não encontrado.");
    location.href = "Opcoes.html";
    return;
  }

  document.addEventListener("input", function (e) {
    if (e.target.tagName.toLowerCase() === "textarea") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  window.autoResize = function (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  async function carregarResultados() {
    try {
      const resp = await fetch(`http://localhost:8080/alunos/${ra}/tutoria`);
      if (!resp.ok) return;

      const registros = await resp.json();

      if (!Array.isArray(registros) || registros.length === 0) {
        adicionarLinhaVazia();
        return;
      }

      console.log(registros)

      registros.forEach(t => {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
          <td>
            <input class="data-input" 
                   type="text" 
                   name="data${countNum}" 
                   value="${formatarData(t.data)}"
                   data-id="${t.id}"
            />
          </td>

          <td>
            <div class="assuntos">
              <label><input type="checkbox" name="tarefaCMSP${countNum}" data-id="${t.id}" ${t.tarefaCMSP ? "checked" : ""} /> Tarefa CMSP</label>
              <label><input type="checkbox" name="leitura${countNum}" data-id="${t.id}" ${t.leitura ? "checked" : ""} /> Leitura</label>
              <label><input type="checkbox" name="redacao${countNum}" data-id="${t.id}" ${t.redacao ? "checked" : ""}  /> Redação</label>
              <label><input type="checkbox" name="provaPaulista${countNum}" data-id="${t.id}" ${t.provaPaulista ? "checked" : ""} /> Prova Paulista</label>
              <label><input type="checkbox" name="avaliacoes${countNum}" data-id="${t.id}" ${t.avaliacoes ? "checked" : ""} /> Avaliações</label>
              <label><input type="checkbox" name="dificuldades${countNum}" data-id="${t.id}" ${t.dificuldades ? "checked" : ""}  /> Dificuldades</label>
              <label><input type="checkbox" name="outros${countNum}" data-id="${t.id}" ${t.outros ? "checked" : ""} /> Outros</label>
            </div>
          </td>

          <td>
            <textarea
              name="observacoesProfessor${countNum}"
              data-id="${t.id}"
              oninput="autoResize(this)"
            >${t.observacoesProfessor || ""}</textarea>
          </td>
        `;

        table.appendChild(newRow);
        countNum++;
      });

    } catch (e) {
      console.error("Erro ao carregar resultados:", e);
    }
  }

  carregarResultados();

  function adicionarLinhaVazia() {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>
        <input class="data-input" type="text" name="data${countNum}" placeholder="DD/MM/AAAA"/>
      </td>

      <td>
        <div class="assuntos">
          <label><input type="checkbox" name="tarefaCMSP${countNum}"/> Tarefa CMSP</label>
          <label><input type="checkbox" name="leitura${countNum}"/> Leitura</label>
          <label><input type="checkbox" name="redacao${countNum}"/> Redação</label>
          <label><input type="checkbox" name="provaPaulista${countNum}"/> Prova Paulista</label>
          <label><input type="checkbox" name="avaliacoes${countNum}"/> Avaliações</label>
          <label><input type="checkbox" name="dificuldades${countNum}"/> Dificuldades</label>
          <label><input type="checkbox" name="outros${countNum}"/> Outros</label>
        </div>
      </td>

      <td>
        <textarea
          name="observacoesProfessor${countNum}"
          placeholder="Digite as orientações do tutor..."
          oninput="autoResize(this)"
        ></textarea>
      </td>
    `;

    table.appendChild(newRow);
    countNum++;
  }

  addBtn.addEventListener("click", e => {
    e.preventDefault();
    adicionarLinhaVazia();
  });

  function coletarResultados() {
  const registros = [];
  const linhas = document.querySelectorAll("table tr");

  linhas.forEach(linha => {
    const inputData = linha.querySelector("input[type='text']");
    const textarea = linha.querySelector("textarea");

    if (!inputData) return;

    const id = inputData.dataset.id || null;

    const registro = {
      id: id,
      data: formatarData(inputData.value),
      tarefaCMSP: linha.querySelector(`input[name^="tarefaCMSP"]`)?.checked || false,
      leitura: linha.querySelector(`input[name^="leitura"]`)?.checked || false,
      redacao: linha.querySelector(`input[name^="redacao"]`)?.checked || false,
      provaPaulista: linha.querySelector(`input[name^="provaPaulista"]`)?.checked || false,
      avaliacoes: linha.querySelector(`input[name^="avaliacoes"]`)?.checked || false,
      dificuldades: linha.querySelector(`input[name^="dificuldades"]`)?.checked || false,
      outros: linha.querySelector(`input[name^="outros"]`)?.checked || false,
      observacoesProfessor: textarea ? textarea.value : "",
    };

    registros.push(registro);
  });

  console.log("REGISTROS COLETADOS:", registros);
  return registros;
}

  async function salvarResultado(arrData) {
    try {
      for (const reg of arrData) {
        const urlBase = `http://localhost:8080/alunos/${ra}/tutoria`;

        const url = reg.id ? `${urlBase}/${reg.id}` : urlBase;
        const method = reg.id ? "PUT" : "POST";

        const resp = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reg)
        });

        if (!resp.ok) {
          alert("Erro ao salvar um dos registros!");
          return;
        }
      }

      alert("Registros salvos com sucesso!");
      location.reload();

    } catch (e) {
      console.error("Erro:", e);
      alert("Falha ao conectar com o servidor.");
    }
  }

  document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    const data = coletarResultados();
    salvarResultado(Object.values(data));
  });
});

function formatarData(data) {
  if (!data) return "";

  if (data.includes("/")) {
    const [dd, mm, yyyy] = data.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }

  const [yyyy, mm, dd] = data.split("-");
  return `${dd}/${mm}/${yyyy}`;
}
