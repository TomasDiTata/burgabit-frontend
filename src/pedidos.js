// Cálculos y textos de los pedidos.
import { conMayuscula } from "./formato.js";

// Precio de un producto que se está armando: la suma de precio × cantidad de cada ingrediente elegido.
// Cada producto es un array de { ingrediente, cantidad }.
export const subtotalDe = (producto) => {
    return producto.reduce((suma, elegido) => suma + elegido.ingrediente.precio * elegido.cantidad, 0);
};

// Texto con los ingredientes, por ejemplo "Pan de papa, Medallón de carne x2, Lechuga".
// Recibe objetos con nombre y cantidad, como los que guarda el backend en cada pedido.
export const listarIngredientes = (ingredientes) => {
    return ingredientes
        .map((item) => (item.cantidad > 1 ? `${conMayuscula(item.nombre)} x${item.cantidad}` : conMayuscula(item.nombre)))
        .join(", ");
};

// Un producto que se está armando, como lista de { nombre, cantidad }: la misma forma que guarda el backend en cada pedido.
export const ingredientesDe = (producto) => {
    return producto.map((elegido) => ({ nombre: elegido.ingrediente.nombre, cantidad: elegido.cantidad }));
};

// Lo mismo que listarIngredientes, para un producto que se está armando.
export const describirProducto = (producto) => {
    return listarIngredientes(ingredientesDe(producto));
};