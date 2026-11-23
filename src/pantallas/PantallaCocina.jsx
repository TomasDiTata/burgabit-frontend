import { useEffect, useState } from "react";
import { pedirApi } from "../api.js";
import Encabezado from "../componentes/Encabezado.jsx";
import Cargando from "../componentes/Cargando.jsx";
import ErrorAlCargar from "../componentes/ErrorAlCargar.jsx";
import Banner from "../componentes/Banner.jsx";
import TarjetaPedido from "../componentes/TarjetaPedido.jsx";

// Lo que puede hacer la cocina con un pedido según su estado: el texto del botón y el estado al que pasa.
// Son las mismas transiciones que permite el backend (cocineroControlador).
const SIGUIENTE_PASO = {
    "Pendiente": { texto: "Empezar a preparar", estado: "En preparación" },
    "En preparación": { texto: "Marcar como lista", estado: "Lista para retirar" },
    "Lista para retirar": { texto: "Entregar", estado: "Entregada" }
};

// Un pedido se puede cancelar mientras no esté listo.
const SE_PUEDE_CANCELAR = ["Pendiente", "En preparación"];

// Pantalla de la cocina: los pedidos activos, del más viejo al más nuevo, para irlos preparando en orden.
function PantallaCocina({ alCerrarSesion }) {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // El id del pedido que se está actualizando, para deshabilitar sus botones mientras tanto.
    const [actualizando, setActualizando] = useState("");
    const [mensaje, setMensaje] = useState("");

    const cargarPedidos = async () => {
        setCargando(true);
        setErrorAlCargar("");

        try {
            setPedidos(await pedirApi("/api/cocinero"));
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    // Manda el estado nuevo al backend y, salga bien o mal, vuelve a pedir la lista.
    const cambiarEstado = async (id, estado, motivoCancelacion) => {
        setActualizando(id);
        setMensaje("");

        try {
            await pedirApi(`/api/cocinero/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ estado, motivoCancelacion })
            });
        } catch (error) {
            // Por ejemplo, si otra persona de la cocina ya lo había cambiado.
            setMensaje(error.message);
        } finally {
            setActualizando("");
            cargarPedidos();
        }
    };

    const cancelar = (id) => {
        // prompt muestra un cuadro del navegador para escribir: devuelve el texto, o null si se tocó "Cancelar".
        const motivo = prompt("¿Por qué se cancela el pedido? Por ejemplo: se terminó el pan de papa.");

        if(motivo === null) {
            return;
        }

        // El backend exige un motivo: si está vacío, no se manda nada.
        if(motivo.trim() === "") {
            setMensaje("Para cancelar un pedido hay que escribir el motivo.");
            return;
        }

        cambiarEstado(id, "Cancelado", motivo.trim());
    };

    // Lo que va al pie de la tarjeta de un pedido: el botón para pasarlo al estado siguiente y, mientras no esté listo, el de cancelar.
    const pieDe = (pedido) => (
        <div className="acciones">
            <button
                className="principal"
                onClick={() => cambiarEstado(pedido._id, SIGUIENTE_PASO[pedido.estado].estado)}
                disabled={actualizando === pedido._id}
            >
                {actualizando === pedido._id ? "Guardando..." : SIGUIENTE_PASO[pedido.estado].texto}
            </button>
            {SE_PUEDE_CANCELAR.includes(pedido.estado) && (
                <button className="peligro" onClick={() => cancelar(pedido._id)} disabled={actualizando === pedido._id}>
                    Cancelar pedido
                </button>
            )}
        </div>
    );

    // Qué se ve: cargando, un error, la lista vacía o los pedidos.
    const mostrarPedidos = () => {
        if(cargando) {
            return <Cargando que="los pedidos" />;
        }

        if(errorAlCargar) {
            return <ErrorAlCargar mensaje={errorAlCargar} alReintentar={cargarPedidos} />;
        }

        if(pedidos.length === 0) {
            return <p>No hay pedidos activos.</p>;
        }

        // Cada pedido en su tarjeta, con el nombre de quien lo pidió y, al pie, los botones de la cocina.
        return pedidos.map((pedido) => (
            <TarjetaPedido key={pedido._id} pedido={pedido} conCliente pie={pieDe(pedido)} />
        ));
    };

    return (
        <>
            <Encabezado seccion="Cocina" alCerrarSesion={alCerrarSesion} />

            <main>
                <Banner
                    chico
                    foto="/img/cocina.jpg"
                    descripcion="Cocinero con una sartén en el fuego"
                    titulo="Pedidos activos"
                    texto="Del más viejo al más nuevo, para prepararlos en orden."
                />

                <div className="titulo-con-boton">
                    <p>Tocá "Actualizar" para ver los pedidos que van entrando.</p>
                    <button onClick={cargarPedidos} disabled={cargando}>Actualizar</button>
                </div>

                {mensaje && <p className="error">{mensaje}</p>}

                {mostrarPedidos()}
            </main>
        </>
    );
}

export default PantallaCocina;