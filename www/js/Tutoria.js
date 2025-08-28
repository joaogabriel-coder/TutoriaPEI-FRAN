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
        <input class="data-input" type="text" />
      </td>
      <td>
        <div class="assuntos">
          <label><input type="checkbox" /> Tarefa CMSP</label>
          <label><input type="checkbox" /> Leitura</label>
          <label><input type="checkbox" /> Redação</label>
          <label><input type="checkbox" /> Prova Paulista</label>
          <label><input type="checkbox" /> Avaliações</label>
          <label><input type="checkbox" /> Dificuldades</label>
          <label><input type="checkbox" /> Outros</label>
        </div>
      </td>
      <td>
        <textarea
          placeholder="Digite aqui as orientações do tutor..."
          oninput="autoResize(this)"
        ></textarea>
      </td>
    `;

    // Adiciona a nova linha no fim da tabela
    table.appendChild(newRow);
  });
});
