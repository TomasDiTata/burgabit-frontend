import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { MAXIMO_POR_INGREDIENTE } from "../../validaciones.js";
import { formatearPrecio, conMayuscula } from "../../formato.js";
import { subtotalDe, ingredientesDe } from "../../pedidos.js";
import { fotoDeCategoria } from "../../fotos.js";
import Cargando from "../../componentes/Cargando.jsx";
import ErrorAlCargar from "../../componentes/ErrorAlCargar.jsx";
import Banner from "../../componentes/Banner.jsx";
import Hamburguesa from "../../componentes/Hamburguesa.jsx";

// La regla de una categoría, en palabras.
const textoDeLaRegla = (categoria) => {
    if(categoria.minimo === categoria.maximo) {
        return `Elegí ${categoria.minimo}.`;
    }

    if(categoria.minimo === 0) {
        return `Es opcional: podés elegir hasta ${categoria.maximo}.`;
    }

    return `Elegí entre ${categoria.minimo} y ${categoria.maximo}.`;
};

// Qué le falta a la hamburguesa para poder agregarla al pedido. Devuelve "" si no le falta nada.
const queFalta = (faltantes, elegidos) => {
    if(faltantes.length > 0) {
        const lista = faltantes.map((categoria) => `${categoria.minimo} de ${categoria.nombre}`).join(" y ");
        return `Falta elegir ${lista}.`;
    }

    if(elegidos.length === 0) {
        return "Elegí al menos un ingrediente.";
    }

    return "";
};

// Cuántos ingredientes lleva, en palabras: "Sin ingredientes", "1 ingrediente" o "6 ingredientes".
const textoDeUnidades = (unidades) => {
    if(unidades === 0) {
        return "Sin ingredientes";
    }

    return unidades === 1 ? "1 ingrediente" : `${unidades} ingredientes`;
};

// El armador: todas las categorías en una sola pantalla, en el orden de su campo "paso".
// Cuando la hamburguesa está completa, se la pasa a la pantalla del cliente para sumarla al pedido.
function Armador({ alAgregar }) {
    const [categorias, setCategorias] = useState([]);
    const [menu, setMenu] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // Lo que lleva elegido la hamburguesa que se está armando: un array de { ingrediente, cantidad }.
    const [elegidos, setElegidos] = useState([]);
    const [aviso, setAviso] = useState("");
    // Si el resumen muestra el detalle: cada ingrediente con su precio. Se abre y se cierra tocando la cantidad.
    const [verDetalle, setVerDetalle] = useState(false);

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
        setVerDetalle(false);
        setAviso("¡Listo! La sumaste al pedido. Podés armar otra o confirmar el pedido más abajo.");
    };

    if(cargando) {
        return <Cargando que="el menú" />;
    }

    if(errorAlCargar) {
        return <ErrorAlCargar mensaje={errorAlCargar} alReintentar={cargarMenu} />;
    }

    if(categorias.length === 0) {
        return <p>Todavía no hay un menú cargado.</p>;
    }

    // Las categorías que todavía no llegan a su mínimo, y qué falta para poder agregar la hamburguesa.
    const faltantes = categorias.filter((categoria) => totalDeCategoria(categoria._id) < categoria.minimo);
    const falta = queFalta(faltantes, elegidos);
    const unidades = elegidos.reduce((suma, elegido) => suma + elegido.cantidad, 0);

    return (
        <section className="armador">
            <Banner
                foto="/img/armar.jpg"
                descripcion="Hamburguesa doble con papas fritas"
                titulo="Armá tu hamburguesa"
                texto="El pan va incluido. Elegí los ingredientes con los botones + y −."
            />

            {/* Los pasos. En la compu van a la izquierda, y el resumen con el dibujo queda fijo a la derecha. */}
            <div className="armador-pasos">
                {categorias.map((categoria, posicion) => {
                    // ?. por si un ingrediente quedó sin categoría (por ejemplo, si la borraron a mano en la base).
                    const opciones = menu.filter((ingrediente) => ingrediente.categoria?._id === categoria._id);
                    const elegidosEnLaCategoria = totalDeCategoria(categoria._id);
                    // Un paso está listo cuando ya tiene algo elegido y llegó a su mínimo: se marca en verde y con ✓.
                    const listo = elegidosEnLaCategoria > 0 && elegidosEnLaCategoria >= categoria.minimo;

                    return (
                        <article key={categoria._id} className="tarjeta paso">
                            <div className="paso-foto">
                                {/* alt vacío: la foto decora, y el nombre de la categoría ya está en el título. */}
                                <img src={fotoDeCategoria(categoria.nombre)} alt="" loading="lazy" />
                                <span className={listo ? "paso-listo" : ""}>Paso {posicion + 1}{listo && " ✓"}</span>
                            </div>

                            <div className="paso-contenido">
                                <h3>{conMayuscula(categoria.nombre)}</h3>
                                <p>{textoDeLaRegla(categoria)} Llevás {elegidosEnLaCategoria}.</p>

                                {opciones.length === 0 && <p>No hay ingredientes disponibles por ahora.</p>}

                                <ul className="opciones">
                                    {opciones.map((ingrediente) => {
                                        const cantidad = cantidadDe(ingrediente._id);
                                        // Se puede sumar si no pasa el máximo por ingrediente, el stock ni el máximo de la categoría.
                                        const puedeSumar = cantidad < MAXIMO_POR_INGREDIENTE && cantidad < ingrediente.cantidad && elegidosEnLaCategoria < categoria.maximo;

                                        return (
                                            <li key={ingrediente._id} className="opcion">
                                                <span>
                                                    {conMayuscula(ingrediente.nombre)} <span className="precio">{formatearPrecio(ingrediente.precio)}</span>
                                                </span>
                                                <span className="contador">
                                                    <button aria-label={`Quitar ${conMayuscula(ingrediente.nombre)}`} onClick={() => restar(ingrediente)} disabled={cantidad === 0}>−</button>
                                                    <span>{cantidad}</span>
                                                    <button aria-label={`Agregar ${conMayuscula(ingrediente.nombre)}`} onClick={() => sumar(ingrediente)} disabled={!puedeSumar}>+</button>
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Siempre a mano (abajo en el celu, al costado en la compu): qué lleva, cuánto cuesta y el botón para seguir. */}
            {/* El dibujo cambia con cada + y −, porque se arma con lo que hay en el estado elegidos. */}
            <div className="resumen">
                <Hamburguesa ingredientes={ingredientesDe(elegidos)} />

                <div className="resumen-cabecera">
                    <strong>Tu hamburguesa</strong>
                    {/* aria-expanded le avisa al lector de pantalla si el detalle está abierto. */}
                    <button className="cantidad" onClick={() => setVerDetalle(!verDetalle)} aria-expanded={verDetalle} disabled={unidades === 0}>
                        {textoDeUnidades(unidades)} {verDetalle ? "▴" : "▾"}
                    </button>
                </div>

                {verDetalle && unidades > 0 && (
                    <ul className="detalle">
                        {elegidos.map((elegido) => (
                            <li key={elegido.ingrediente._id}>
                                <span>{conMayuscula(elegido.ingrediente.nombre)}{elegido.cantidad > 1 && ` x${elegido.cantidad}`}</span>
                                <span>{formatearPrecio(elegido.ingrediente.precio * elegido.cantidad)}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <p className="subtotal">
                    <span>Subtotal</span>
                    <strong>{formatearPrecio(subtotalDe(elegidos))}</strong>
                </p>
                <button className="principal" onClick={agregarAlPedido} disabled={falta !== ""}>
                    Agregar al pedido
                </button>
                {falta && <p className="falta">{falta}</p>}
                {aviso && <p className="exito">{aviso}</p>}
            </div>
        </section>
    );
}

export default Armador;