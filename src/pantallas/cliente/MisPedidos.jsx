import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { formatearFecha, formatearPrecio } from "../../formato.js";
import { listarIngredientes } from "../../pedidos.js";
import Estado from "../../componentes/Estado.jsx";

// Si un pedido se canceló, el motivo está en su historial de estados.
const motivoDeCancelacion = (pedido) => {
    return pedido.historialEstados.find((cambio) => cambio.estado === "Cancelado")?.motivo;
};

// Los pedidos del cliente, del más nuevo al más viejo, con su estado. Los que siguen Pendiente se pueden cancelar.
function MisPedidos({ aviso }) {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // El id del pedido que se está cancelando, para deshabilitar su botón mientras tanto.
    const [cancelando, setCancelando] = useState("");
    const [mensaje, setMensaje] = useState("");

    const cargarPedidos = async () => {
        setCargando(true);
        setErrorAlCargar("");

        try {
            setPedidos(await pedirApi("/api/cliente"));
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cancelar = async (id) => {
        // confirm muestra un cuadro del navegador con "Aceptar" y "Cancelar", y devuelve true si se aceptó.
        if(!confirm("¿Seguro que querés cancelar este pedido?")) {
            return;
        }

        setCancelando(id);
        setMensaje("");

        try {
            await pedirApi(`/api/cliente/${id}/cancelar`, { method: "PATCH" });
        } catch (error) {
            // Por ejemplo, si la cocina ya lo empezó: 'Solo se puede cancelar un pedido Pendiente (...)'.
            setMensaje(error.message);
        } finally {
            setCancelando("");
            // Salga bien o mal, se vuelve a pedir la lista para mostrar el estado actual.
            cargarPedidos();
        }
    };

    // Qué se ve: cargando, un error, la lista vacía o los pedidos.
    const mostrarPedidos = () => {
        if(cargando) {
            return <p>Cargando tus pedidos...</p>;
        }

        if(errorAlCargar) {
            return (
                <p className="error">
                    {errorAlCargar} <button className="enlace" onClick={cargarPedidos}>Reintentar</button>
                </p>
            );
        }

        if(pedidos.length === 0) {
            return <p>Todavía no hiciste ningún pedido.</p>;
        }

        return pedidos.map((pedido) => (
            <article key={pedido._id} className="tarjeta">
                <p>
                    <strong>{formatearFecha(pedido.createdAt)}</strong> <Estado estado={pedido.estado} />
                </p>
                <ol>
                    {pedido.productos.map((producto) => (
                        <li key={producto._id}>
                            {listarIngredientes(producto.ingredientes)}: {formatearPrecio(producto.subtotal)}
                        </li>
                    ))}
                </ol>
                <p className="total">Total: {formatearPrecio(pedido.total)}</p>

                {pedido.estado === "Cancelado" && <p>Motivo: {motivoDeCancelacion(pedido)}</p>}

                {pedido.estado === "Pendiente" && (
                    <button onClick={() => cancelar(pedido._id)} disabled={cancelando === pedido._id}>
                        {cancelando === pedido._id ? "Cancelando..." : "Cancelar pedido"}
                    </button>
                )}
            </article>
        ));
    };

    return (
        <section>
            <div className="titulo-con-boton">
                <h2>Mis pedidos</h2>
                <button onClick={cargarPedidos} disabled={cargando}>Actualizar</button>
            </div>
            <p>Tocá "Actualizar" para ver cómo avanzan tus pedidos en la cocina.</p>

            {aviso && <p className="exito">{aviso}</p>}
            {mensaje && <p className="error">{mensaje}</p>}

            {mostrarPedidos()}
        </section>
    );
}

export default MisPedidos;