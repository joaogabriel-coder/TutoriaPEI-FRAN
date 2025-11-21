const ra = localStorage.getItem("alunoId");

if (!ra) {
  alert("RA não encontrado. Retorne à tela de opções.");
  location.href = "Opcoes.html";
}

document.addEventListener("input", function (e) {
  if (e.target.tagName.toLowerCase() === "textarea") {
    e.target.style.height = "auto"; 
    e.target.style.height = e.target.scrollHeight + "px"; 
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add");
  const table = document.querySelector("table");

  // Função que ajusta altura automática do textarea
  window.autoResize = function (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Criar nova linha
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>
        <input class="data-input" type="text" placeholder="DD/MM"/>
      </td>
      <td style="text-align:center;">
        <label><input type="checkbox" /> A</label>
        <label><input type="checkbox" /> P</label>
      </td>
      <td>
        <textarea
          placeholder="Digite as observações..."
          oninput="autoResize(this)"
        ></textarea>
      </td>
    `;

    // Adiciona a nova linha no fim da tabela
    table.appendChild(newRow);
  });
});
