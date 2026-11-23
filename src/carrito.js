// El carrito: las hamburguesas ya armadas que todavía no se pidieron.
// Se guarda en el navegador (localStorage), como el token en sesion.js, para que no se pierda
// al recargar la página o al cerrar la pestaña.
// Cada cuenta tiene el suyo: la clave lleva el id del usuario (por ejemplo "burgabitCarrito-6650a1..."),
// así quien entre con otra cuenta en el mismo navegador no ve un carrito ajeno.
const claveDe = (idUsuario) => `burgabitCarrito-${idUsuario}`;

// localStorage guarda solo texto: JSON.stringify convierte el carrito (un array) en texto.
export const guardarCarrito = (idUsuario, carrito) => {
    localStorage.setItem(claveDe(idUsuario), JSON.stringify(carrito));
};

// Devuelve el carrito guardado, o uno vacío si no hay ninguno o si lo guardado no sirve.
// JSON.parse vuelve a armar el array a partir del texto.
export const leerCarrito = (idUsuario) => {
    try {
        const carrito = JSON.parse(localStorage.getItem(claveDe(idUsuario)));

        // Sin nada guardado, getItem devuelve null. Array.isArray deja pasar solo un array: lo demás no es un carrito.
        return Array.isArray(carrito) ? carrito : [];
    } catch (error) {
        // El texto está roto (por ejemplo, lo editaron a mano): JSON.parse lanza un error y se arranca con el carrito vacío.
        return [];
    }
};
