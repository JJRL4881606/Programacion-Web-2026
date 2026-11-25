// guarda cualquier valor como json
export const guardar = (clave, valor) =>
    localStorage.setItem(clave, JSON.stringify(valor));

// lee y convierte de json, si no existe o está dañado, devuelve el valor por defecto
export const leer = (clave, defecto = null) => {
    try {
        return JSON.parse(localStorage.getItem(clave)) ?? defecto;
    } catch {
        return defecto;
    }
};