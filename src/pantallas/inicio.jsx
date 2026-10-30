import { useState } from "react";
import { pedirApi } from "../api.js";

// Cómo se muestra cada rol en pantalla.
const NOMBRE_ROL = {
    cliente: "Cliente",
    cocinero: "Cocina",
    administrador: "Administración"
};

// Pantalla provisoria después de iniciar sesión: muestra el rol y permite comprobar que el token viaja en las peticiones.
// En los próximos pasos se reemplaza por la pantalla de cada rol.
function Inicio({ sesion, alCerrarSesion }) {
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const probarSesion = async () => {
        setCargando(true);
        setMensaje("");

        try {
            // Ruta protegida: si el token no llega o no es válido, el backend responde 401.
            const categorias = await pedirApi("/api/categorias");
            setMensaje(`Tu sesión funciona: el servidor te mostró ${categorias.length} categorías.`);
        } catch (error) {
            setMensaje(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <main>
            <header className="encabezado">
                <strong>BurgaBit · {NOMBRE_ROL[sesion.rol]}</strong>
                <button onClick={alCerrarSesion}>Cerrar sesión</button>
            </header>

            <h1>¡Hola!</h1>
            <p>Tu sección: <strong>{NOMBRE_ROL[sesion.rol]}</strong>.</p>

            <button onClick={probarSesion} disabled={cargando}>
                Probar mi sesión
            </button>

            {cargando && <p>Cargando...</p>}
            {mensaje && <p>{mensaje}</p>}
        </main>
    );
}

export default Inicio;