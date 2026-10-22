/* ==========================================================================
   SixClub — Cabeçalho, menu mobile, busca e drawer do carrinho
   Compartilhado por todas as páginas do site.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  inicializarMenuMobile();
  inicializarBusca();
  inicializarCarrinhoDrawer();
  atualizarBadgeCarrinho();

  document.addEventListener("carrinho:alterado", () => {
    atualizarBadgeCarrinho();
    renderizarCarrinhoDrawer();
  });
});

/* ---------------- Menu mobile ---------------- */
function inicializarMenuMobile() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const aberto = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.innerHTML = aberto ? '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>';
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<i class="bx bx-menu"></i>';
    });
  });
}

/* ---------------- Busca ---------------- */
function inicializarBusca() {
  const form = document.querySelector(".site-header__search");
  if (!form) return;
  const input = form.querySelector("input");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const termo = input.value.trim();

    if (window.location.pathname.endsWith("produtos.html") && typeof aplicarBuscaExterna === "function") {
      aplicarBuscaExterna(termo);
    } else {
      const destino = termo ? `produtos.html?busca=${encodeURIComponent(termo)}` : "produtos.html";
      window.location.href = destino;
    }
  });
}

/* ---------------- Carrinho (drawer) ---------------- */
function inicializarCarrinhoDrawer() {
  const abrirBtns = document.querySelectorAll("[data-abrir-carrinho]");
  const drawer = document.querySelector(".cart-drawer");
  const overlay = document.querySelector(".overlay");
  const fechar = document.querySelector(".cart-drawer__close");

  if (!drawer || !overlay) return;

  const abrir = () => {
    renderizarCarrinhoDrawer();
    drawer.classList.add("is-open");
    overlay.classList.add("is-active");
    drawer.setAttribute("aria-hidden", "false");
  };

  const fecharDrawer = () => {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-active");
    drawer.setAttribute("aria-hidden", "true");
  };

  abrirBtns.forEach((btn) => btn.addEventListener("click", (e) => { e.preventDefault(); abrir(); }));
  fechar?.addEventListener("click", fecharDrawer);
  overlay.addEventListener("click", fecharDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharDrawer();
  });

  renderizarCarrinhoDrawer();

  // Delegação de eventos para os botões dentro do carrinho (itens são recriados a cada render)
  drawer.addEventListener("click", (evento) => {
    const item = evento.target.closest("[data-produto-id]");
    if (!item) return;
    const produtoId = item.dataset.produtoId;

    if (evento.target.closest(".js-qtd-mais")) {
      const atual = Carrinho.obterItens().find((i) => i.produtoId === produtoId);
      Carrinho.atualizarQuantidade(produtoId, (atual?.quantidade || 0) + 1);
    } else if (evento.target.closest(".js-qtd-menos")) {
      const atual = Carrinho.obterItens().find((i) => i.produtoId === produtoId);
      Carrinho.atualizarQuantidade(produtoId, (atual?.quantidade || 0) - 1);
    } else if (evento.target.closest(".js-remover-item")) {
      Carrinho.remover(produtoId);
      mostrarToast("Produto removido do carrinho.", "info");
    }
  });

  const finalizarBtn = drawer.querySelector(".js-finalizar-compra");
  finalizarBtn?.addEventListener("click", () => {
    if (Carrinho.obterItens().length === 0) return;
    Carrinho.esvaziar();
    fecharDrawer();
    mostrarToast("Pedido realizado com sucesso! Obrigado pela compra.", "success");
  });
}

function renderizarCarrinhoDrawer() {
  const lista = document.querySelector(".cart-drawer__items");
  const totalEl = document.querySelector(".js-carrinho-total");
  const footer = document.querySelector(".cart-drawer__footer");
  if (!lista) return;

  const itens = Carrinho.obterItens();

  if (itens.length === 0) {
    lista.innerHTML = `
      <div class="cart-drawer__empty">
        <i class="bx bx-cart"></i>
        <p>Seu carrinho está vazio.</p>
      </div>`;
    if (footer) footer.style.display = "none";
    return;
  }

  if (footer) footer.style.display = "block";

  let total = 0;
  lista.innerHTML = itens
    .map((item) => {
      const produto = obterProdutoPorId(item.produtoId);
      if (!produto) return "";
      const subtotal = produto.preco * item.quantidade;
      total += subtotal;
      return `
        <div class="cart-item" data-produto-id="${produto.id}">
          <img src="${produto.imagem}" alt="${produto.nome}">
          <div>
            <p class="cart-item__brand">${MARCAS[produto.marca].nome}</p>
            <p class="cart-item__name">${produto.nome}</p>
            <p class="cart-item__price">${formatarPreco(subtotal)}</p>
            <div class="qty-control">
              <button type="button" class="js-qtd-menos" aria-label="Diminuir quantidade">−</button>
              <span>${item.quantidade}</span>
              <button type="button" class="js-qtd-mais" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <button type="button" class="cart-item__remove js-remover-item" aria-label="Remover ${produto.nome} do carrinho">
            <i class="bx bx-trash"></i>
          </button>
        </div>`;
    })
    .join("");

  if (totalEl) totalEl.textContent = formatarPreco(total);
}

function atualizarBadgeCarrinho() {
  document.querySelectorAll(".js-badge-carrinho").forEach((badge) => {
    const total = Carrinho.totalItens();
    badge.textContent = total;
    badge.style.display = total > 0 ? "flex" : "none";
  });
}

/** Adiciona um produto ao carrinho e dá feedback visual — usado nas páginas de produtos. */
function adicionarAoCarrinho(produto) {
  Carrinho.adicionar(produto, 1);
  mostrarToast(`${produto.nome} adicionado ao carrinho!`, "success");
}
