import { useState } from "react";
import Encabezado from "../componentes/Encabezado.jsx";
import Categorias from "./admin/Categorias.jsx";
import Ingredientes from "./admin/Ingredientes.jsx";
import Usuarios from "./admin/Usuarios.jsx";
import Pedidos from "./admin/Pedidos.jsx";

// Pantalla del administrador, con una pestaña por sección.
function PanelAdmin({ alCerrarSesion }) {
    // Qué pestaña se ve. Arranca en categorías porque cada ingrediente necesita una.
    const [seccion, setSeccion] = useState("categorias");

    return (
        <main>
            <Encabezado seccion="Administración" alCerrarSesion={alCerrarSesion} />

            <nav className="pestanas">
                <button className={seccion === "categorias" ? "activa" : ""} onClick={() => setSeccion("categorias")}>
                    Categorías
                </button>
                <button className={seccion === "ingredientes" ? "activa" : ""} onClick={() => setSeccion("ingredientes")}>
                    Ingredientes
                </button>
                                <button className={seccion === "usuarios" ? "activa" : ""} onClick={() => setSeccion("usuarios")}>
                    Usuarios
                </button>
                                <button className={seccion === "pedidos" ? "activa" : ""} onClick={() => setSeccion("pedidos")}>
                    Pedidos
                </button>
            </nav>

            {seccion === "categorias" && <Categorias />}
            {seccion === "ingredientes" && <Ingredientes />}
            {seccion === "usuarios" && <Usuarios />}
            {seccion === "pedidos" && <Pedidos />}
        </main>
    );
}

export default PanelAdmin;