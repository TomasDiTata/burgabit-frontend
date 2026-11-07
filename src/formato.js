// Formatos para mostrar los datos como se leen en Argentina.

// 1500 → "$1.500"
export const formatearPrecio = (numero) => `$${numero.toLocaleString("es-AR")}`;

// Una fecha del backend (por ejemplo "2026-11-06T23:15:00.000Z") → "6/11/2026 20:15", en la hora de quien mira.
export const formatearFecha = (texto) => {
    const fecha = new Date(texto);
    const hora = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${fecha.toLocaleDateString("es-AR")} ${hora}`;
};