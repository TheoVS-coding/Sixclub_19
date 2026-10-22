/* ==========================================================================
   SixClub — Home: carrossel de banners e vitrine de destaques
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrossel();
  renderizarDestaques();
});

function inicializarCarrossel() {
  const carrossel = document.querySelector(".hero-carousel");
  if (!carrossel) return;

  const track = carrossel.querySelector(".hero-carousel__track");
  const slides = [...carrossel.querySelectorAll(".hero-carousel__slide")];
  const dotsContainer = carrossel.querySelector(".hero-carousel__dots");
  let indiceAtual = 0;
  let autoplay;

  slides.forEach((_, indice) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para o slide ${indice + 1}`);
    if (indice === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => irPara(indice));
    dotsContainer.appendChild(dot);
  });

  function irPara(indice) {
    indiceAtual = (indice + slides.length) % slides.length;
    track.style.transform = `translateX(-${indiceAtual * 100}%)`;
    dotsContainer.querySelectorAll("button").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === indiceAtual);
    });
  }

  function reiniciarAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => irPara(indiceAtual + 1), 5000);
  }

  carrossel.querySelector(".hero-carousel__arrow--prev").addEventListener("click", () => {
    irPara(indiceAtual - 1);
    reiniciarAutoplay();
  });
  carrossel.querySelector(".hero-carousel__arrow--next").addEventListener("click", () => {
    irPara(indiceAtual + 1);
    reiniciarAutoplay();
  });

  reiniciarAutoplay();
}

function renderizarDestaques() {
  const container = document.querySelector(".js-produtos-destaque");
  if (!container) return;

  const produtos = PRODUTOS_DESTAQUE.map(obterProdutoPorId).filter(Boolean);
  container.innerHTML = produtos.map(criarCardProdutoHTML).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".js-produtos-destaque");
  if (container) ativarEventosDosCards(container);
});
