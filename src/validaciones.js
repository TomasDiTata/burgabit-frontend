// Reglas que comparten los formularios. Son las mismas que exige el backend en el modelo Usuario.

// Formato del email (campo email, match).
export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Largo mínimo de la contraseña (campo password, minLength).
export const MINIMO_PASSWORD = 8;