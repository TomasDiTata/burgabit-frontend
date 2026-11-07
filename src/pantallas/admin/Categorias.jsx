import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { esEnteroDesde, SOLO_LETRAS } from "../../validaciones.js";

// El paso que sigue al último: es el que se propone para una categoría nueva, y el más alto que se puede usar.
const pasoSiguiente = (categorias) => categorias.reduce((mayor, categoria) => Math.max(mayor, categoria.paso), 0) + 1;

// Revisa una categoría antes de enviarla, con las reglas del modelo Categoria del backend.
// "otras" son las demás categorías: para no repetir el nombre ni el paso, y para que el paso no salte de más.
const validar = ({ nombre, paso, minimo, maximo }, otras) => {
    const errores = {};
    const siguiente = pasoSiguiente(otras);

    if(nombre.trim() === "") {
        errores.nombre = "Ingresá el nombre.";
    } else if(!SOLO_LETRAS.test(nombre)) {
        errores.nombre = "El nombre solo puede tener letras y espacios.";
    } else if(otras.some((categoria) => categoria.nombre === nombre.trim().toLowerCase())) {
        errores.nombre = "Ya existe una categoría con ese nombre.";
    }

    if(!esEnteroDesde(paso, 1)) {
        errores.paso = "El paso tiene que ser un número entero desde 1.";
    } else if(Number(paso) > siguiente) {
        errores.paso = `El paso puede ser hasta ${siguiente}, el que sigue al último.`;
    } else if(otras.some((categoria) => categoria.paso === Number(paso))) {
        errores.paso = `Ya hay una categoría en el paso ${paso}.`;
    }

    if(!esEnteroDesde(minimo, 0)) {
        errores.minimo = "El mínimo tiene que ser un número entero desde 0.";
    }

    if(!esEnteroDesde(maximo, 1)) {
        errores.maximo = "El máximo tiene que ser un número entero desde 1.";
    } else if(Number(minimo) > Number(maximo)) {
        errores.maximo = "El máximo no puede ser menor que el mínimo.";
    }

    return errores;
};

// Sección de categorías del panel: la lista (ordenada por paso) y el formulario para crear una nueva o editar una.
function Categorias() {
    // La lista que manda el backend y cómo va su carga.
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // Los campos del formulario: los números también llegan como texto desde el input.
    const [nombre, setNombre] = useState("");
    const [paso, setPaso] = useState("");
    const [minimo, setMinimo] = useState("");
    const [maximo, setMaximo] = useState("");
    // El id de la categoría que se está editando, o "" si el formulario es para crear una nueva.
    const [editando, setEditando] = useState("");
    // Estado del formulario.
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState("");
    const [mensaje, setMensaje] = useState("");

    const cargarCategorias = async () => {
        setCargando(true);
        setErrorAlCargar("");

        try {
            const lista = await pedirApi("/api/categorias");
            setCategorias(lista);
            // Se propone el paso que sigue al último: así no hace falta escribirlo,
            // y si se quiere la categoría en otro lugar del armador, se cambia.
            setPaso(String(pasoSiguiente(lista)));
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    // Al abrir la sección se pide la lista. El [] hace que se pida una sola vez, y no cada vez que se dibuja.
    useEffect(() => {
        cargarCategorias();
    }, []);

    // Llena el formulario con los datos de una categoría, para cambiarlos.
    const empezarEdicion = (categoria) => {
        setEditando(categoria._id);
        setNombre(categoria.nombre);
        setPaso(String(categoria.paso));
        setMinimo(String(categoria.minimo));
        setMaximo(String(categoria.maximo));
        setErrores({});
        setExito("");
        setMensaje("");
    };

    // Deja el formulario vacío, listo para crear una categoría nueva.
    const limpiarFormulario = () => {
        setEditando("");
        setNombre("");
        setPaso(String(pasoSiguiente(categorias)));
        setMinimo("");
        setMaximo("");
        setErrores({});
    };

    const guardar = async (evento) => {
        evento.preventDefault();

        // Al editar, la categoría no se compara consigo misma: puede quedarse con su nombre y su paso.
        const otras = categorias.filter((categoria) => categoria._id !== editando);
        const erroresNuevos = validar({ nombre, paso, minimo, maximo }, otras);
        setErrores(erroresNuevos);
        setExito("");
        setMensaje("");

        if(Object.values(erroresNuevos).length > 0) {
            return;
        }

        setEnviando(true);

        try {
            // Para crear, POST a /api/categorias; para editar, PATCH a /api/categorias/:id.
            // Los números van como números: el backend compara el mínimo con el máximo antes de guardar.
            const respuesta = await pedirApi(editando ? `/api/categorias/${editando}` : "/api/categorias", {
                method: editando ? "PATCH" : "POST",
                body: JSON.stringify({ nombre, paso: Number(paso), minimo: Number(minimo), maximo: Number(maximo) })
            });
            setExito(respuesta.msg);
            limpiarFormulario();
            // Se vuelve a pedir la lista, para ver lo que quedó guardado en la base.
            cargarCategorias();
        } catch (error) {
            setMensaje(error.message);
        } finally {
            setEnviando(false);
        }
    };

    // Qué se ve en lugar de la lista: cargando, un error, la lista vacía o la tabla.
    const mostrarLista = () => {
        // "Cargando..." solo si todavía no hay nada para mostrar: al recargar, la tabla queda en su lugar.
        if(cargando && categorias.length === 0) {
            return <p>Cargando categorías... Si el servidor estaba dormido, puede tardar hasta un minuto.</p>;
        }

        if(errorAlCargar) {
            return (
                <p className="error">
                    {errorAlCargar} <button className="enlace" onClick={cargarCategorias}>Reintentar</button>
                </p>
            );
        }

        if(categorias.length === 0) {
            return <p>Todavía no hay categorías.</p>;
        }

        return (
            <div className="tabla">
                <table>
                    <thead>
                        <tr>
                            <th>Paso</th>
                            <th>Nombre</th>
                            <th>Mínimo</th>
                            <th>Máximo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria._id} className={categoria._id === editando ? "editando" : ""}>
                                <td>{categoria.paso}</td>
                                <td>{categoria.nombre}</td>
                                <td>{categoria.minimo}</td>
                                <td>{categoria.maximo}</td>
                                <td>
                                    <button className="enlace" onClick={() => empezarEdicion(categoria)}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <section>
            <h2>Categorías</h2>
            <p>Cada categoría es un grupo del armador, como medallones o toppings. El paso es el orden en que aparece, y el mínimo y el máximo, cuántas unidades de esa categoría lleva cada hamburguesa.</p>

            {mostrarLista()}

            <h3>{editando ? "Editar categoría" : "Nueva categoría"}</h3>
            <form onSubmit={guardar} noValidate>
                <label>
                    Nombre
                    <input type="text" value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
                    {errores.nombre && <span className="error">{errores.nombre}</span>}
                </label>

                <label>
                    Paso (orden en el armador)
                    <input type="number" min="1" value={paso} onChange={(evento) => setPaso(evento.target.value)} />
                    {errores.paso && <span className="error">{errores.paso}</span>}
                </label>

                <label>
                    Mínimo por hamburguesa
                    <input type="number" min="0" value={minimo} onChange={(evento) => setMinimo(evento.target.value)} />
                    {errores.minimo && <span className="error">{errores.minimo}</span>}
                    {/* No es un error: avisa que, con mínimo 1 o más, sin ingredientes con stock nadie puede pedir. */}
                    {Number(minimo) >= 1 && (
                        <span className="aviso">
                            Toda hamburguesa va a tener que llevar al menos {minimo} de esta categoría: si no tiene ingredientes con stock, nadie va a poder pedir.
                        </span>
                    )}
                </label>

                <label>
                    Máximo por hamburguesa
                    <input type="number" min="1" value={maximo} onChange={(evento) => setMaximo(evento.target.value)} />
                    {errores.maximo && <span className="error">{errores.maximo}</span>}
                </label>

                <button type="submit" disabled={enviando}>
                    {enviando ? "Guardando..." : (editando ? "Guardar cambios" : "Crear categoría")}
                </button>
                {/* type="button": si no, adentro del formulario también lo enviaría. */}
                {editando && <button type="button" className="enlace" onClick={limpiarFormulario}>Cancelar</button>}
            </form>

            {exito && <p className="exito">{exito}</p>}
            {mensaje && <p className="error">{mensaje}</p>}
        </section>
    );
}

export default Categorias;