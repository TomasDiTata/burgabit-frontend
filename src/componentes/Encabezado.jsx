// Barra de arriba de las pantallas con sesión: el nombre de la sección y el botón para salir.
// Es un componente aparte porque lo usan todas las pantallas de los roles.
function Encabezado({ seccion, alCerrarSesion }) {
    return (
        <header className="encabezado">
            <strong>BurgaBit · {seccion}</strong>
            <button onClick={alCerrarSesion}>Cerrar sesión</button>
        </header>
    );
}

export default Encabezado;