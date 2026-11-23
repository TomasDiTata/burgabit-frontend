import { formatearFecha, formatearPrecio } from "../formato.js";
import { listarIngredientes } from "../pedidos.js";
import Estado from "./Estado.jsx";
import Hamburguesa from "./Hamburguesa.jsx";

// La tarjeta de un pedido: la fecha, el estado, cada hamburguesa con su foto chica al lado y el total.
// La usan "Mis pedidos", la cocina y el panel: así, un cambio en la tarjeta se hace en un solo lugar.
// pedido: el pedido como lo manda el backend.
// conCliente: agrega quién lo pidió (la cocina y el panel). conPrecios: el precio de cada hamburguesa (la cocina no lo usa).
// Escribir solo conCliente es lo mismo que conCliente={true}; si no se escribe, vale false.
// pie: lo que va al pie de la tarjeta, debajo del total. Es lo que cambia en cada pantalla: el motivo y el botón
// para cancelar (cliente), los cambios de estado (cocina) o el historial (panel). Llega como JSX, igual que el
// element de cada Route en App.jsx, y cada pantalla lo arma con su función pieDe.
function TarjetaPedido({ pedido, conCliente = false, conPrecios = false, pie }) {
    return (
        <article className="tarjeta">
            <p>
                <strong>{formatearFecha(pedido.createdAt)}</strong>
                {conCliente && <> · {pedido.cliente?.nombre} {pedido.cliente?.apellido}</>}{" "}
                <Estado estado={pedido.estado} />
            </p>

            {/* Cada hamburguesa con su foto chica al lado: se ve de un vistazo qué lleva, y en la cocina sirve como guía para armarla. */}
            <ol className="productos">
                {pedido.productos.map((producto) => (
                    <li key={producto._id}>
                        <Hamburguesa chica ingredientes={producto.ingredientes} />
                        <span>
                            {listarIngredientes(producto.ingredientes)}
                            {conPrecios && `: ${formatearPrecio(producto.subtotal)}`}
                        </span>
                    </li>
                ))}
            </ol>
            <p className="total">Total: {formatearPrecio(pedido.total)}</p>

            {pie}
        </article>
    );
}

export default TarjetaPedido;
