// El aviso mientras llegan los datos del backend. "que" dice qué se está cargando, por ejemplo "los pedidos".
// Es un componente aparte porque lo usan siete pantallas.
function Cargando({ que }) {
    return <p>Cargando {que}... Si el servidor estaba dormido, puede tardar hasta un minuto.</p>;
}

export default Cargando;
