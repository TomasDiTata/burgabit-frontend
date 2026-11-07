import { useState } from "react";
import { guardarToken, borrarToken, leerSesion } from "./sesion.js";
import Login from "./pantallas/Login.jsx";
import Registro from "./pantallas/Registro.jsx";
import PanelAdmin from "./pantallas/PanelAdmin.jsx";
import PantallaCliente from "./pantallas/PantallaCliente.jsx";
import PantallaCocina from "./pantallas/PantallaCocina.jsx";

// Decide qué pantalla mostrar: sin sesión, el login o el registro; con sesión, la de cada rol.
function App() {
    // Al abrir la app se lee la sesión guardada: si el token sigue vigente, no hace falta volver a ingresar.
    const [sesion, setSesion] = useState(leerSesion());
    // Sin sesión, indica cuál de las dos pantallas se ve: false es el login y true, el registro.
    const [verRegistro, setVerRegistro] = useState(false);

    const iniciarSesion = (token) => {
        guardarToken(token);
        setSesion(leerSesion());
    };

    const cerrarSesion = () => {
        borrarToken();
        setSesion(null);
        // Al salir se vuelve siempre al login, aunque se haya entrado desde el registro.
        setVerRegistro(false);
    };

    if(!sesion) {
        if(verRegistro) {
            return <Registro alIniciarSesion={iniciarSesion} alIrAlLogin={() => setVerRegistro(false)} />;
        }
        return <Login alIniciarSesion={iniciarSesion} alIrAlRegistro={() => setVerRegistro(true)} />;
    }

    // Cada rol ve su pantalla.
    if(sesion.rol === "administrador") {
        return <PanelAdmin alCerrarSesion={cerrarSesion} />;
    }

    if(sesion.rol === "cliente") {
        return <PantallaCliente alCerrarSesion={cerrarSesion} />;
    }

    // El rol que queda es el de cocinero.
    return <PantallaCocina alCerrarSesion={cerrarSesion} />;
}

export default App;