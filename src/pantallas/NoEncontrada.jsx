import { Link } from "react-router";
import { inicioDe } from "../rutas.js";

// Para cualquier dirección que no existe: la página sigue siendo de BurgaBit y ofrece volver.
function NoEncontrada({ sesion }) {
    return (
        <main className="no-encontrada">
            <h1>Esta página no existe</h1>
            <p>Puede que la dirección esté mal escrita.</p>
            <Link to={sesion ? inicioDe(sesion.rol) : "/"} className="boton principal">Volver a BurgaBit</Link>
        </main>
    );
}

export default NoEncontrada;
