import { capasDe } from "../hamburguesa.js";

// El dibujo de una hamburguesa: el pan de arriba, una capa por cada ingrediente y el pan de abajo.
// Lo usan el armador (que la va dibujando mientras se elige), el pedido, "Mis pedidos" y la cocina.
// ingredientes: objetos con nombre y cantidad. chica: la versión chica, para las listas de productos.
// aria-hidden: es solo un dibujo; los ingredientes ya están escritos al lado.
function Hamburguesa({ ingredientes, chica = false }) {
    // capasDe las da de abajo hacia arriba; se dibujan al revés, porque la página se lee de arriba hacia abajo.
    const capas = capasDe(ingredientes).reverse();

    return (
        <div className={chica ? "hamburguesa hamburguesa-chica" : "hamburguesa"} aria-hidden="true">
            <div className="pan-arriba" />
            {capas.map((capa) => (
                <div key={capa.clave} className={`capa capa-${capa.tipo}`} title={capa.nombre} />
            ))}
            <div className="pan-abajo" />
        </div>
    );
}

export default Hamburguesa;
