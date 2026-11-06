// Reglas que comparten los formularios. Son las mismas que exige el backend en el modelo Usuario.

// Formato del email (campo email, match).
export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Largo mínimo de la contraseña (campo password, minLength).
export const MINIMO_PASSWORD = 8;


// true si el texto es un número entero desde "minimo". Los campos de números llegan como texto,
// y el texto vacío no cuenta: Number("") da 0.
export const esEnteroDesde = (texto, minimo) => {
    const numero = Number(texto);
    return texto !== "" && Number.isInteger(numero) && numero >= minimo;
};