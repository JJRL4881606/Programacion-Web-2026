// 1. menu hamburguesa
const btnMenu = document.querySelector("#btn-menu");
const menu = document.querySelector("#menu");

btnMenu.addEventListener("click", () => {
    menu.classList.toggle("abierto");
});

// 2. modo claro / oscuro
const btnTema = document.querySelector("#btn-tema");

btnTema.addEventListener("click", () => {
    document.body.classList.toggle("invertido");
});

// 3. buscador: filtra los juegos mientras se escribe
const buscador = document.querySelector("#buscar");

//solose ejecuta en search.html la pagina que tiene #resultados
if (document.querySelector("#resultados")) {
    const mensaje = document.querySelector("#sin-resultados");
    const form = document.querySelector("header form");

    // evita que la pagina se recarge al dar enter o clic en el boton de buscar
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    buscador.addEventListener("input", (e) => {
        const texto = e.target.value.toLowerCase().trim();
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
    });
}