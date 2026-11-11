import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { formatearFecha, formatearPrecio } from "../../formato.js";
import { listarIngredientes } from "../../pedidos.js";
import Estado from "../../componentes/Estado.jsx";

// Los estados de un pedido, para el filtro. Son los del modelo Orden del backend.
const ESTADOS = ["Pendiente", "En preparación", "Lista para retirar", "Entregada", "Cancelado"];

// Sección de pedidos del panel: todos los pedidos, del más nuevo al más viejo.
// El administrador los consulta, pero no los cambia: de eso se ocupan el cliente y la cocina.
function Pedidos() {
    // La lista que manda el backend y cómo va su carga.
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // El estado elegido en el filtro: "" muestra todos.
    const [filtro, setFiltro] = useState("");
    // El pedido del que se está viendo el historial, y el id del que se está pidiendo al backend.
    const [detalle, setDetalle] = useState(null);
    const [buscando, setBuscando] = useState("");

    const cargarPedidos = async () => {
        setCargando(true);
        setErrorAlCargar("");

        try {
            setPedidos(await pedirApi("/api/admin"));
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    // Al abrir la sección se pide la lista una sola vez.
    useEffect(() => {
        cargarPedidos();
    }, []);

    // Pide un pedido solo: el backend lo manda con el nombre y el rol de quien hizo cada cambio de estado.
    const verHistorial = async (id) => {
        setBuscando(id);

        try {
            setDetalle(await pedirApi(`/api/admin/${id}`));
        } catch (error) {
            alert(error.message);
        } finally {
            setBuscando("");
        }
    };

    // El historial del pedido que se está viendo: una línea por cada cambio de estado.
    const mostrarHistorial = () => (
        <>
            <ul>
                {detalle.historialEstados.map((cambio, posicion) => (
                    <li key={posicion}>
                        {formatearFecha(cambio.fecha)} · {cambio.estado}
                        {/* El primer estado, Pendiente, no tiene usuario: lo pone el backend al crear el pedido. */}
                        {cambio.usuario && ` · ${cambio.usuario.nombre} ${cambio.usuario.apellido} (${cambio.usuario.rol})`}
                        {cambio.motivo && ` · Motivo: ${cambio.motivo}`}
                    </li>
                ))}
            </ul>
            <button onClick={() => setDetalle(null)}>Ocultar historial</button>
        </>
    );

    // Qué se ve en lugar de la lista: cargando, un error, la lista vacía o una tarjeta por pedido.
    const mostrarPedidos = () => {
        // "Cargando..." solo si todavía no hay nada para mostrar: al actualizar, la lista queda en su lugar.
        if(cargando && pedidos.length === 0) {
            return <p>Cargando los pedidos... Si el servidor estaba dormido, puede tardar hasta un minuto.</p>;
        }

        if(errorAlCargar) {
            return (
                <p className="error">
                    {errorAlCargar} <button className="enlace" onClick={cargarPedidos}>Reintentar</button>
                </p>
            );
        }

        if(pedidos.length === 0) {
            return <p>Todavía no hay pedidos.</p>;
        }

        // Con filter quedan los pedidos del estado elegido; sin filtro, todos.
        const visibles = pedidos.filter((pedido) => filtro === "" || pedido.estado === filtro);

        return (
            <>
                <p>Mostrando {visibles.length} de {pedidos.length}.</p>

                {visibles.map((pedido) => (
                    <article key={pedido._id} className="tarjeta">
                        <p>
                            <strong>{formatearFecha(pedido.createdAt)}</strong> · {pedido.cliente?.nombre} {pedido.cliente?.apellido}{" "}
                            <Estado estado={pedido.estado} />
                        </p>
                        <ol>
                            {pedido.productos.map((producto) => (
                                <li key={producto._id}>
                                    {listarIngredientes(producto.ingredientes)}: {formatearPrecio(producto.subtotal)}
                                </li>
                            ))}
                        </ol>
                        <p className="total">Total: {formatearPrecio(pedido.total)}</p>

                        {detalle?._id === pedido._id ? mostrarHistorial() : (
                            <button onClick={() => verHistorial(pedido._id)} disabled={buscando === pedido._id}>
                                {buscando === pedido._id ? "Buscando..." : "Ver historial"}
                            </button>
                        )}
                    </article>
                ))}
            </>
        );
    };

    return (
        <section>
            <div className="titulo-con-boton">
                <h2>Pedidos</h2>
                <button onClick={cargarPedidos} disabled={cargando}>Actualizar</button>
            </div>
            <p>Todos los pedidos, del más nuevo al más viejo. Acá se consultan: los cambia el cliente o la cocina.</p>

            <label className="filtro">
                Mostrar
                <select value={filtro} onChange={(evento) => setFiltro(evento.target.value)}>
                    <option value="">Todos los estados</option>
                    {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                    ))}
                </select>
            </label>

            {mostrarPedidos()}
        </section>
    );
}

export default Pedidos;