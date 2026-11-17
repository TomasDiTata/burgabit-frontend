// El error de una carga, con un botón para volver a intentar. Lo usan las mismas siete pantallas.
// alReintentar es la función que vuelve a pedir los datos: llega sin paréntesis, para que se ejecute recién en el clic.
function ErrorAlCargar({ mensaje, alReintentar }) {
    return (
        <p className="error">
            {mensaje} <button className="enlace" onClick={alReintentar}>Reintentar</button>
        </p>
    );
}

export default ErrorAlCargar;
