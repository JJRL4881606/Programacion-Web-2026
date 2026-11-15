import { guardar, leer } from "./storage.js";

// 1. menu hamburguesa
const btnMenu = document.querySelector("#btn-menu");
const menu = document.querySelector("#menu");

btnMenu.addEventListener("click", () => {
    menu.classList.toggle("abierto");
});

// 2. modo claro / oscuro
const btnTema = document.querySelector("#btn-tema");

// al cargar aplica la preferencia guardada (false si nunca eligió)
if (leer("invertido", false)) {
    document.body.classList.add("invertido");
}

btnTema.addEventListener("click", () => {
    document.body.classList.toggle("invertido");
    guardar("invertido", document.body.classList.contains("invertido"));
});

// 3. buscador: guarda el texto y filtra los juegos en search.html
const buscador = document.querySelector("#buscar");
const formBuscador = document.querySelector("header form");

// al buscar se guarda el texto para search.html
formBuscador.addEventListener("submit", () => {
    sessionStorage.setItem("busqueda", buscador.value);
});

// se ejecuta en search.html
if (document.querySelector("#resultados")) {
    const mensaje = document.querySelector("#sin-resultados");

    const filtrar = (valor) => {
        const texto = valor.toLowerCase().trim();
        let encontrados = 0;

        document.querySelectorAll("#resultados .juego").forEach((juego) => {
            const nombre = juego.querySelector("h3").textContent.toLowerCase();
            const coincide = nombre.includes(texto);

            juego.hidden = !coincide;

            if (coincide) {
                encontrados++;
            }
        });

        // muestra el mensaje solo si no hay resultados
        mensaje.hidden = encontrados > 0;
    };

    // al cargar pone en la barra el texto guardado y filtra con el
    buscador.value = sessionStorage.getItem("busqueda") ?? "";
    filtrar(buscador.value);

    // mientras el usuario escribe
    buscador.addEventListener("input", (e) => {
        filtrar(e.target.value);
    });
}