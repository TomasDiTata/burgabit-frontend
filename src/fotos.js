// Fotos de las categorías del menú (están en public/img).
// Las categorías las crea el administrador, así que la foto se elige por palabras del nombre.
// El orden importa: "panceta" va antes que "pan", porque "panceta" también contiene "pan".
const FOTOS_DE_CATEGORIAS = [
    { palabras: ["panceta", "bacon"], foto: "/img/panceta.jpg" },
    { palabras: ["pan"], foto: "/img/panes.jpg" },
    { palabras: ["medall", "carne", "pollo"], foto: "/img/medallones.jpg" },
    { palabras: ["queso", "cheddar"], foto: "/img/quesos.jpg" },
    { palabras: ["salsa", "aderezo"], foto: "/img/salsas.jpg" },
    { palabras: ["papa", "acompa"], foto: "/img/papas.jpg" },
    { palabras: ["verdura", "vegetal", "topping"], foto: "/img/vegetales.jpg" }
];

// La foto de una categoría. Si ninguna palabra coincide, una hamburguesa.
export const fotoDeCategoria = (nombre) => {
    const texto = nombre.toLowerCase();
    const encontrada = FOTOS_DE_CATEGORIAS.find((opcion) => opcion.palabras.some((palabra) => texto.includes(palabra)));
    return encontrada?.foto ?? "/img/hamburguesa.jpg";
};
