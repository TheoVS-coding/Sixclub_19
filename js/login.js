/* ==========================================================================
   SixClub — Login
   Validação do formulário e autenticação simulada via LocalStorage.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("cadastro") === "sucesso") {
    mostrarToast("Conta criada com sucesso! Faça login para continuar.", "success");
  }

  const form = document.getElementById("form-login");
  const identificador = document.getElementById("login-identificador");
  const senha = document.getElementById("login-senha");
  const botao = form.querySelector("button[type=submit]");
  const textoBotao = form.querySelector(".js-texto-botao");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    [identificador, senha].forEach(limparErroCampo);

    let valido = true;
    if (!identificador.value.trim()) {
      marcarErroCampo(identificador, "Informe seu e-mail ou telefone.");
      valido = false;
    }
    if (!senha.value) {
      marcarErroCampo(senha, "Informe sua senha.");
      valido = false;
    }
    if (!valido) return;

    botao.disabled = true;
    textoBotao.textContent = "Entrando...";

    // Pequeno atraso simulado para dar feedback visual de carregamento
    setTimeout(() => {
      const resultado = Auth.login(identificador.value.trim(), senha.value);

      if (!resultado.ok) {
        botao.disabled = false;
        textoBotao.textContent = "Entrar";
        marcarErroCampo(senha, "E-mail/telefone ou senha incorretos.");
        mostrarToast("Não foi possível entrar. Verifique seus dados.", "error");
        return;
      }

      mostrarToast(`Bem-vindo(a) de volta, ${resultado.usuario.nome.split(" ")[0]}!`, "success");
      setTimeout(() => (window.location.href = "index.html"), 700);
    }, 500);
  });

  document.querySelector(".js-esqueci-senha").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarToast("Em breve você poderá redefinir sua senha por e-mail.", "info");
  });
});
