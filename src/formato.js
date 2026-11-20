// Formatos para mostrar los datos como se leen en Argentina.

// La base guarda los nombres de categorías e ingredientes en minúscula (lowercase: true en los modelos del backend),
// así "Cheddar" y "cheddar" cuentan como el mismo y no se repiten. Para mostrarlos, la primera letra va en mayúscula.
// "medallón de carne" → "Medallón de carne"
export const conMayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

// 1500 → "$1.500"
export const formatearPrecio = (numero) => `$${numero.toLocaleString("es-AR")}`;

// Una fecha del backend (por ejemplo "2026-11-06T23:15:00.000Z") → "6/11/2026 20:15", en la hora de quien mira.
export const formatearFecha = (texto) => {
    const fecha = new Date(texto);
    const hora = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${fecha.toLocaleDateString("es-AR")} ${hora}`;
};