import { capasDe } from "../hamburguesa.js";

// La hamburguesa armada con fotos: el pan de abajo, una capa por cada ingrediente y el pan de arriba.
// Cada capa es una foto recortada, con fondo transparente (public/img/capas). Se apilan de abajo hacia arriba,
// y cada una se apoya un poco sobre la de abajo, como en una hamburguesa de verdad (los márgenes están en index.css).
// La usan el armador (que la va armando mientras se elige), el pedido, "Mis pedidos", la cocina y el panel.
// ingredientes: objetos con nombre y cantidad. chica: la versión chica, para las listas de productos.
// aria-hidden y alt vacío: son solo fotos; los ingredientes ya están escritos al lado.
function Hamburguesa({ ingredientes, chica = false }) {
    const capas = capasDe(ingredientes);

    // zIndex: cuanto más arriba en la hamburguesa, más alto el número, así cada foto tapa a la de abajo
    // (el queso cae sobre la carne, el pan tapa la lechuga). Sin esto, cada navegador las pinta en otro orden.
    return (
        <div className={chica ? "hamburguesa hamburguesa-chica" : "hamburguesa"} aria-hidden="true">
            <img className="pan pan-abajo" src="/img/capas/pan-abajo.webp" alt="" />
            {capas.map((capa, posicion) => (
                <img
                    key={capa.clave}
                    className={`capa capa-${capa.tipo}`}
                    src={`/img/capas/${capa.tipo}.webp`}
                    alt=""
                    title={capa.nombre}
                    style={{ zIndex: posicion + 1 }}
                />
            ))}
            <img className="pan pan-arriba" src="/img/capas/pan-arriba.webp" alt="" style={{ zIndex: capas.length + 1 }} />
        </div>
    );
}

export default Hamburguesa;
