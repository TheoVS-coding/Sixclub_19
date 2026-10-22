/* ==========================================================================
   SixClub — Catálogo de produtos
   Fonte única dos dados. Antes, os mesmos 36 produtos estavam copiados
   manualmente em 10 páginas HTML diferentes (estoque.html + 6 páginas de
   marca + 3 páginas de categoria). Agora todas as páginas (home e catálogo)
   leem daqui, então alterar um preço ou produto exige mudar em um só lugar.
   ========================================================================== */

const MARCAS = {
  nike: { nome: "Nike", logo: "img/logos/icons8-nike-96.png" },
  adidas: { nome: "Adidas", logo: "img/logos/icons8-adidas-96.png" },
  puma: { nome: "Puma", logo: "img/logos/icons8-puma-96.png" },
  mizuno: { nome: "Mizuno", logo: "img/logos/icons8-mizuno-96.png" },
  olympikus: { nome: "Olympikus", logo: "img/logos/icons8-olympikus-96.png" },
  newbalance: { nome: "New Balance", logo: "img/logos/logo-newbalance.png" },
};

const CATEGORIAS = {
  corrida: "Corrida",
  casual: "Casual",
  lifestyle: "Lifestyle",
};

const PRODUTOS = [
  // ---------- CORRIDA ----------
  { id: "cor-01", marca: "nike", categoria: "corrida", nome: "Air Zoom Pegasus", preco: 999.99, imagem: "img/produtos/tenis_37.png" },
  { id: "cor-02", marca: "adidas", categoria: "corrida", nome: "Ultraboost", preco: 1099.99, imagem: "img/produtos/tenis_43.png" },
  { id: "cor-03", marca: "olympikus", categoria: "corrida", nome: "Corre 4", preco: 599.99, imagem: "img/produtos/tenis_11.png" },
  { id: "cor-04", marca: "mizuno", categoria: "corrida", nome: "Wave Creation", preco: 699.99, imagem: "img/produtos/tenis_46.png" },
  { id: "cor-05", marca: "puma", categoria: "corrida", nome: "Velocity Nitro", preco: 899.99, imagem: "img/produtos/nitro.png" },
  { id: "cor-06", marca: "newbalance", categoria: "corrida", nome: "FuelCell", preco: 849.99, imagem: "img/produtos/nb-fuelcell.jpg" },
  { id: "cor-07", marca: "nike", categoria: "corrida", nome: "Vomero 18", preco: 999.99, imagem: "img/produtos/tenis_45.png" },
  { id: "cor-08", marca: "adidas", categoria: "corrida", nome: "Adizero Evo SL", preco: 1099.99, imagem: "img/produtos/tenis_6.png" },
  { id: "cor-09", marca: "olympikus", categoria: "corrida", nome: "Corre Turbo", preco: 599.99, imagem: "img/produtos/tenis_12.png" },
  { id: "cor-10", marca: "mizuno", categoria: "corrida", nome: "Wave Prophecy", preco: 1199.99, imagem: "img/produtos/tenis_47.png" },
  { id: "cor-11", marca: "puma", categoria: "corrida", nome: "Deviate Nitro", preco: 1199.99, imagem: "img/produtos/puma-deviate-nitro.png" },
  { id: "cor-12", marca: "newbalance", categoria: "corrida", nome: "Supercomp", preco: 1399.99, imagem: "img/produtos/nb-supercomp.jpg" },

  // ---------- CASUAL ----------
  { id: "cas-01", marca: "nike", categoria: "casual", nome: "Air Force 1", preco: 799.99, imagem: "img/produtos/tenis_7.png" },
  { id: "cas-02", marca: "adidas", categoria: "casual", nome: "Grand Court", preco: 399.99, imagem: "img/produtos/adidas-grand-court.png" },
  { id: "cas-03", marca: "olympikus", categoria: "casual", nome: "Eros", preco: 179.99, imagem: "img/produtos/olympikus-eros.jpeg" },
  { id: "cas-04", marca: "mizuno", categoria: "casual", nome: "Edo Cross", preco: 399.99, imagem: "img/produtos/tenis_19.png" },
  { id: "cas-05", marca: "puma", categoria: "casual", nome: "Caven 2.0", preco: 259.99, imagem: "img/produtos/tenis_9.png" },
  { id: "cas-06", marca: "newbalance", categoria: "casual", nome: "480", preco: 279.99, imagem: "img/produtos/480.png" },
  { id: "cas-07", marca: "nike", categoria: "casual", nome: "Court Vision", preco: 399.99, imagem: "img/produtos/tenis_13.png" },
  { id: "cas-08", marca: "adidas", categoria: "casual", nome: "Grand Court SE", preco: 399.99, imagem: "img/produtos/adidas-grand-court-2.png" },
  { id: "cas-09", marca: "olympikus", categoria: "casual", nome: "Versa", preco: 279.99, imagem: "img/produtos/olympikus-versa.jpeg" },
  { id: "cas-10", marca: "mizuno", categoria: "casual", nome: "City Wind", preco: 429.99, imagem: "img/produtos/tenis_10.png" },
  { id: "cas-11", marca: "puma", categoria: "casual", nome: "Speedcat", preco: 699.99, imagem: "img/produtos/speedcat.png" },
  { id: "cas-12", marca: "newbalance", categoria: "casual", nome: "550", preco: 479.99, imagem: "img/produtos/550.png" },

  // ---------- LIFESTYLE ----------
  { id: "lif-01", marca: "nike", categoria: "lifestyle", nome: "Dunk Low", preco: 999.99, imagem: "img/produtos/tenis_17.png" },
  { id: "lif-02", marca: "adidas", categoria: "lifestyle", nome: "Megagrid", preco: 1499.99, imagem: "img/produtos/megagrid.png" },
  { id: "lif-03", marca: "olympikus", categoria: "lifestyle", nome: "Neblina", preco: 299.99, imagem: "img/produtos/olympikus.png" },
  { id: "lif-04", marca: "mizuno", categoria: "lifestyle", nome: "Sky Medal", preco: 599.99, imagem: "img/produtos/tenis_23.png" },
  { id: "lif-05", marca: "puma", categoria: "lifestyle", nome: "180", preco: 799.99, imagem: "img/produtos/puma-180.jpeg" },
  { id: "lif-06", marca: "newbalance", categoria: "lifestyle", nome: "1000", preco: 999.99, imagem: "img/produtos/nb-1000.png" },
  { id: "lif-07", marca: "nike", categoria: "lifestyle", nome: "Jordan 4", preco: 1299.99, imagem: "img/produtos/tenis_32.png" },
  { id: "lif-08", marca: "adidas", categoria: "lifestyle", nome: "Campus", preco: 799.99, imagem: "img/produtos/adidas-campus.png" },
  { id: "lif-09", marca: "olympikus", categoria: "lifestyle", nome: "Neblina Trail", preco: 299.99, imagem: "img/produtos/neblina.png" },
  { id: "lif-10", marca: "mizuno", categoria: "lifestyle", nome: "Sky Medal II", preco: 599.99, imagem: "img/produtos/tenis_24.png" },
  { id: "lif-11", marca: "puma", categoria: "lifestyle", nome: "Suede", preco: 599.99, imagem: "img/produtos/puma-suede.jpeg" },
  { id: "lif-12", marca: "newbalance", categoria: "lifestyle", nome: "740", preco: 749.99, imagem: "img/produtos/nb-740.png" },
];

/** IDs usados na vitrine "Produtos em Destaque" da home. */
const PRODUTOS_DESTAQUE = ["cor-01", "cor-02", "cor-05", "cor-06"];

function obterProdutoPorId(id) {
  return PRODUTOS.find((produto) => produto.id === id);
}
