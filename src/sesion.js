// La sesión es el token que devuelve el login. Se guarda en el navegador (localStorage)
// para que siga abierta aunque se recargue la página o se cierre la pestaña.
const CLAVE = "burgabitToken";

export const guardarToken = (token) => {
    localStorage.setItem(CLAVE, token);
};

export const leerToken = () => {
    return localStorage.getItem(CLAVE);
};

export const borrarToken = () => {
    localStorage.removeItem(CLAVE);
};

// Un token tiene tres partes separadas por puntos: encabezado.contenido.firma.
// El contenido viene en base64url: se pasa a base64 común, atob lo decodifica y queda el JSON con id, rol y vencimiento.
// Leerlo no es verificarlo: la firma la controla el backend en cada petición.
const leerContenido = (token) => {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
};

// Devuelve la sesión guardada ({ id, rol }) o null si no hay una que sirva.
export const leerSesion = () => {
    const token = leerToken();

    if(!token) {
        return null;
    }

    try {
        const { id, rol, exp } = leerContenido(token);

        // exp está en segundos y Date.now() en milisegundos: por eso el * 1000.
        if(exp * 1000 < Date.now()) {
            borrarToken();
            return null;
        }

        return { id, rol };
    } catch (error) {
        // El token está roto (por ejemplo, lo editaron a mano): no sirve, se borra.
        borrarToken();
        return null;
    }
};