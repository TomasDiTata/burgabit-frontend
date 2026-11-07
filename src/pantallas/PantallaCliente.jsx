import { useState } from "react";
import Encabezado from "../componentes/Encabezado.jsx";
import Armador from "./cliente/Armador.jsx";
import Pedido from "./cliente/Pedido.jsx";
import MisPedidos from "./cliente/MisPedidos.jsx";

// Pantalla del cliente: armar un pedido (uno o varios productos) y seguir sus pedidos.
function PantallaCliente({ alCerrarSesion }) {
    const [seccion, setSeccion] = useState("armar");
    // Los productos ya armados que todavía no se confirmaron. Están acá y no en el armador
    // para que no se pierdan al ir a "Mis pedidos" y volver.
    const [carrito, setCarrito] = useState([]);
    // Mensaje para mostrar en "Mis pedidos" después de confirmar un pedido.
    const [aviso, setAviso] = useState("");

    const irA = (seccionNueva) => {
        setSeccion(seccionNueva);
        setAviso("");
    };

    // El carrito tampoco se modifica: cada cambio arma un array nuevo.
    const agregarProducto = (producto) => {
        setCarrito([...carrito, producto]);
    };

    const quitarProducto = (posicion) => {
        setCarrito(carrito.filter((producto, indice) => indice !== posicion));
    };

    const pedidoConfirmado = () => {
        setCarrito([]);
        setAviso("¡Pedido confirmado! Acá podés ver cómo avanza.");
        setSeccion("pedidos");
    };

    return (
        <main>
            <Encabezado seccion="Cliente" alCerrarSesion={alCerrarSesion} />

            <nav className="pestanas">
                <button className={seccion === "armar" ? "activa" : ""} onClick={() => irA("armar")}>
                    Armar pedido
                </button>
                <button className={seccion === "pedidos" ? "activa" : ""} onClick={() => irA("pedidos")}>
                    Mis pedidos
                </button>
            </nav>

            {seccion === "armar" && (
                <>
                    <Armador alAgregar={agregarProducto} />
                    <Pedido productos={carrito} alQuitar={quitarProducto} alConfirmar={pedidoConfirmado} />
                </>
            )}
            {seccion === "pedidos" && <MisPedidos aviso={aviso} />}
        </main>
    );
}

export default PantallaCliente;