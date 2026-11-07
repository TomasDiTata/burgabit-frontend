import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { MAXIMO_POR_INGREDIENTE } from "../../validaciones.js";
import { formatearPrecio } from "../../formato.js";
import { subtotalDe, describirProducto } from "../../pedidos.js";

// La regla de un paso, en palabras.
const textoDeLaRegla = (categoria) => {
    if(categoria.minimo === categoria.maximo) {
        return `Elegí ${categoria.minimo}.`;
    }

    if(categoria.minimo === 0) {
        return `Es opcional: podés elegir hasta ${categoria.maximo}.`;
    }

    return `Elegí entre ${categoria.minimo} y ${categoria.maximo}.`;
};

// El armador paso a paso: una categoría por paso, en el orden de su campo "paso".
// Cuando el producto está completo, se lo pasa a la pantalla del cliente para sumarlo al pedido.
function Armador({ alAgregar }) {
    const [categorias, setCategorias] = useState([]);
    const [menu, setMenu] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // pasoActual es la posición en la lista de categorías (0 es la primera), no el campo "paso".
    const [pasoActual, setPasoActual] = useState(0);
    // Lo que lleva elegido el producto que se está armando: un array de { ingrediente, cantidad }.
    const [elegidos, setElegidos] = useState([]);
    const [aviso, setAviso] = useState("");

    // Pide las categorías (todas, ordenadas por paso) y el menú (solo los ingredientes disponibles y con stock).
    const cargarMenu = async () => {
        setCargando(true);
        setErrorAlCargar("");

        try {
            const listaCategorias = await pedirApi("/api/categorias");
            const listaMenu = await pedirApi("/api/ingredientes/menu");
            setCategorias(listaCategorias);
            setMenu(listaMenu);
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMenu();
    }, []);

    // Cuántas unidades lleva de un ingrediente, y cuántas en total de una categoría.
    const cantidadDe = (id) => elegidos.find((elegido) => elegido.ingrediente._id === id)?.cantidad ?? 0;
    const totalDeCategoria = (id) => elegidos
        .filter((elegido) => elegido.ingrediente.categoria._id === id)
        .reduce((suma, elegido) => suma + elegido.cantidad, 0);

    // Sumar y restar arman siempre un array nuevo: el estado no se modifica, se reemplaza.
    const sumar = (ingrediente) => {
        setAviso("");

        if(cantidadDe(ingrediente._id) === 0) {
            setElegidos([...elegidos, { ingrediente, cantidad: 1 }]);
        } else {
            setElegidos(elegidos.map((elegido) =>
                elegido.ingrediente._id === ingrediente._id ? { ...elegido, cantidad: elegido.cantidad + 1 } : elegido
            ));
        }
    };

    const restar = (ingrediente) => {
        setElegidos(elegidos
            .map((elegido) =>
                elegido.ingrediente._id === ingrediente._id ? { ...elegido, cantidad: elegido.cantidad - 1 } : elegido
            )
            .filter((elegido) => elegido.cantidad > 0));
    };

    const agregarAlPedido = () => {
        alAgregar(elegidos);
        setElegidos([]);
        setPasoActual(0);
        setAviso("¡Listo! Lo sumaste al pedido. Podés armar otro o confirmar el pedido más abajo.");
    };

    if(cargando) {
        return <p>Cargando el menú... Si el servidor estaba dormido, puede tardar hasta un minuto.</p>;
    }

    if(errorAlCargar) {
        return (
            <p className="error">
                {errorAlCargar} <button className="enlace" onClick={cargarMenu}>Reintentar</button>
            </p>
        );
    }

    if(categorias.length === 0) {
        return <p>Todavía no hay un menú cargado.</p>;
    }

    const categoria = categorias[pasoActual];
    const opciones = menu.filter((ingrediente) => ingrediente.categoria._id === categoria._id);
    const elegidosEnElPaso = totalDeCategoria(categoria._id);
    const esElUltimo = pasoActual === categorias.length - 1;
    // Para pasar de paso hay que llegar al mínimo de la categoría; para agregar, cumplir el de todas.
    const puedeSeguir = elegidosEnElPaso >= categoria.minimo;
    const estaCompleto = elegidos.length > 0 && categorias.every((cada) => totalDeCategoria(cada._id) >= cada.minimo);

    return (
        <section>
            <h2>Paso {pasoActual + 1} de {categorias.length}: {categoria.nombre}</h2>
            <p>{textoDeLaRegla(categoria)} Llevás {elegidosEnElPaso}.</p>

            {opciones.length === 0 && <p>No hay ingredientes disponibles en este paso por ahora.</p>}

            <ul className="opciones">
                {opciones.map((ingrediente) => {
                    const cantidad = cantidadDe(ingrediente._id);
                    // Se puede sumar si no pasa el máximo por ingrediente, el stock ni el máximo de la categoría.
                    const puedeSumar = cantidad < MAXIMO_POR_INGREDIENTE && cantidad < ingrediente.cantidad && elegidosEnElPaso < categoria.maximo;

                    return (
                        <li key={ingrediente._id} className="opcion">
                            <span>
                                {ingrediente.nombre} <small>{formatearPrecio(ingrediente.precio)}</small>
                            </span>
                            <span className="contador">
                                <button aria-label={`Quitar ${ingrediente.nombre}`} onClick={() => restar(ingrediente)} disabled={cantidad === 0}>-</button>
                                <span>{cantidad}</span>
                                <button aria-label={`Agregar ${ingrediente.nombre}`} onClick={() => sumar(ingrediente)} disabled={!puedeSumar}>+</button>
                            </span>
                        </li>
                    );
                })}
            </ul>

            <div className="navegacion">
                <button onClick={() => setPasoActual(pasoActual - 1)} disabled={pasoActual === 0}>
                    Anterior
                </button>
                {esElUltimo ? (
                    <button onClick={agregarAlPedido} disabled={!estaCompleto}>Agregar al pedido</button>
                ) : (
                    <button onClick={() => setPasoActual(pasoActual + 1)} disabled={!puedeSeguir}>Siguiente</button>
                )}
            </div>
            {!puedeSeguir && <p>Para seguir, elegí al menos {categoria.minimo}.</p>}

            <div className="resumen">
                <strong>Lo que vas armando:</strong> {elegidos.length === 0 ? "todavía nada." : describirProducto(elegidos)}
                <br />
                Subtotal: {formatearPrecio(subtotalDe(elegidos))}
            </div>

            {aviso && <p className="exito">{aviso}</p>}
        </section>
    );
}

export default Armador;