import { Navigate, NavLink, Route, Routes } from "react-router";
import { clasePestana } from "../rutas.js";
import Encabezado from "../componentes/Encabezado.jsx";
import Categorias from "./admin/Categorias.jsx";
import Ingredientes from "./admin/Ingredientes.jsx";
import Usuarios from "./admin/Usuarios.jsx";
import Pedidos from "./admin/Pedidos.jsx";

// Pantalla del administrador, con una pestaña por sección.
// Cada sección tiene su dirección: /admin/categorias, /admin/ingredientes, /admin/usuarios y /admin/pedidos.
function PanelAdmin({ alCerrarSesion }) {
    return (
        <>
            <Encabezado seccion="Administración" alCerrarSesion={alCerrarSesion} />

            <main>
                <nav className="pestanas">
                    <NavLink to="/admin/categorias" className={clasePestana}>Categorías</NavLink>
                    <NavLink to="/admin/ingredientes" className={clasePestana}>Ingredientes</NavLink>
                    <NavLink to="/admin/usuarios" className={clasePestana}>Usuarios</NavLink>
                    <NavLink to="/admin/pedidos" className={clasePestana}>Pedidos</NavLink>
                </nav>

                {/* Las rutas de adentro: el "/*" de App deja que el panel decida qué sección se ve. */}
                <Routes>
                    <Route path="categorias" element={<Categorias />} />
                    <Route path="ingredientes" element={<Ingredientes />} />
                    <Route path="usuarios" element={<Usuarios />} />
                    <Route path="pedidos" element={<Pedidos />} />
                    {/* /admin sola, o una sección que no existe: va a categorías, porque cada ingrediente necesita una. */}
                    <Route path="*" element={<Navigate to="/admin/categorias" replace />} />
                </Routes>
            </main>
        </>
    );
}

export default PanelAdmin;
