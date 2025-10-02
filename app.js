let total = 0;

// Referências aos elementos
const listaDeCompras = document.getElementById("lista-de-compras");
const valorTotal = document.getElementById("valor-total");
const nomeItemInput = document.getElementById("nome-item");
const botaoAdicionar = document.getElementById("adicionar-item");
const botaoFinalizar = document.getElementById("finalizar-compra");
const historicoCompras = document.getElementById("historico-compras");
const btnLimparHistorico = document.getElementById("limpar-historico");
const btnTema = document.querySelector(".btnTema");

// ------------------- Funções ------------------- //

// Atualiza o valor total
function atualizarTotal() {
  total = 0;
  const itens = document.querySelectorAll("#lista-de-compras li");

  itens.forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      const preco = parseFloat(item.querySelector(".preco").value) || 0;
      const quantidade = parseInt(item.querySelector(".quantidade").value) || 0;
      total += preco * quantidade;
    }
  });

  valorTotal.innerText = total.toFixed(2);
  salvarProgresso(); // salva progresso sempre que atualiza
}

// Ordena a lista alfabeticamente
function ordenarListaAlfabeticamente() {
  const itens = Array.from(listaDeCompras.querySelectorAll("li"));

  itens.sort((a, b) => {
    const nomeA = a.querySelector(".item-nome").textContent.trim().toLowerCase();
    const nomeB = b.querySelector(".item-nome").textContent.trim().toLowerCase();
    return nomeA.localeCompare(nomeB);
  });

  listaDeCompras.innerHTML = "";
  itens.forEach((item) => listaDeCompras.appendChild(item));
}

// Adiciona item à lista
function adicionarItem(nome, precoValue = "", quantidadeValue = "", marcado = false) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = marcado;
  checkbox.addEventListener("change", atualizarTotal);

  const precoInput = `<span>R$ <input type="number" class="preco text-input" step="0.01" placeholder="" value="${precoValue}" disabled></span>`;
  const quantidadeInput = `<span>Qtd: <input type="number" class="quantidade text-input" placeholder="" value="${quantidadeValue}" disabled></span>`;

  li.innerHTML = `
      <span class="item-nome">${nome}</span>
      ${precoInput} 
      ${quantidadeInput} 
      <div class="botoes-item">
        <button class="editar-item btn-editar-item">Editar</button>
        <button class="excluir-item btn-excluir-item">Excluir</button>
      </div>
    `;
  li.prepend(checkbox);

  const precoInputElement = li.querySelector(".preco");
  const quantidadeInputElement = li.querySelector(".quantidade");
  const btnEditar = li.querySelector(".editar-item");
  const btnExcluir = li.querySelector(".excluir-item");

  precoInputElement.addEventListener("input", atualizarTotal);
  quantidadeInputElement.addEventListener("input", atualizarTotal);

  // Botão editar/salvar
  btnEditar.addEventListener("click", () => {
    const isDisabled = precoInputElement.disabled;
    precoInputElement.disabled = !isDisabled;
    quantidadeInputElement.disabled = !isDisabled;

    if (isDisabled) {
      btnEditar.textContent = "Salvar";
      btnEditar.classList.remove("btn-editar-item");
      btnEditar.classList.add("btn-salvar");
    } else {
      btnEditar.textContent = "Editar";
      btnEditar.classList.remove("btn-salvar");
      btnEditar.classList.add("btn-editar-item");
      atualizarTotal();
    }
  });

  // Botão excluir
  btnExcluir.addEventListener("click", () => {
    if (checkbox.checked) {
      const preco = parseFloat(precoInputElement.value) || 0;
      const quantidade = parseInt(quantidadeInputElement.value) || 1;
      total -= preco * quantidade;
      valorTotal.innerText = total.toFixed(2);
    }
    li.remove();
    salvarProgresso();
  });

  listaDeCompras.appendChild(li);
  ordenarListaAlfabeticamente();
  salvarProgresso();
}

// Salva o progresso da lista
function salvarProgresso() {
  const itens = [];
  document.querySelectorAll("#lista-de-compras li").forEach((item) => {
    itens.push({
      nome: item.querySelector(".item-nome").textContent,
      preco: item.querySelector(".preco").value,
      quantidade: item.querySelector(".quantidade").value,
      marcado: item.querySelector('input[type="checkbox"]').checked,
    });
  });
  localStorage.setItem("progressoCompras", JSON.stringify(itens));
}

// Carrega o progresso salvo
function carregarProgresso() {
  const progresso = JSON.parse(localStorage.getItem("progressoCompras")) || [];
  progresso.forEach((p) => {
    adicionarItem(p.nome, p.preco, p.quantidade, p.marcado);
  });
  atualizarTotal();
}

// Finalizar compra
botaoFinalizar.addEventListener("click", () => {
  const itens = document.querySelectorAll(
    '#lista-de-compras li input[type="checkbox"]:checked'
  );

  if (itens.length > 0 && total > 0) {
    const date = new Date();
    const dataAtual = date.toLocaleDateString("pt-BR");

    const comprasAnteriores = JSON.parse(localStorage.getItem("historicoCompras")) || [];
    comprasAnteriores.push({ data: dataAtual, valor: total });
    localStorage.setItem("historicoCompras", JSON.stringify(comprasAnteriores));

    listaDeCompras.innerHTML = "";
    localStorage.removeItem("progressoCompras");

    mostrarHistoricoCompras();
    alert("Compra finalizada e salva no histórico!");
  } else {
    total = 0;
    valorTotal.innerText = total.toFixed(2);
    alert("Nenhum item na lista! Inicie uma nova compra.");
  }
});

// Mostrar histórico
function mostrarHistoricoCompras() {
  const comprasAnteriores = JSON.parse(localStorage.getItem("historicoCompras")) || [];
  historicoCompras.innerHTML = "";

  comprasAnteriores.forEach((compra) => {
    if (compra.valor !== undefined && !isNaN(compra.valor)) {
      const li = document.createElement("li");
      li.textContent = `${compra.data}: R$ ${parseFloat(compra.valor).toFixed(2)}`;
      historicoCompras.appendChild(li);
    }
  });
}

// Limpar histórico
btnLimparHistorico.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja limpar todo o histórico de compras?")) {
    localStorage.removeItem("historicoCompras");
    mostrarHistoricoCompras();
    alert("Histórico de compras limpo!");
  }
});

// Atualiza ano no footer
function atualizarAno() {
  const anoAtual = new Date().getFullYear();
  document.getElementById("anoAtual").textContent = anoAtual;
}

// ------------------- Tema claro/escuro ------------------- //

function toggleTema() {
  const body = document.body;

  if (body.classList.contains("light-theme")) {
    body.classList.replace("light-theme", "dark-theme");
    btnTema.textContent = "Tema claro";
    setThemeColor("#121212");
    localStorage.setItem("tema", "dark");
  } else {
    body.classList.replace("dark-theme", "light-theme");
    btnTema.textContent = "Tema escuro";
    setThemeColor("#ffffff");
    localStorage.setItem("tema", "light");
  }
}

function setThemeColor(color) {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", color);
  }
}

// ------------------- Eventos ------------------- //

botaoAdicionar.addEventListener("click", () => {
  const nome = nomeItemInput.value;
  if (nome) {
    adicionarItem(nome);
    nomeItemInput.value = "";
  } else {
    alert("O nome do item é obrigatório!");
  }
});

btnTema.addEventListener("click", toggleTema);

document.addEventListener("DOMContentLoaded", () => {
  atualizarAno();
  mostrarHistoricoCompras();
  carregarProgresso();

  // Aplica tema salvo ou padrão
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "dark") {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    btnTema.textContent = "Tema claro";
    setThemeColor("#121212");
  } else {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    btnTema.textContent = "Tema escuro";
    setThemeColor("#ffffff");
  }

  // Service Worker (PWA)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => console.log("Service Worker registrado!"))
      .catch((err) => console.log("Erro no SW:", err));
  }
});

// Aviso antes de sair/recarregar
window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue = "";
});
