import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { formatearFecha, formatearPrecio } from "../../formato.js";
import { listarIngredientes } from "../../pedidos.js";
import Estado from "../../componentes/Estado.jsx";
import Cargando from "../../componentes/Cargando.jsx";
import ErrorAlCargar from "../../componentes/ErrorAlCargar.jsx";
import Banner from "../../componentes/Banner.jsx";
import Hamburguesa from "../../componentes/Hamburguesa.jsx";

// Los estados de un pedido, para el filtro. Son los del modelo Orden del backend.
const ESTADOS = ["Pendiente", "En preparación", "Lista para retirar", "Entregada", "Cancelado"];

// Sección de pedidos del panel: los pedidos del estado elegido (o todos), del más nuevo al más viejo.
// El filtro lo hace el backend: solo viajan los pedidos que se van a mostrar.
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
            // El filtro viaja como parámetro de consulta, y el backend busca solo los pedidos de ese estado.
            // encodeURIComponent hace que el espacio y la tilde de "En preparación" viajen bien en la dirección.
            const ruta = filtro === "" ? "/api/admin" : `/api/admin?estado=${encodeURIComponent(filtro)}`;
            setPedidos(await pedirApi(ruta));
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    // Se piden los pedidos al abrir la sección y cada vez que cambia el filtro: por eso [filtro] y no [].
    useEffect(() => {
        cargarPedidos();
    }, [filtro]);

    // Al cambiar el filtro se vacía la lista, así no se ven los pedidos del filtro anterior mientras llegan los nuevos.
    const cambiarFiltro = (estado) => {
        setPedidos([]);
        setFiltro(estado);
    };

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
            return <Cargando que="los pedidos" />;
        }

        if(errorAlCargar) {
            return <ErrorAlCargar mensaje={errorAlCargar} alReintentar={cargarPedidos} />;
        }

        if(pedidos.length === 0) {
            return <p>{filtro === "" ? "Todavía no hay pedidos." : `No hay pedidos en estado ${filtro}.`}</p>;
        }

        // La lista ya llega filtrada del backend: se muestra tal cual.
        return (
            <>
                <p>{pedidos.length === 1 ? "1 pedido" : `${pedidos.length} pedidos`}{filtro !== "" && ` en estado ${filtro}`}.</p>

                {pedidos.map((pedido) => (
                    <article key={pedido._id} className="tarjeta">
                        <p>
                            <strong>{formatearFecha(pedido.createdAt)}</strong> · {pedido.cliente?.nombre} {pedido.cliente?.apellido}{" "}
                            <Estado estado={pedido.estado} />
                        </p>
                        {/* Cada hamburguesa con su foto chica al lado: se ve de un vistazo qué lleva. */}
                        <ol className="productos">
                            {pedido.productos.map((producto) => (
                                <li key={producto._id}>
                                    <Hamburguesa chica ingredientes={producto.ingredientes} />
                                    <span>{listarIngredientes(producto.ingredientes)}: {formatearPrecio(producto.subtotal)}</span>
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
            <Banner
                chico
                foto="/img/pedidos-panel.jpg"
                descripcion="Mesa vista desde arriba, con hamburguesas y papas fritas"
                titulo="Pedidos"
                texto="Los pedidos de todos los clientes, del más nuevo al más viejo."
            />

            <div className="titulo-con-boton">
                <p>Acá se consultan: los cambia el cliente o la cocina.</p>
                <button onClick={cargarPedidos} disabled={cargando}>Actualizar</button>
            </div>

            {/* Mientras carga, el filtro se deshabilita: así no salen dos pedidos al backend que puedan llegar cruzados. */}
            <label className="filtro">
                Mostrar
                <select value={filtro} onChange={(evento) => cambiarFiltro(evento.target.value)} disabled={cargando}>
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