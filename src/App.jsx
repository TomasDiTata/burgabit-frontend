import { useState } from "react";
import { pedirApi } from "./api.js";

// Pantalla de prueba: confirma que el frontend llega a la API. Se reemplaza en el próximo paso.
function App() {
    // Estado de la petición: si está cargando y qué mensaje mostrar.
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const probarConexion = async () => {
        setCargando(true);
        setMensaje("");

        try {
            // Pide el menú sin token: si la conexión funciona, el backend responde 401 "Token inexistente.".
            await pedirApi("/api/ingredientes/menu");
            setMensaje("El servidor respondió con datos.");
        } catch (error) {
            setMensaje(error.message);
        } finally {
            // Salga bien o mal, se deja de mostrar "Cargando...".
            setCargando(false);
        }
    };

    return (
        <main>
            <h1>BurgaBit</h1>
            <button onClick={probarConexion} disabled={cargando}>
                Probar conexión con la API
            </button>

            {cargando && <p>Cargando... Si el servidor estaba dormido, puede tardar hasta un minuto.</p>}
            {mensaje && <p>{mensaje}</p>}
        </main>
    );
}

export default App;