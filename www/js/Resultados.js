function coletarResultados() {
    const form = document.querySelector("form");
    const formData = new FormData(form);
    const registros = {};

    formData.forEach((valor, chave) => {
        if (!valor.trim()) return;
        
        const [periodo, tipo, materia, tipoValor] = chave.split("_");

        const key = `${periodo}_${selecionarMateria(materia)}_${tipo === "app" ? "App" : tipo === "sim" ? "Simulado": "Tipo_Nao_Informado"}`;

        if (!registros[key]) {
            registros[key] = {
                materia: selecionarMateria(materia),
                tipo: tipo === "app" ? "App" : tipo === "sim" ? "Simulado": "Tipo Não Informado",
                numQuestoes: null,
                numAcertos: null,
                periodo: selecionarPeriodo(periodo)
            };
        }

        if (tipoValor === "qtd") {
            registros[key].numQuestoes = Number(valor);
        } else if (tipoValor === "acerto") {
            registros[key].numAcertos = Number(valor);
        }
    });

    console.log(registros)
    return registros
}

function selecionarPeriodo(periodo) {
    switch(periodo) {
        case "diag":
            return "Diagnostica"
            break;
        case "Bi1":
            return "1 Bimestre"
            break;
        case "Bi2":
            return "2 Bimestre"
            break;
        case "Bi3":
            return "3 Bimestre" 
            break;
        case "Bi4":
            return "4 Bimestre"
            break;
        default:
            return "Nao Possui"
            break;
    }
}

function selecionarMateria(materia) {
    switch(materia) {
        case "lp":
            return "Lingua Portuguesa"
            break;
        case "Lingua Portuguesa":
            return "lp"
            break;
        case "Matematica":
            return "mat"
            break;
        case "mat":
            return "Matematica"
            break;
        default:
            return "Todas"
            break;
    }
}

async function salvarResultado(event) {
    event.preventDefault(); 

    const ra = localStorage.getItem("alunoId");
    if (!ra) {
        alert("Erro: RA não encontrado no sistema.");
        return;
    }

    const registros = coletarResultados();
    const lista = Object.values(registros);
    console.log(lista)
    try {
        for (const registro of lista) {
            const resp = await fetch(`http://localhost:8080/alunos/${ra}/avaliacoes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registro) 
            });

            if (!resp.ok) {
                alert("Erro ao salvar um dos registros.");
                return;
            }
        }

        alert("Todos os resultados foram enviados com sucesso!");
    } catch (e) {
        console.error(e);
        alert("Falha ao conectar com o servidor.");
    }
}


async function carregarResultados() {
    const ra = localStorage.getItem("alunoId");
    if (!ra) return;

    try {
        const resp = await fetch(`http://localhost:8080/alunos/${ra}/avaliacoes`);
        if (!resp.ok) return;

        const avaliacoes = await resp.json();
        if (!Array.isArray(avaliacoes) || avaliacoes.length === 0) return;

        avaliacoes.forEach(av => {

            let periodoInput = "";
            switch (av.periodo) {
                case "Diagnostica": periodoInput = "diag"; break;
                case "1 Bimestre": periodoInput = "Bi1"; break;
                case "2 Bimestre": periodoInput = "Bi2"; break;
                case "3 Bimestre": periodoInput = "Bi3"; break;
                case "4 Bimestre": periodoInput = "Bi4"; break;
                default: return; 
            }

            let tipoInput = av.tipo.toLowerCase(); 

            let materiaInput = selecionarMateria(av.materia);

            if(av.tipo === "App") { 
                const nomeQtd = `${periodoInput}_${tipoInput}_${materiaInput}_qtd`;
                const nomeAcerto = `${periodoInput}_${tipoInput}_${materiaInput}_acerto`;
                const inputQtd = document.querySelector(`input[name="${nomeQtd}"]`);
                const inputAcerto = document.querySelector(`input[name="${nomeAcerto}"]`);
                if (inputQtd) inputQtd.value = av.numQuestoes;
                if (inputAcerto) inputAcerto.value = av.numAcertos;
            }

            if(av.tipo === "Simulado") { 
                const nomeQtd = `${periodoInput}_sim_a_qtd`;
                const nomeAcerto = `${periodoInput}_sim_a_acerto`;
                const inputQtd = document.querySelector(`input[name="${nomeQtd}"]`);
                const inputAcerto = document.querySelector(`input[name="${nomeAcerto}"]`);
                if (inputQtd) inputQtd.value = av.numQuestoes;
                if (inputAcerto) inputAcerto.value = av.numAcertos;
            }
            
        });

    } catch (e) {
        console.error("Erro ao carregar resultados:", e);
    }
}

document.addEventListener("DOMContentLoaded", carregarResultados);