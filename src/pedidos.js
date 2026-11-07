// Cálculos y textos de los pedidos.

// Precio de un producto que se está armando: la suma de precio × cantidad de cada ingrediente elegido.
// Cada producto es un array de { ingrediente, cantidad }.
export const subtotalDe = (producto) => {
    return producto.reduce((suma, elegido) => suma + elegido.ingrediente.precio * elegido.cantidad, 0);
};

// Texto con los ingredientes, por ejemplo "pan de papa, medallón de carne x2, lechuga".
// Recibe objetos con nombre y cantidad, como los que guarda el backend en cada pedido.
export const listarIngredientes = (ingredientes) => {
    return ingredientes
        .map((item) => (item.cantidad > 1 ? `${item.nombre} x${item.cantidad}` : item.nombre))
        .join(", ");
};

// Lo mismo, para un producto que se está armando.
export const describirProducto = (producto) => {
    return listarIngredientes(producto.map((elegido) => ({ nombre: elegido.ingrediente.nombre, cantidad: elegido.cantidad })));
};