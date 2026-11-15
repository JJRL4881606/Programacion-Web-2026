import { obtenerJuegos } from "./api.js";
import { guardar, leer } from "./storage.js";
import {
    mostrarEstado,
    renderCatalogo,
    actualizarCorazon,
    alertaFavoritoAgregado,
    confirmarQuitarFavorito,
    alertaError,
} from "./ui.js";

const catalogo = document.querySelector("#catalogo");

// los favoritos se leen al cargar la pagina
const favoritos = leer("favoritos", []);

async function cargarCatalogo() {
    mostrarEstado("Cargando juegos…");

    try {
        const juegos = await obtenerJuegos("data/juegos.json");

        if (!juegos.length) {
            mostrarEstado("No hay juegos disponibles por ahora.");
            return;
        }

        mostrarEstado("");
        renderCatalogo(juegos, favoritos);
    } catch (err) {
        mostrarEstado("No pudimos cargar los juegos. Inténtalo de nuevo más tarde.");
        alertaError("No pudimos cargar el catálogo de juegos.");
    }
}

// un solo listener en el contenedor (delegacion con closest)
catalogo.addEventListener("click", async (e) => {
    const boton = e.target.closest("[data-accion='favorito']");
    if (!boton) return;

    const tarjeta = boton.closest(".juego");
    const id = Number(tarjeta.dataset.id);
    const nombre = tarjeta.querySelector("h3").textContent;
    const i = favoritos.indexOf(id);

    if (i === -1) {
        favoritos.push(id);
        guardar("favoritos", favoritos);
        actualizarCorazon(boton, true);
        alertaFavoritoAgregado(nombre);
    } else {
        const confirmado = await confirmarQuitarFavorito(nombre);
        if (!confirmado) return;

        favoritos.splice(i, 1);
        guardar("favoritos", favoritos);
        actualizarCorazon(boton, false);
    }
});

cargarCatalogo();