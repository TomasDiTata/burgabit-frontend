import { useState } from "react";
import { pedirApi } from "../../api.js";
import { formatearPrecio } from "../../formato.js";
import { subtotalDe, describirProducto } from "../../pedidos.js";

// El pedido que se está armando: los productos listos, el total y el botón para confirmarlo.
function Pedido({ productos, alQuitar, alConfirmar }) {
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const total = productos.reduce((suma, producto) => suma + subtotalDe(producto), 0);

    const confirmar = async () => {
        setEnviando(true);
        setMensaje("");

        try {
            // El backend espera cada producto como una lista de { ingrediente: id, cantidad }.
            await pedirApi("/api/cliente", {
                method: "POST",
                body: JSON.stringify({
                    productos: productos.map((producto) => ({
                        ingredientes: producto.map((elegido) => ({ ingrediente: elegido.ingrediente._id, cantidad: elegido.cantidad }))
                    }))
                })
            });
            alConfirmar();
        } catch (error) {
            // Por ejemplo: 'Stock insuficiente de "medallón de carne".'
            setMensaje(error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="pedido-actual">
            <h2>Tu pedido</h2>

            {productos.length === 0 ? (
                <p>Todavía no agregaste nada. Armá tu hamburguesa paso a paso y sumala al pedido.</p>
            ) : (
                <>
                    <ol>
                        {productos.map((producto, posicion) => (
                            <li key={posicion}>
                                {describirProducto(producto)}: {formatearPrecio(subtotalDe(producto))}{" "}
                                <button className="enlace" onClick={() => alQuitar(posicion)}>Quitar</button>
                            </li>
                        ))}
                    </ol>
                    <p className="total">Total: {formatearPrecio(total)}</p>
                    <button onClick={confirmar} disabled={enviando}>
                        {enviando ? "Confirmando..." : "Confirmar pedido"}
                    </button>
                </>
            )}

            {mensaje && <p className="error">{mensaje}</p>}
        </section>
    );
}

export default Pedido;