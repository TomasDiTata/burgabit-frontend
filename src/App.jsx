import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { guardarToken, borrarToken, leerSesion } from "./sesion.js";
import { inicioDe } from "./rutas.js";
import Login from "./pantallas/Login.jsx";
import Registro from "./pantallas/Registro.jsx";
import PanelAdmin from "./pantallas/PanelAdmin.jsx";
import PantallaCliente from "./pantallas/PantallaCliente.jsx";
import PantallaCocina from "./pantallas/PantallaCocina.jsx";
import NoEncontrada from "./pantallas/NoEncontrada.jsx";

// Las rutas de la app: qué pantalla se ve en cada dirección.
// Además guarda la sesión y protege las pantallas de cada rol.
function App() {
    // Al abrir la app se lee la sesión guardada: si el token sigue vigente, no hace falta volver a ingresar.
    const [sesion, setSesion] = useState(leerSesion());
    // navigate cambia de dirección desde el código, por ejemplo después de ingresar.
    const navigate = useNavigate();

    const iniciarSesion = (token) => {
        guardarToken(token);
        const sesionNueva = leerSesion();
        setSesion(sesionNueva);
        // replace: el ingreso se reemplaza en el historial, así "Atrás" no vuelve al formulario.
        navigate(inicioDe(sesionNueva.rol), { replace: true });
    };

    const cerrarSesion = () => {
        borrarToken();
        setSesion(null);
        navigate("/ingresar", { replace: true });
    };

    // Una pantalla con sesión: sin sesión, manda al ingreso; con otro rol, a la pantalla de su rol.
    // Es solo para la navegación: los permisos los sigue controlando el backend en cada pedido.
    const soloPara = (rol, pantalla) => {
        if(!sesion) {
            return <Navigate to="/ingresar" replace />;
        }

        if(sesion.rol !== rol) {
            return <Navigate to={inicioDe(sesion.rol)} replace />;
        }

        return pantalla;
    };

    // El ingreso y el registro son para quien todavía no entró: con sesión, manda a la pantalla de su rol.
    const sinSesion = (pantalla) => (sesion ? <Navigate to={inicioDe(sesion.rol)} replace /> : pantalla);

    return (
        <Routes>
            {/* La raíz manda a la pantalla del rol, o al ingreso si no hay sesión. */}
            <Route path="/" element={<Navigate to={sesion ? inicioDe(sesion.rol) : "/ingresar"} replace />} />
            <Route path="/ingresar" element={sinSesion(<Login alIniciarSesion={iniciarSesion} />)} />
            <Route path="/registro" element={sinSesion(<Registro alIniciarSesion={iniciarSesion} />)} />
            {/* El "/*" deja que la pantalla tenga sus propias rutas adentro, como /cliente/armar y /cliente/pedidos. */}
            <Route path="/cliente/*" element={soloPara("cliente", <PantallaCliente alCerrarSesion={cerrarSesion} />)} />
            <Route path="/cocina" element={soloPara("cocinero", <PantallaCocina alCerrarSesion={cerrarSesion} />)} />
            <Route path="/admin/*" element={soloPara("administrador", <PanelAdmin alCerrarSesion={cerrarSesion} />)} />
            {/* Cualquier otra dirección: una página de BurgaBit que avisa que no existe. */}
            <Route path="*" element={<NoEncontrada sesion={sesion} />} />
        </Routes>
    );
}

export default App;
