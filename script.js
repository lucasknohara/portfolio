const form = document.querySelector("#formulario");

form.addEventListener("submit", enviarWhats);

function enviarWhats(event) {
    event.preventDefault();

    const nome = document.querySelector("#nome").value;
    const mensagem = document.querySelector("#mensagem").value;

    const telefone = "5511945049396";

    const texto = `Olá! Me chamo ${nome}. ${mensagem}`;

    const msgFormatada = encodeURIComponent(texto);

    const url = `https://wa.me/${telefone}?text=${msgFormatada}`;

    window.open(url, "_blank");
}