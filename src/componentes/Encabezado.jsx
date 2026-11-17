import { Link } from "react-router";

// Barra de arriba de las pantallas con sesión: el logo (lleva a la portada), la sección y el botón para salir.
// Es un componente aparte porque lo usan las pantallas de los tres roles.
function Encabezado({ seccion, alCerrarSesion }) {
    return (
        <header className="encabezado">
            {/* Link cambia de dirección sin recargar la página: es el <a> de una SPA. */}
            <Link to="/" className="logo">Burga<span>Bit</span></Link>
            <span className="seccion">{seccion}</span>
            <button className="boton-claro" onClick={alCerrarSesion}>Cerrar sesión</button>
        </header>
    );
}

export default Encabezado;
