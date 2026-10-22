/* ==========================================================================
   SixClub — Cadastro
   Máscaras de entrada + validação completa do formulário antes de salvar
   o usuário no LocalStorage.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");

  const campos = {
    nome: document.getElementById("cad-nome"),
    cpf: document.getElementById("cad-cpf"),
    telefone: document.getElementById("cad-telefone"),
    email: document.getElementById("cad-email"),
    senha: document.getElementById("cad-senha"),
    senhaConfirma: document.getElementById("cad-senha-confirma"),
    cep: document.getElementById("cad-cep"),
    logradouro: document.getElementById("cad-logradouro"),
    numero: document.getElementById("cad-numero"),
    bairro: document.getElementById("cad-bairro"),
    cidade: document.getElementById("cad-cidade"),
    estado: document.getElementById("cad-estado"),
    residencia: document.getElementById("cad-residencia"),
  };

  // Máscaras aplicadas enquanto o usuário digita
  campos.cpf.addEventListener("input", () => (campos.cpf.value = aplicarMascara(campos.cpf.value, "cpf")));
  campos.telefone.addEventListener("input", () => (campos.telefone.value = aplicarMascara(campos.telefone.value, "telefone")));
  campos.cep.addEventListener("input", () => (campos.cep.value = aplicarMascara(campos.cep.value, "cep")));

  // Indicador visual de força da senha
  campos.senha.addEventListener("input", () => {
    const barra = document.querySelector(".forca-senha__barra");
    const valor = campos.senha.value;
    let forca = 0;
    if (valor.length >= 6) forca += 34;
    if (/[A-Z]/.test(valor) && /[a-z]/.test(valor)) forca += 33;
    if (/\d/.test(valor)) forca += 33;
    barra.style.width = `${forca}%`;
    barra.style.background = forca >= 90 ? "var(--color-success)" : forca >= 50 ? "#e0a000" : "var(--color-error)";
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    Object.values(campos).forEach(limparErroCampo);

    let valido = true;
    const marcarErro = (campo, mensagem) => {
      marcarErroCampo(campo, mensagem);
      valido = false;
    };

    if (!campos.nome.value.trim() || campos.nome.value.trim().split(" ").length < 2) {
      marcarErro(campos.nome, "Informe seu nome completo.");
    }
    if (!cpfValido(campos.cpf.value)) {
      marcarErro(campos.cpf, "CPF inválido. Confira os números digitados.");
    }
    if (campos.telefone.value.replace(/\D/g, "").length < 10) {
      marcarErro(campos.telefone, "Informe um telefone válido com DDD.");
    }
    if (!emailValido(campos.email.value)) {
      marcarErro(campos.email, "Informe um e-mail válido.");
    }
    if (campos.senha.value.length < 6) {
      marcarErro(campos.senha, "A senha deve ter ao menos 6 caracteres.");
    }
    if (campos.senhaConfirma.value !== campos.senha.value || !campos.senhaConfirma.value) {
      marcarErro(campos.senhaConfirma, "As senhas não coincidem.");
    }
    if (campos.cep.value.replace(/\D/g, "").length !== 8) {
      marcarErro(campos.cep, "CEP inválido.");
    }
    if (!campos.logradouro.value.trim()) marcarErro(campos.logradouro, "Informe o logradouro.");
    if (!campos.numero.value.trim()) marcarErro(campos.numero, "Informe o número.");
    if (!campos.bairro.value.trim()) marcarErro(campos.bairro, "Informe o bairro.");
    if (!campos.cidade.value.trim()) marcarErro(campos.cidade, "Informe a cidade.");
    if (!campos.estado.value) marcarErro(campos.estado, "Selecione o estado.");
    if (!campos.residencia.value) marcarErro(campos.residencia, "Selecione o tipo de residência.");

    if (!valido) {
      mostrarToast("Verifique os campos destacados em vermelho.", "error");
      form.querySelector(".campo--erro input, .campo--erro select")?.focus();
      return;
    }

    const botao = form.querySelector("button[type=submit]");
    const textoBotao = form.querySelector(".js-texto-botao");
    botao.disabled = true;
    textoBotao.textContent = "Criando conta...";

    setTimeout(() => {
      const resultado = Auth.cadastrar({
        nome: campos.nome.value.trim(),
        cpf: campos.cpf.value,
        telefone: campos.telefone.value,
        email: campos.email.value.trim(),
        senha: campos.senha.value,
        endereco: {
          cep: campos.cep.value,
          logradouro: campos.logradouro.value.trim(),
          numero: campos.numero.value.trim(),
          bairro: campos.bairro.value.trim(),
          cidade: campos.cidade.value.trim(),
          estado: campos.estado.value,
          tipoResidencia: campos.residencia.value,
        },
      });

      if (!resultado.ok) {
        botao.disabled = false;
        textoBotao.textContent = "Criar conta";
        marcarErroCampo(campos.email, resultado.motivo);
        mostrarToast(resultado.motivo, "error");
        return;
      }

      window.location.href = "login.html?cadastro=sucesso";
    }, 500);
  });
});
