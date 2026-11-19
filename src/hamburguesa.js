import { conMayuscula } from "./formato.js";

// Las capas de la hamburguesa: qué foto le toca a cada ingrediente y en qué orden se apilan.
// Cada tipo es una foto en public/img/capas (por ejemplo, "carne" es carne.webp).
// Los ingredientes los crea el administrador, así que la capa se elige por palabras del nombre (como en fotos.js).
// El orden importa: "panceta" va antes que "pan", porque "panceta" también contiene "pan".
// tipo null: no es una capa. El pan ya está siempre (arriba y abajo), y las papas o la bebida van al costado.
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
    { palabras: ["barbacoa", "bbq"], tipo: "barbacoa" },
    { palabras: ["mayo", "alioli", "salsa", "aderezo"], tipo: "mayonesa" }
];

// De abajo hacia arriba, como se arma una hamburguesa de verdad: la carne sobre el pan y las salsas arriba de todo.
const ORDEN = ["carne", "pollo", "queso", "panceta", "huevo", "cebolla", "tomate", "pepino", "lechuga", "barbacoa", "ketchup", "mostaza", "mayonesa"];

// El tipo de capa de un ingrediente. Si ninguna palabra coincide, null: ese ingrediente no tiene foto y no se apila
// (igual aparece escrito en el resumen).
const tipoDe = (nombre) => {
    const texto = nombre.toLowerCase();
    const encontrado = TIPOS.find((opcion) => opcion.palabras.some((palabra) => texto.includes(palabra)));
    return encontrado ? encontrado.tipo : null;
};

// Las capas de un producto, de abajo hacia arriba: una por cada unidad de cada ingrediente.
// Recibe objetos con nombre y cantidad, como los que guarda el backend en cada pedido.
// clave identifica cada capa (por ejemplo, "cheddar 2"): así React sabe cuál es nueva y la anima al caer.
export const capasDe = (ingredientes) => {
    const capas = [];

    for(const ingrediente of ingredientes) {
        const tipo = tipoDe(ingrediente.nombre);

        if(tipo === null) {
            continue;
        }

        for(let unidad = 1; unidad <= ingrediente.cantidad; unidad++) {
            capas.push({ clave: `${ingrediente.nombre} ${unidad}`, nombre: conMayuscula(ingrediente.nombre), tipo });
        }
    }

    // sort con una función de comparación: va primero la capa cuyo tipo está antes en ORDEN.
    capas.sort((una, otra) => ORDEN.indexOf(una.tipo) - ORDEN.indexOf(otra.tipo));

    // Una feta de queso arriba de cada medallón, como en una hamburguesa doble: medallón, queso, medallón, queso.
    // Las fetas que sobran van juntas arriba del último medallón.
    const medallones = capas.filter((capa) => capa.tipo === "carne" || capa.tipo === "pollo");
    const quesos = capas.filter((capa) => capa.tipo === "queso");
    const resto = capas.filter((capa) => !medallones.includes(capa) && !quesos.includes(capa));
    const apiladas = [];

    medallones.forEach((medallon, posicion) => {
        apiladas.push(medallon);

        if(posicion < quesos.length) {
            apiladas.push(quesos[posicion]);
        }
    });

    return [...apiladas, ...quesos.slice(medallones.length), ...resto];
};
