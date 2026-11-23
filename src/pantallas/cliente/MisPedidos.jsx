import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import Cargando from "../../componentes/Cargando.jsx";
import ErrorAlCargar from "../../componentes/ErrorAlCargar.jsx";
import Banner from "../../componentes/Banner.jsx";
import TarjetaPedido from "../../componentes/TarjetaPedido.jsx";

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

    // Lo que va al pie de la tarjeta de un pedido: el motivo, si se canceló, y el botón para cancelarlo mientras sigue Pendiente.
    // <> y </> agrupan los dos sin agregar otra etiqueta.
    const pieDe = (pedido) => (
        <>
            {pedido.estado === "Cancelado" && <p>Motivo: {motivoDeCancelacion(pedido)}</p>}

            {pedido.estado === "Pendiente" && (
                <button className="peligro" onClick={() => cancelar(pedido._id)} disabled={cancelando === pedido._id}>
                    {cancelando === pedido._id ? "Cancelando..." : "Cancelar pedido"}
                </button>
            )}
        </>
    );

    // Qué se ve: cargando, un error, la lista vacía o los pedidos.
    const mostrarPedidos = () => {
        if(cargando) {
            return <Cargando que="tus pedidos" />;
        }

        if(errorAlCargar) {
            return <ErrorAlCargar mensaje={errorAlCargar} alReintentar={cargarPedidos} />;
        }

        if(pedidos.length === 0) {
            return <p>Todavía no hiciste ningún pedido.</p>;
        }

        // Cada pedido en su tarjeta, con el precio de cada hamburguesa y, al pie, lo propio del cliente.
        return pedidos.map((pedido) => (
            <TarjetaPedido key={pedido._id} pedido={pedido} conPrecios pie={pieDe(pedido)} />
        ));
    };

    return (
        <section>
            <Banner
                chico
                foto="/img/pedidos.jpg"
                descripcion="Hamburguesa con papas fritas"
                titulo="Mis pedidos"
                texto="Seguí cómo avanzan en la cocina."
            />

            <div className="titulo-con-boton">
                <p>Tocá "Actualizar" para ver el estado más reciente.</p>
                <button onClick={cargarPedidos} disabled={cargando}>Actualizar</button>
            </div>

            {aviso && <p className="exito">{aviso}</p>}
            {mensaje && <p className="error">{mensaje}</p>}

            {mostrarPedidos()}
        </section>
    );
}

export default MisPedidos;