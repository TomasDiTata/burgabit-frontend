import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { esEnteroDesde } from "../../validaciones.js";

// Revisa un ingrediente nuevo antes de enviarlo, con las reglas del modelo Ingrediente del backend.
// También mira los ingredientes que ya existen, para no repetir el nombre.
const validar = ({ nombre, categoria, precio, cantidad }, ingredientes) => {
    const errores = {};

    if(nombre.trim() === "") {
        errores.nombre = "Ingresá el nombre.";
    } else if(ingredientes.some((ingrediente) => ingrediente.nombre === nombre.trim().toLowerCase())) {
        errores.nombre = "Ya existe un ingrediente con ese nombre.";
    }

    if(categoria === "") {
        errores.categoria = "Elegí una categoría.";
    }

    if(!esEnteroDesde(precio, 0)) {
        errores.precio = "El precio tiene que ser un número entero desde 0.";
    }

    if(!esEnteroDesde(cantidad, 0)) {
        errores.cantidad = "El stock tiene que ser un número entero desde 0.";
    }

    return errores;
};

// Sección de ingredientes del panel: la lista y el formulario para agregar uno nuevo.
function Ingredientes() {
    // Las listas que manda el backend y cómo va su carga.
    const [ingredientes, setIngredientes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // Los campos del formulario. categoria guarda el id de la categoría elegida.
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [cantidad, setCantidad] = useState("");
    // Estado del formulario.
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Pide los ingredientes y también las categorías: hacen falta para el formulario y para mostrar sus nombres.
    const cargarDatos = async () => {
        setCargando(true);
        setErrorAlCargar("");

        try {
            const listaIngredientes = await pedirApi("/api/ingredientes");
            const listaCategorias = await pedirApi("/api/categorias");
            setIngredientes(listaIngredientes);
            setCategorias(listaCategorias);
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    // Al abrir la sección se piden los datos una sola vez.
    useEffect(() => {
        cargarDatos();
    }, []);

    // El backend manda solo el id de la categoría de cada ingrediente: el nombre se busca en la lista de categorías.
    const nombreDeCategoria = (id) => categorias.find((categoria) => categoria._id === id)?.nombre ?? "(sin categoría)";

    const agregar = async (evento) => {
        evento.preventDefault();

        const erroresNuevos = validar({ nombre, categoria, precio, cantidad }, ingredientes);
        setErrores(erroresNuevos);
        setExito("");
        setMensaje("");

        if(Object.values(erroresNuevos).length > 0) {
            return;
        }

        setEnviando(true);

        try {
            const respuesta = await pedirApi("/api/ingredientes", {
                method: "POST",
                body: JSON.stringify({ nombre, categoria, precio: Number(precio), cantidad: Number(cantidad) })
            });
            setExito(respuesta.msg);
            // La categoría queda elegida: así es más rápido cargar varios ingredientes de la misma.
            setNombre("");
            setPrecio("");
            setCantidad("");
            cargarDatos();
        } catch (error) {
            setMensaje(error.message);
        } finally {
            setEnviando(false);
        }
    };

    // Qué se ve en lugar de la lista: cargando, un error, la lista vacía o la tabla.
    const mostrarLista = () => {
        if(cargando) {
            return <p>Cargando ingredientes... Si el servidor estaba dormido, puede tardar hasta un minuto.</p>;
        }

        if(errorAlCargar) {
            return (
                <p className="error">
                    {errorAlCargar} <button className="enlace" onClick={cargarDatos}>Reintentar</button>
                </p>
            );
        }

        if(ingredientes.length === 0) {
            return <p>Todavía no hay ingredientes.</p>;
        }

        return (
            <div className="tabla">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Disponible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientes.map((ingrediente) => (
                            <tr key={ingrediente._id}>
                                <td>{ingrediente.nombre}</td>
                                <td>{nombreDeCategoria(ingrediente.categoria)}</td>
                                <td>${ingrediente.precio}</td>
                                <td>{ingrediente.cantidad}</td>
                                <td>{ingrediente.isDisponible ? "Sí" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <section>
            <h2>Ingredientes</h2>
            <p>Solo aparecen en el armador los ingredientes disponibles y con stock.</p>

            {mostrarLista()}

            <h3>Nuevo ingrediente</h3>
            {!cargando && categorias.length === 0 ? (
                <p>Para agregar ingredientes, primero creá una categoría en la pestaña Categorías.</p>
            ) : (
                <form onSubmit={agregar} noValidate>
                    <label>
                        Nombre
                        <input type="text" value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
                        {errores.nombre && <span className="error">{errores.nombre}</span>}
                    </label>

                    <label>
                        Categoría
                        <select value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
                            <option value="">Elegí una categoría</option>
                            {categorias.map((opcion) => (
                                <option key={opcion._id} value={opcion._id}>{opcion.nombre}</option>
                            ))}
                        </select>
                        {errores.categoria && <span className="error">{errores.categoria}</span>}
                    </label>

                    <label>
                        Precio (en pesos)
                        <input type="number" min="0" value={precio} onChange={(evento) => setPrecio(evento.target.value)} />
                        {errores.precio && <span className="error">{errores.precio}</span>}
                    </label>

                    <label>
                        Stock (unidades)
                        <input type="number" min="0" value={cantidad} onChange={(evento) => setCantidad(evento.target.value)} />
                        {errores.cantidad && <span className="error">{errores.cantidad}</span>}
                    </label>

                    <button type="submit" disabled={enviando}>
                        {enviando ? "Agregando..." : "Agregar ingrediente"}
                    </button>
                </form>
            )}

            {exito && <p className="exito">{exito}</p>}
            {mensaje && <p className="error">{mensaje}</p>}
        </section>
    );
}

export default Ingredientes;