import Swal from "./lib/sweetalert2.esm.all.js";

const catalogo = document.querySelector("#catalogo");
const estado = document.querySelector("#estado-catalogo");
const plantilla = document.querySelector("#tpl-juego");

// Estados del catalogo
export function mostrarEstado(texto) {
    estado.textContent = texto;
    estado.hidden = texto === "";
}

// Tarjetas
export function actualizarCorazon(boton, esFavorito) {
    boton.setAttribute("aria-pressed", String(esFavorito));
    boton.textContent = esFavorito ? "♥" : "♡";
}

function crearTarjeta(juego, esFavorito) {
    const clon = plantilla.content.cloneNode(true);

    clon.querySelector(".juego").dataset.id = juego.id;

    const enlace = clon.querySelector(".juego__enlace");
    enlace.href = `pages/game.html?id=${juego.id}`;

    const imagen = clon.querySelector(".juego__imagen");
    imagen.src = juego.imagen;
    imagen.alt = juego.nombre;

    clon.querySelector("h3").textContent = juego.nombre;
    clon.querySelector(".precio strong").textContent = `$${juego.precio.toFixed(2)}`;

    const corazon = clon.querySelector(".favorito");
    corazon.setAttribute("aria-label", `Favorito: ${juego.nombre}`);
    actualizarCorazon(corazon, esFavorito);

    return clon;
}

export function renderCatalogo(juegos, favoritos) {
    catalogo.replaceChildren(
        ...juegos.map((juego) => crearTarjeta(juego, favoritos.indexOf(juego.id) !== -1))
    );
}

// Alertas (sweetalert2)
export function alertaFavoritoAgregado(nombre) {
    return Swal.fire({
        icon: "success",
        title: "Agregado a favoritos",
        text: nombre,
    });
}

export async function confirmarQuitarFavorito(nombre) {
    const resultado = await Swal.fire({
        icon: "question",
        title: "¿Quitar de favoritos?",
        text: nombre,
        showCancelButton: true,
        confirmButtonText: "Si, quitar",
        cancelButtonText: "Cancelar",
    });
    return resultado.isConfirmed;
}

export function alertaError(texto) {
    return Swal.fire({ icon: "error", title: "Algo salió mal", text: texto });
}