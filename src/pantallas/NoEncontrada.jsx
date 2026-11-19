import { Link } from "react-router";
import { inicioDe } from "../rutas.js";

// Para cualquier dirección que no existe: la página sigue siendo de BurgaBit y ofrece volver.
function NoEncontrada({ sesion }) {
    return (
        <main className="no-encontrada">
            <img src="/img/hamburguesa.jpg" alt="" />
            <h1>Esta página se la comieron</h1>
            <p>La dirección no existe o está mal escrita.</p>
            <Link to={sesion ? inicioDe(sesion.rol) : "/"} className="boton principal">Volver a BurgaBit</Link>
        </main>
    );
}

export default NoEncontrada;
