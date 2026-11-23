import { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router";
import { clasePestana } from "../rutas.js";
import { guardarCarrito, leerCarrito } from "../carrito.js";
import Encabezado from "../componentes/Encabezado.jsx";
import Armador from "./cliente/Armador.jsx";
import Pedido from "./cliente/Pedido.jsx";
import MisPedidos from "./cliente/MisPedidos.jsx";

// Pantalla del cliente: armar un pedido (uno o varios productos) y seguir sus pedidos.
// Cada sección tiene su dirección: /cliente/armar y /cliente/pedidos.
// sesion: la sesión del cliente ({ id, rol }). Con el id, su carrito se guarda aparte del de otras cuentas.
function PantallaCliente({ sesion, alCerrarSesion }) {
    // Los productos ya armados que todavía no se confirmaron. Están acá y no en el armador
    // para que no se pierdan al ir a "Mis pedidos" y volver: esta pantalla no se desmonta al cambiar de sección.
    // Arranca con el carrito guardado en el navegador, así tampoco se pierde al recargar la página.
    const [carrito, setCarrito] = useState(leerCarrito(sesion.id));
    // Mensaje para mostrar en "Mis pedidos" después de confirmar un pedido.
    const [aviso, setAviso] = useState("");
    const navigate = useNavigate();

    // Cada vez que cambia el carrito (se suma o se quita un producto, o se confirma el pedido), se guarda en el navegador.
    // En la lista va lo que el efecto usa: el id y el carrito. El id no cambia mientras la pantalla está abierta,
    // así que el efecto corre al abrir la pantalla y después de cada cambio del carrito.
    useEffect(() => {
        guardarCarrito(sesion.id, carrito);
    }, [sesion.id, carrito]);

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
        navigate("/cliente/pedidos");
    };

    return (
        <>
            <Encabezado seccion="Cliente" alCerrarSesion={alCerrarSesion} />

            <main>
                <nav className="pestanas">
                    <NavLink to="/cliente/armar" className={clasePestana} onClick={() => setAviso("")}>
                        Armar pedido{carrito.length > 0 && ` (${carrito.length})`}
                    </NavLink>
                    <NavLink to="/cliente/pedidos" className={clasePestana} onClick={() => setAviso("")}>
                        Mis pedidos
                    </NavLink>
                </nav>

                {/* Las rutas de adentro: el "/*" de App deja que esta pantalla decida qué sección se ve. */}
                <Routes>
                    <Route path="armar" element={
                        <>
                            <Armador alAgregar={agregarProducto} />
                            <Pedido productos={carrito} alQuitar={quitarProducto} alConfirmar={pedidoConfirmado} />
                        </>
                    } />
                    <Route path="pedidos" element={<MisPedidos aviso={aviso} />} />
                    {/* /cliente sola, o una sección que no existe: va a armar. */}
                    <Route path="*" element={<Navigate to="/cliente/armar" replace />} />
                </Routes>
            </main>
        </>
    );
}

export default PantallaCliente;
