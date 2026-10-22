/* ==========================================================================
   SixClub — Catálogo: filtros, busca, ordenação e favoritos
   Substitui as antigas 10 páginas estáticas duplicadas por uma única
   página que filtra o array PRODUTOS (js/data.js) no cliente.
   ========================================================================== */

const estadoCatalogo = {
  busca: "",
  categorias: new Set(),
  marcas: new Set(),
  precoMax: 1600,
  apenasFavoritos: false,
  ordenacao: "relevancia",
};

document.addEventListener("DOMContentLoaded", () => {
  lerParametrosDaUrl();
  montarFiltrosDinamicos();
  ligarEventosDeFiltro();
  ativarEventosDosCards(document.querySelector(".catalogo__grid"));
  renderizarCatalogo();

  document.addEventListener("favoritos:alterado", () => {
    if (estadoCatalogo.apenasFavoritos) renderizarCatalogo();
  });
});

function lerParametrosDaUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("categoria")) estadoCatalogo.categorias.add(params.get("categoria"));
  if (params.get("busca")) {
    estadoCatalogo.busca = params.get("busca");
    document.getElementById("busca-header").value = estadoCatalogo.busca;
  }
  if (params.get("favoritos")) estadoCatalogo.apenasFavoritos = true;
}

/** Preenche os checkboxes de marca e categoria de acordo com o estado inicial (vindo da URL). */
function montarFiltrosDinamicos() {
  document.querySelectorAll("[data-filtro-categoria]").forEach((input) => {
    if (estadoCatalogo.categorias.has(input.value)) input.checked = true;
  });
  if (estadoCatalogo.apenasFavoritos) {
    document.getElementById("filtro-favoritos").checked = true;
  }
}

function ligarEventosDeFiltro() {
  document.querySelectorAll("[data-filtro-categoria]").forEach((input) => {
    input.addEventListener("change", () => {
      input.checked ? estadoCatalogo.categorias.add(input.value) : estadoCatalogo.categorias.delete(input.value);
      renderizarCatalogo();
    });
  });

  document.querySelectorAll("[data-filtro-marca]").forEach((input) => {
    input.addEventListener("change", () => {
      input.checked ? estadoCatalogo.marcas.add(input.value) : estadoCatalogo.marcas.delete(input.value);
      renderizarCatalogo();
    });
  });

  const precoInput = document.getElementById("filtro-preco");
  const precoValorEl = document.querySelector(".js-preco-valor");
  precoInput.addEventListener("input", () => {
    estadoCatalogo.precoMax = Number(precoInput.value);
    precoValorEl.textContent = formatarPreco(estadoCatalogo.precoMax);
    renderizarCatalogo();
  });
  precoValorEl.textContent = formatarPreco(estadoCatalogo.precoMax);

  document.getElementById("filtro-favoritos").addEventListener("change", (e) => {
    estadoCatalogo.apenasFavoritos = e.target.checked;
    renderizarCatalogo();
  });

  document.getElementById("ordenacao").addEventListener("change", (e) => {
    estadoCatalogo.ordenacao = e.target.value;
    renderizarCatalogo();
  });

  document.querySelector(".filtros__limpar").addEventListener("click", (e) => {
    e.preventDefault();
    limparFiltros();
  });

  const filtrosToggle = document.querySelector(".filtros-toggle");
  const filtros = document.querySelector(".filtros");
  const overlay = document.querySelector(".overlay");
  filtrosToggle?.addEventListener("click", () => {
    filtros.classList.add("is-open");
    overlay.classList.add("is-active");
  });
  overlay?.addEventListener("click", () => {
    filtros.classList.remove("is-open");
    overlay.classList.remove("is-active");
  });
}

function limparFiltros() {
  estadoCatalogo.categorias.clear();
  estadoCatalogo.marcas.clear();
  estadoCatalogo.precoMax = 1600;
  estadoCatalogo.apenasFavoritos = false;
  estadoCatalogo.busca = "";
  document.getElementById("busca-header").value = "";
  document.querySelectorAll("[data-filtro-categoria], [data-filtro-marca], #filtro-favoritos").forEach((i) => (i.checked = false));
  document.getElementById("filtro-preco").value = 1600;
  document.querySelector(".js-preco-valor").textContent = formatarPreco(1600);
  renderizarCatalogo();
}

/** Chamada pelo header.js quando a busca é enviada estando já na página de catálogo. */
function aplicarBuscaExterna(termo) {
  estadoCatalogo.busca = termo;
  renderizarCatalogo();
}

function filtrarProdutos() {
  const termo = estadoCatalogo.busca.trim().toLowerCase();

  let resultado = PRODUTOS.filter((produto) => {
    const combinaBusca =
      !termo ||
      produto.nome.toLowerCase().includes(termo) ||
      MARCAS[produto.marca].nome.toLowerCase().includes(termo);

    const combinaCategoria = estadoCatalogo.categorias.size === 0 || estadoCatalogo.categorias.has(produto.categoria);
    const combinaMarca = estadoCatalogo.marcas.size === 0 || estadoCatalogo.marcas.has(produto.marca);
    const combinaPreco = produto.preco <= estadoCatalogo.precoMax;
    const combinaFavorito = !estadoCatalogo.apenasFavoritos || Favoritos.eFavorito(produto.id);

    return combinaBusca && combinaCategoria && combinaMarca && combinaPreco && combinaFavorito;
  });

  switch (estadoCatalogo.ordenacao) {
    case "preco-asc":
      resultado.sort((a, b) => a.preco - b.preco);
      break;
    case "preco-desc":
      resultado.sort((a, b) => b.preco - a.preco);
      break;
    case "nome-asc":
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
      break;
    default:
      break; // "relevancia" mantém a ordem original do catálogo
  }

  return resultado;
}

function renderizarCatalogo() {
  const grid = document.querySelector(".catalogo__grid");
  const resultadoEl = document.querySelector(".catalogo__resultado");
  const produtos = filtrarProdutos();

  resultadoEl.textContent = `${produtos.length} produto${produtos.length === 1 ? "" : "s"} encontrado${produtos.length === 1 ? "" : "s"}`;

  if (produtos.length === 0) {
    grid.innerHTML = `
      <div class="catalogo__vazio">
        <i class="bx bx-search-alt"></i>
        <p>Nenhum produto encontrado com esses filtros.</p>
      </div>`;
    return;
  }

  grid.innerHTML = produtos.map(criarCardProdutoHTML).join("");
}
