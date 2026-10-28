// Dirección de la API. Vite la toma del archivo .env (variable VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL;

// Hace una petición a la API y devuelve los datos de la respuesta, ya convertidos de JSON.
// Recibe la ruta (por ejemplo "/api/ingredientes/menu") y las mismas opciones que fetch (method, body, headers).
// Si algo sale mal, lanza un Error con un mensaje pensado para mostrarle al usuario.
export const pedirApi = async (ruta, opciones = {}) => {
        // Sin la dirección de la API, el pedido saldría a cualquier lado: mejor avisar con un mensaje claro.
    if(!API_URL) {
        throw new Error("Falta configurar la dirección de la API (VITE_API_URL en el archivo .env).");
    }
    
    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            ...opciones,
            headers: {
                "Content-Type": "application/json",
                ...opciones.headers
            }
        });
    } catch (error) {
        // fetch solo falla acá cuando no llega ninguna respuesta: sin internet, servidor caído o dirección equivocada.
        throw new Error("No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.");
    }

    // El backend siempre responde JSON. Si llega otra cosa (por ejemplo, una página de error), se usa un objeto vacío.
    const datos = await respuesta.json().catch(() => ({}));

    // ok es false cuando el código de estado no es 2xx (400, 401, 403, 404, 409, 500...).
    if(!respuesta.ok) {
        throw new Error(datos.msg || "Ocurrió un error inesperado. Intentá de nuevo.");
    }

    return datos;
};