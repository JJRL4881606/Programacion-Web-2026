import { obtenerJuegos } from "./api.js";
import { guardar, leer } from "./storage.js";
import {
    mostrarEstado,
    renderCatalogo,
    confirmarQuitarFavorito,
    alertaError,
} from "./ui.js";

const catalogo = document.querySelector("#catalogo");

let favoritos = leer("favoritos", []);
let juegos = [];

// muestra solo los juegos que están en favoritos
function mostrarFavoritos() {
    const lista = juegos.filter((juego) => favoritos.indexOf(juego.id) !== -1);

    if (!lista.length) {
        mostrarEstado("Todavía no tienes favoritos. Marca el corazón de un juego para verlo aquí.");
        renderCatalogo([], favoritos);
        return;
    }

    mostrarEstado("");
    renderCatalogo(lista, favoritos);
}

async function cargarFavoritos() {
    mostrarEstado("Cargando favoritos…");

    try {
        const datos = await obtenerJuegos("../data/juegos.json");

        // las imgs del json son relativas a la raiz y esta pagina esta en pages
        juegos = datos.map((juego) => ({ ...juego, imagen: `../${juego.imagen}` }));

        mostrarFavoritos();
    } catch (err) {
        console.error(err);
        mostrarEstado("No pudimos cargar tus favoritos. Inténtalo de nuevo más tarde.");
        alertaError("No pudimos cargar tus favoritos.");
    }
}

// un solo listener en el contenedor (delegación con closest)
catalogo.addEventListener("click", async (e) => {
    const boton = e.target.closest("[data-accion='favorito']");
    if (!boton) return;

    const tarjeta = boton.closest(".juego");
    const id = Number(tarjeta.dataset.id);
    const nombre = tarjeta.querySelector("h3").textContent;

    const confirmado = await confirmarQuitarFavorito(nombre);
    if (!confirmado) return;

    // arreglo nuevo sin ese id
    favoritos = favoritos.filter((favorito) => favorito !== id);
    guardar("favoritos", favoritos);
    mostrarFavoritos();
});

cargarFavoritos();