import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { esEnteroDesde } from "../../validaciones.js";

// Revisa una categoría nueva antes de enviarla, con las reglas del modelo Categoria del backend.
// También mira las categorías que ya existen, para no repetir el nombre ni el paso.
const validar = ({ nombre, paso, minimo, maximo }, categorias) => {
    const errores = {};

    if(nombre.trim() === "") {
        errores.nombre = "Ingresá el nombre.";
    } else if(categorias.some((categoria) => categoria.nombre === nombre.trim().toLowerCase())) {
        errores.nombre = "Ya existe una categoría con ese nombre.";
    }

    if(!esEnteroDesde(paso, 1)) {
        errores.paso = "El paso tiene que ser un número entero desde 1.";
    } else if(categorias.some((categoria) => categoria.paso === Number(paso))) {
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

// Sección de categorías del panel: la lista (ordenada por paso) y el formulario para crear una nueva.
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
            setPaso(String(lista.reduce((mayor, categoria) => Math.max(mayor, categoria.paso), 0) + 1));
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

    const crear = async (evento) => {
        evento.preventDefault();

        const erroresNuevos = validar({ nombre, paso, minimo, maximo }, categorias);
        setErrores(erroresNuevos);
        setExito("");
        setMensaje("");

        if(Object.values(erroresNuevos).length > 0) {
            return;
        }

        setEnviando(true);

        try {
            // Los números van como números: el backend compara el mínimo con el máximo antes de guardar.
            const respuesta = await pedirApi("/api/categorias", {
                method: "POST",
                body: JSON.stringify({ nombre, paso: Number(paso), minimo: Number(minimo), maximo: Number(maximo) })
            });
            setExito(respuesta.msg);
            setNombre("");
            setMinimo("");
            setMaximo("");
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
        if(cargando) {
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
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria._id}>
                                <td>{categoria.paso}</td>
                                <td>{categoria.nombre}</td>
                                <td>{categoria.minimo}</td>
                                <td>{categoria.maximo}</td>
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
            <p>Cada categoría es un paso del armador. El mínimo y el máximo son cuántos ingredientes de esa categoría lleva cada hamburguesa.</p>

            {mostrarLista()}

            <h3>Nueva categoría</h3>
            <form onSubmit={crear} noValidate>
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
                </label>

                <label>
                    Máximo por hamburguesa
                    <input type="number" min="1" value={maximo} onChange={(evento) => setMaximo(evento.target.value)} />
                    {errores.maximo && <span className="error">{errores.maximo}</span>}
                </label>

                <button type="submit" disabled={enviando}>
                    {enviando ? "Creando..." : "Crear categoría"}
                </button>
            </form>

            {exito && <p className="exito">{exito}</p>}
            {mensaje && <p className="error">{mensaje}</p>}
        </section>
    );
}

export default Categorias;