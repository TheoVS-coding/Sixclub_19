/* ==========================================================================
   SixClub — Camada de persistência (LocalStorage)
   Centraliza toda a leitura/escrita de carrinho, favoritos e usuários,
   evitando repetir chamadas a localStorage espalhadas pelo código.
   ========================================================================== */

const STORAGE_KEYS = {
  CART: "sixclub:carrinho",
  FAVORITES: "sixclub:favoritos",
  USERS: "sixclub:usuarios",
  SESSION: "sixclub:sessao",
};

function lerStorage(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch (erro) {
    console.error(`Falha ao ler ${chave} do LocalStorage`, erro);
    return padrao;
  }
}

function salvarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.error(`Falha ao salvar ${chave} no LocalStorage`, erro);
    return false;
  }
}

/* ---------------- Carrinho ---------------- */
const Carrinho = {
  obterItens() {
    return lerStorage(STORAGE_KEYS.CART, []);
  },

  salvarItens(itens) {
    salvarStorage(STORAGE_KEYS.CART, itens);
    document.dispatchEvent(new CustomEvent("carrinho:alterado", { detail: itens }));
  },

  adicionar(produto, quantidade = 1) {
    const itens = this.obterItens();
    const existente = itens.find((item) => item.produtoId === produto.id);
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      itens.push({ produtoId: produto.id, quantidade });
    }
    this.salvarItens(itens);
  },

  atualizarQuantidade(produtoId, quantidade) {
    let itens = this.obterItens();
    if (quantidade <= 0) {
      itens = itens.filter((item) => item.produtoId !== produtoId);
    } else {
      const item = itens.find((i) => i.produtoId === produtoId);
      if (item) item.quantidade = quantidade;
    }
    this.salvarItens(itens);
  },

  remover(produtoId) {
    const itens = this.obterItens().filter((item) => item.produtoId !== produtoId);
    this.salvarItens(itens);
  },

  esvaziar() {
    this.salvarItens([]);
  },

  totalItens() {
    return this.obterItens().reduce((soma, item) => soma + item.quantidade, 0);
  },
};

/* ---------------- Favoritos ---------------- */
const Favoritos = {
  obterIds() {
    return lerStorage(STORAGE_KEYS.FAVORITES, []);
  },

  alternar(produtoId) {
    let ids = this.obterIds();
    const ativo = ids.includes(produtoId);
    ids = ativo ? ids.filter((id) => id !== produtoId) : [...ids, produtoId];
    salvarStorage(STORAGE_KEYS.FAVORITES, ids);
    document.dispatchEvent(new CustomEvent("favoritos:alterado", { detail: ids }));
    return !ativo;
  },

  eFavorito(produtoId) {
    return this.obterIds().includes(produtoId);
  },
};

/* ---------------- Usuários / sessão (autenticação simulada) ---------------- */
const Auth = {
  obterUsuarios() {
    return lerStorage(STORAGE_KEYS.USERS, []);
  },

  cadastrar(usuario) {
    const usuarios = this.obterUsuarios();
    if (usuarios.some((u) => u.email === usuario.email)) {
      return { ok: false, motivo: "E-mail já cadastrado." };
    }
    usuarios.push(usuario);
    salvarStorage(STORAGE_KEYS.USERS, usuarios);
    return { ok: true };
  },

  login(identificador, senha) {
    const usuarios = this.obterUsuarios();
    const usuario = usuarios.find(
      (u) => (u.email === identificador || u.telefone === identificador) && u.senha === senha
    );
    if (!usuario) return { ok: false, motivo: "Credenciais inválidas." };
    salvarStorage(STORAGE_KEYS.SESSION, { nome: usuario.nome, email: usuario.email });
    return { ok: true, usuario };
  },

  sessaoAtual() {
    return lerStorage(STORAGE_KEYS.SESSION, null);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },
};
