/* ==========================================================================
   SixClub — Utilitários compartilhados
   ========================================================================== */

/** Formata um número para moeda brasileira (R$ 1.234,56). */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Atraso a execução de uma função até que os eventos parem de disparar (usado na busca). */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Gera um id simples e único, usado para itens do carrinho. */
function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Exibe uma notificação (toast) de sucesso, erro ou informação.
 * Cria o container automaticamente caso ainda não exista na página.
 */
function mostrarToast(mensagem, tipo = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  const icones = {
    success: "bx bx-check-circle",
    error: "bx bx-error-circle",
    info: "bx bx-info-circle",
  };

  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.innerHTML = `<i class="${icones[tipo] || icones.info}"></i><span>${mensagem}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("is-leaving");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, 3200);
}

/** Valida um e-mail com uma expressão regular simples e suficiente para formulários. */
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Valida um CPF (algoritmo oficial dos dígitos verificadores). */
function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i], 10) * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(cpf.slice(0, 9));
  const digito2 = calcularDigito(cpf.slice(0, 9) + digito1);
  return cpf === cpf.slice(0, 9) + digito1.toString() + digito2.toString();
}

/**
 * Gera o HTML de um card de produto. Usado tanto na home (destaques)
 * quanto no catálogo, evitando duplicar a marcação em dois lugares.
 */
function criarCardProdutoHTML(produto) {
  const marca = MARCAS[produto.marca];
  const favoritado = Favoritos.eFavorito(produto.id);

  return `
    <article class="product-card" data-produto-id="${produto.id}">
      <div class="product-card__media">
        <img src="${marca.logo}" alt="" class="product-card__brand-logo" aria-hidden="true">
        <img src="${produto.imagem}" alt="Tênis ${marca.nome} ${produto.nome}" loading="lazy">
        <button type="button"
                class="product-card__fav ${favoritado ? "is-active" : ""}"
                data-favoritar="${produto.id}"
                aria-pressed="${favoritado}"
                aria-label="${favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
          <i class="bx ${favoritado ? "bxs-heart" : "bx-heart"}"></i>
        </button>
      </div>
      <p class="product-card__category">${marca.nome} · ${CATEGORIAS[produto.categoria]}</p>
      <h3 class="product-card__name">${produto.nome}</h3>
      <p class="product-card__price">${formatarPreco(produto.preco)}</p>
      <button type="button" class="btn btn-dark btn-block" data-adicionar-carrinho="${produto.id}">
        <i class="bx bx-cart-add"></i> Adicionar
      </button>
    </article>`;
}

/**
 * Liga os eventos de "adicionar ao carrinho" e "favoritar" para todos os
 * cards existentes dentro de um container (delegação de evento no próprio container).
 */
function ativarEventosDosCards(container) {
  container.addEventListener("click", (evento) => {
    const botaoCarrinho = evento.target.closest("[data-adicionar-carrinho]");
    const botaoFav = evento.target.closest("[data-favoritar]");

    if (botaoCarrinho) {
      const produto = obterProdutoPorId(botaoCarrinho.dataset.adicionarCarrinho);
      if (produto) adicionarAoCarrinho(produto);
    }

    if (botaoFav) {
      const id = botaoFav.dataset.favoritar;
      const ativo = Favoritos.alternar(id);
      botaoFav.classList.toggle("is-active", ativo);
      botaoFav.setAttribute("aria-pressed", String(ativo));
      botaoFav.setAttribute("aria-label", ativo ? "Remover dos favoritos" : "Adicionar aos favoritos");
      botaoFav.querySelector("i").className = ativo ? "bx bxs-heart" : "bx bx-heart";
      mostrarToast(ativo ? "Adicionado aos favoritos." : "Removido dos favoritos.", "info");
    }
  });
}

/** Marca um campo com estado de erro e exibe a mensagem correspondente. */
function marcarErroCampo(input, mensagem) {
  const campo = input.closest(".campo");
  if (!campo) return;
  campo.classList.add("campo--erro");
  const erroEl = campo.querySelector(".campo__erro");
  if (erroEl) erroEl.textContent = mensagem;
}

/** Remove o estado de erro de um campo. */
function limparErroCampo(input) {
  const campo = input.closest(".campo");
  campo?.classList.remove("campo--erro");
}

/** Aplica máscara enquanto o usuário digita (cpf, telefone, cep). */
function aplicarMascara(valor, tipo) {
  const digitos = valor.replace(/\D/g, "");
  switch (tipo) {
    case "cpf":
      return digitos
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    case "telefone":
      return digitos
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    case "cep":
      return digitos.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    default:
      return valor;
  }
}
