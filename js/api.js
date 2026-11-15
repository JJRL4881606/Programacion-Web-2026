// pide los juegos, si algo falla, lanza el error
export async function obtenerJuegos(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
}