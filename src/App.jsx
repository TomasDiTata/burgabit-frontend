import { useState } from "react";
import { guardarToken, borrarToken, leerSesion } from "./sesion.js";
import Login from "./pantallas/Login.jsx";
import Inicio from "./pantallas/Inicio.jsx";

// Decide qué pantalla mostrar: sin sesión, el login; con sesión, la pantalla de inicio.
function App() {
    // Al abrir la app se lee la sesión guardada: si el token sigue vigente, no hace falta volver a ingresar.
    const [sesion, setSesion] = useState(leerSesion());

    const iniciarSesion = (token) => {
        guardarToken(token);
        setSesion(leerSesion());
    };

    const cerrarSesion = () => {
        borrarToken();
        setSesion(null);
    };

    if(!sesion) {
        return <Login alIniciarSesion={iniciarSesion} />;
    }

    return <Inicio sesion={sesion} alCerrarSesion={cerrarSesion} />;
}

export default App;