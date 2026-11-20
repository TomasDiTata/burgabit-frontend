// Fotos de las categorías del menú y de cada ingrediente (están en public/img).
// Las categorías y los ingredientes los crea el administrador, así que la foto se elige por palabras del nombre.
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

// Las miniaturas de los ingredientes, en public/img/ingredientes: una foto chica de cada uno.
// "pollo" va antes que "medall": "Medallón de pollo" tiene que mostrar el pollo y no la carne.
const FOTOS_DE_INGREDIENTES = [
    { palabras: ["panceta", "bacon"], foto: "panceta" },
    { palabras: ["pan"], foto: "pan" },
    { palabras: ["papa", "frita"], foto: "papas" },
    { palabras: ["pollo"], foto: "pollo" },
    { palabras: ["medall", "carne"], foto: "carne" },
    { palabras: ["queso", "cheddar", "dambo", "provoleta"], foto: "queso" },
    { palabras: ["huevo"], foto: "huevo" },
    { palabras: ["lechuga", "rúcula", "rucula"], foto: "lechuga" },
    { palabras: ["tomate"], foto: "tomate" },
    { palabras: ["cebolla"], foto: "cebolla" },
    { palabras: ["pepino", "pickle"], foto: "pepinos" },
    { palabras: ["hongo", "champi"], foto: "hongos" },
    { palabras: ["palta", "guacamole"], foto: "palta" },
    { palabras: ["ketchup"], foto: "ketchup" },
    { palabras: ["mostaza"], foto: "mostaza" },
    { palabras: ["mayo", "alioli"], foto: "mayonesa" },
    { palabras: ["barbacoa", "bbq"], foto: "barbacoa" }
];

// La primera opción de la lista cuyas palabras aparecen en el nombre, o undefined si ninguna coincide.
// Es una función aparte porque la usan las dos búsquedas: la de las categorías y la de los ingredientes.
const buscarPorPalabras = (opciones, nombre) => {
    const texto = nombre.toLowerCase();
    return opciones.find((opcion) => opcion.palabras.some((palabra) => texto.includes(palabra)));
};

// La foto de una categoría. Si ninguna palabra coincide, una hamburguesa.
export const fotoDeCategoria = (nombre) => {
    return buscarPorPalabras(FOTOS_DE_CATEGORIAS, nombre)?.foto ?? "/img/hamburguesa.jpg";
};

// La miniatura de un ingrediente. Si ninguna palabra coincide, la foto de su categoría.
export const fotoDeIngrediente = (nombre, nombreDeCategoria) => {
    const encontrada = buscarPorPalabras(FOTOS_DE_INGREDIENTES, nombre);
    return encontrada ? `/img/ingredientes/${encontrada.foto}.jpg` : fotoDeCategoria(nombreDeCategoria);
};
