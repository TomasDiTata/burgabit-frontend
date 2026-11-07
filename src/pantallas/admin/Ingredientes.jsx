import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { esEnteroDesde, SOLO_LETRAS } from "../../validaciones.js";
import { formatearPrecio } from "../../formato.js";

// Revisa un ingrediente antes de enviarlo, con las reglas del modelo Ingrediente del backend.
// "otros" son los demás ingredientes, para no repetir el nombre.
// Al editar solo se cambian el nombre y el precio: la categoría y el stock llegan como undefined y no se revisan.
const validar = ({ nombre, categoria, precio, cantidad }, otros) => {
    const errores = {};

    if(nombre.trim() === "") {
        errores.nombre = "Ingresá el nombre.";
    } else if(!SOLO_LETRAS.test(nombre)) {
        errores.nombre = "El nombre solo puede tener letras y espacios.";
    } else if(otros.some((ingrediente) => ingrediente.nombre === nombre.trim().toLowerCase())) {
        errores.nombre = "Ya existe un ingrediente con ese nombre.";
    }

    if(categoria === "") {
        errores.categoria = "Elegí una categoría.";
    }

    if(!esEnteroDesde(precio, 0)) {
        errores.precio = "El precio tiene que ser un número entero desde 0.";
    }

    if(cantidad !== undefined && !esEnteroDesde(cantidad, 0)) {
        errores.cantidad = "El stock tiene que ser un número entero desde 0.";
    }

    return errores;
};

// Sección de ingredientes del panel: la lista, con lo que se puede hacer con cada uno, y el formulario para agregar uno nuevo.
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
    // El ingrediente que se está editando (su id, o "" si ninguno) y los campos de su formulario.
    const [editando, setEditando] = useState("");
    const [nombreEditado, setNombreEditado] = useState("");
    const [precioEditado, setPrecioEditado] = useState("");
    const [erroresEdicion, setErroresEdicion] = useState({});
    // El id del ingrediente que se está guardando, para mostrar "Guardando..." en su tarjeta.
    const [actualizando, setActualizando] = useState("");

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

    // Manda un cambio de un ingrediente. Mientras tanto, su tarjeta dice "Guardando...".
    // Salga bien o mal, se vuelve a pedir la lista, para ver lo que quedó guardado en la base.
    const cambiar = async (id, ruta, opciones) => {
        setActualizando(id);

        try {
            await pedirApi(ruta, opciones);
        } catch (error) {
            alert(error.message);
        } finally {
            setActualizando("");
            cargarDatos();
        }
    };

    // Abre el formulario de edición en la tarjeta del ingrediente, con sus datos actuales.
    const empezarEdicion = (ingrediente) => {
        setEditando(ingrediente._id);
        setNombreEditado(ingrediente.nombre);
        setPrecioEditado(String(ingrediente.precio));
        setErroresEdicion({});
    };

    const guardarEdicion = (evento) => {
        evento.preventDefault();

        // Se compara con los demás: el ingrediente que se edita puede quedarse con su nombre.
        const otros = ingredientes.filter((ingrediente) => ingrediente._id !== editando);
        const erroresNuevos = validar({ nombre: nombreEditado, precio: precioEditado }, otros);
        setErroresEdicion(erroresNuevos);

        if(Object.values(erroresNuevos).length > 0) {
            return;
        }

        cambiar(editando, `/api/ingredientes/${editando}`, {
            method: "PATCH",
            body: JSON.stringify({ nombre: nombreEditado, precio: Number(precioEditado) })
        });
        setEditando("");
    };

    // Suma al stock lo que llegó. El backend lo suma a lo que hay en la base ($inc), sin pisar lo que se vendió mientras tanto.
    const sumarStock = (ingrediente) => {
        const texto = prompt(`¿Cuántas unidades de ${ingrediente.nombre} llegaron? Se suman a las ${ingrediente.cantidad} que hay.`);

        if(texto === null) {
            return;
        }

        if(!esEnteroDesde(texto, 1)) {
            alert("Para sumar stock, escribí un número entero desde 1.");
            return;
        }

        cambiar(ingrediente._id, `/api/ingredientes/${ingrediente._id}/stock`, {
            method: "PATCH",
            body: JSON.stringify({ cantidad: Number(texto) })
        });
    };

    // Pausar es la baja lógica del backend (DELETE): el ingrediente sale del menú, pero sigue en la base.
    // Reactivarlo es un PATCH con isDisponible en true.
    const cambiarDisponible = (ingrediente) => {
        if(ingrediente.isDisponible) {
            cambiar(ingrediente._id, `/api/ingredientes/${ingrediente._id}`, { method: "DELETE" });
        } else {
            cambiar(ingrediente._id, `/api/ingredientes/${ingrediente._id}`, {
                method: "PATCH",
                body: JSON.stringify({ isDisponible: true })
            });
        }
    };

    // El formulario de edición, que aparece en la tarjeta del ingrediente que se está editando.
    const formularioDeEdicion = () => (
        <form onSubmit={guardarEdicion} noValidate>
            <label>
                Nombre
                <input type="text" value={nombreEditado} onChange={(evento) => setNombreEditado(evento.target.value)} />
                {erroresEdicion.nombre && <span className="error">{erroresEdicion.nombre}</span>}
            </label>

            <label>
                Precio (en pesos)
                <input type="number" min="0" value={precioEditado} onChange={(evento) => setPrecioEditado(evento.target.value)} />
                {erroresEdicion.precio && <span className="error">{erroresEdicion.precio}</span>}
            </label>

            <div className="acciones">
                <button type="submit" className="principal">Guardar cambios</button>
                {/* type="button": si no, adentro del formulario también lo enviaría. */}
                <button type="button" onClick={() => setEditando("")}>Cancelar</button>
            </div>
        </form>
    );

    // Qué se ve en lugar de la lista: cargando, un error, la lista vacía o una tarjeta por ingrediente.
    const mostrarLista = () => {
        // "Cargando..." solo si todavía no hay nada para mostrar: al recargar, la lista queda en su lugar.
        if(cargando && ingredientes.length === 0) {
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

        // Una tarjeta por ingrediente, con sus botones a la vista. Al editarlo, la tarjeta muestra el formulario.
        return ingredientes.map((ingrediente) => (
            <article key={ingrediente._id} className="tarjeta">
                {editando === ingrediente._id ? formularioDeEdicion() : (
                    <>
                        <p>
                            <strong>{ingrediente.nombre}</strong> · {nombreDeCategoria(ingrediente.categoria)} · {formatearPrecio(ingrediente.precio)} · Stock: {ingrediente.cantidad}
                            {/* Los dos motivos por los que un ingrediente no aparece en el armador. */}
                            {!ingrediente.isDisponible && <span className="aviso"> · Pausado</span>}
                            {ingrediente.cantidad === 0 && <span className="aviso"> · Sin stock</span>}
                        </p>

                        {actualizando === ingrediente._id ? <p>Guardando...</p> : (
                            <div className="acciones">
                                <button onClick={() => empezarEdicion(ingrediente)}>Editar</button>
                                <button onClick={() => sumarStock(ingrediente)}>Sumar stock</button>
                                <button onClick={() => cambiarDisponible(ingrediente)}>
                                    {ingrediente.isDisponible ? "Pausar" : "Reactivar"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </article>
        ));
    };

    return (
        <section>
            <h2>Ingredientes</h2>
            <p>Solo aparecen en el armador los ingredientes disponibles y con stock. "Pausar" saca un ingrediente del menú sin borrarlo, y "Reactivar" lo vuelve a poner.</p>

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