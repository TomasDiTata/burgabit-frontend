// Clase de CSS de cada estado de un pedido, para mostrarlo con su color.
const CLASE_DEL_ESTADO = {
    "Pendiente": "pendiente",
    "En preparación": "preparacion",
    "Lista para retirar": "lista",
    "Entregada": "entregada",
    "Cancelado": "cancelado"
};

// El estado de un pedido como una etiqueta de color. Lo usan el cliente y la cocina.
function Estado({ estado }) {
    return <span className={`estado ${CLASE_DEL_ESTADO[estado]}`}>{estado}</span>;
}

export default Estado;