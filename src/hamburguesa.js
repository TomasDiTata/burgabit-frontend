// El dibujo de la hamburguesa: qué capa le toca a cada ingrediente y en qué orden se apilan.
// Los ingredientes los crea el administrador, así que la capa se elige por palabras del nombre (como en fotos.js).
// El orden importa: "panceta" va antes que "pan", porque "panceta" también contiene "pan".
// tipo null: no es una capa. El pan ya está dibujado arriba y abajo, y las papas o la bebida van al costado.
const TIPOS = [
    { palabras: ["panceta", "bacon"], tipo: "panceta" },
    { palabras: ["pan"], tipo: null },
    { palabras: ["papa", "frita", "bebida", "gaseosa"], tipo: null },
    { palabras: ["pollo"], tipo: "pollo" },
    { palabras: ["medall", "carne", "veggie"], tipo: "carne" },
    { palabras: ["queso", "cheddar", "dambo", "provoleta"], tipo: "queso" },
    { palabras: ["huevo"], tipo: "huevo" },
    { palabras: ["lechuga", "rúcula", "rucula"], tipo: "lechuga" },
    { palabras: ["tomate"], tipo: "tomate" },
    { palabras: ["cebolla"], tipo: "cebolla" },
    { palabras: ["pepino", "pickle"], tipo: "pepino" },
    { palabras: ["ketchup"], tipo: "ketchup" },
    { palabras: ["mostaza"], tipo: "mostaza" },
    { palabras: ["mayo", "alioli"], tipo: "mayonesa" },
    { palabras: ["barbacoa", "salsa"], tipo: "barbacoa" }
];

// De abajo hacia arriba, como se arma una hamburguesa de verdad: la carne sobre el pan y las salsas arriba de todo.
// "otro" es cualquier ingrediente que no coincide con ninguna palabra: va en el medio, con un color neutro.
const ORDEN = ["carne", "pollo", "queso", "panceta", "huevo", "otro", "cebolla", "tomate", "pepino", "lechuga", "barbacoa", "ketchup", "mostaza", "mayonesa"];

const tipoDe = (nombre) => {
    const texto = nombre.toLowerCase();
    const encontrado = TIPOS.find((opcion) => opcion.palabras.some((palabra) => texto.includes(palabra)));
    return encontrado ? encontrado.tipo : "otro";
};

// Las capas de un producto, de abajo hacia arriba: una por cada unidad de cada ingrediente.
// Recibe objetos con nombre y cantidad, como los que guarda el backend en cada pedido.
// clave identifica cada capa (por ejemplo, "Cheddar 2"): así React sabe cuál es nueva y la anima al caer.
export const capasDe = (ingredientes) => {
    const capas = [];

    for(const ingrediente of ingredientes) {
        const tipo = tipoDe(ingrediente.nombre);

        if(tipo === null) {
            continue;
        }

        for(let unidad = 1; unidad <= ingrediente.cantidad; unidad++) {
            capas.push({ clave: `${ingrediente.nombre} ${unidad}`, nombre: ingrediente.nombre, tipo });
        }
    }

    // sort con una función de comparación: va primero la capa cuyo tipo está antes en ORDEN.
    return capas.sort((una, otra) => ORDEN.indexOf(una.tipo) - ORDEN.indexOf(otra.tipo));
};
