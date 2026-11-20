// Banner del principio de una sección: una foto de fondo y, encima, el título y una línea de texto.
// Es un componente aparte para no repetir el mismo bloque en cada sección que lleva foto.
// descripcion es el texto alternativo de la foto (alt): lo que lee quien no puede verla.
// chico lo hace más bajo. Escribir solo chico es lo mismo que chico={true}; si no se escribe, vale false.
function Banner({ foto, descripcion, titulo, texto, chico = false }) {
    return (
        <div className={chico ? "banner banner-chico" : "banner"}>
            <img src={foto} alt={descripcion} />
            <div className="banner-texto">
                <h2>{titulo}</h2>
                <p>{texto}</p>
            </div>
        </div>
    );
}

export default Banner;
