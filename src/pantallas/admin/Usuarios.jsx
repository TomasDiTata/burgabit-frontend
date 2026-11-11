import { useEffect, useState } from "react";
import { pedirApi } from "../../api.js";
import { leerSesion } from "../../sesion.js";
import { MINIMO_PASSWORD, SOLO_LETRAS } from "../../validaciones.js";

// Los grupos de la lista, en este orden: el rol como lo guarda el backend y el título que se muestra.
const GRUPOS = [
    { rol: "administrador", titulo: "Administración" },
    { rol: "cocinero", titulo: "Cocina" },
    { rol: "cliente", titulo: "Clientes" }
];

// Revisa una cuenta nueva antes de enviarla. El backend arma el email con el nombre y el apellido,
// y la contraseña tiene que tener al menos 8 caracteres, como en el registro.
const validar = ({ nombre, apellido, password, repetida }) => {
    const errores = {};

    if(nombre.trim() === "") {
        errores.nombre = "Ingresá el nombre.";
    } else if(!SOLO_LETRAS.test(nombre)) {
        errores.nombre = "El nombre solo puede tener letras y espacios.";
    }

    if(apellido.trim() === "") {
        errores.apellido = "Ingresá el apellido.";
    } else if(!SOLO_LETRAS.test(apellido)) {
        errores.apellido = "El apellido solo puede tener letras y espacios.";
    }

    if(password.length < MINIMO_PASSWORD) {
        errores.password = `La contraseña tiene que tener al menos ${MINIMO_PASSWORD} caracteres.`;
    }

    if(repetida !== password) {
        errores.repetida = "Las contraseñas no coinciden.";
    }

    return errores;
};

// Sección de usuarios del panel: el formulario para crear cuentas del personal y las cuentas de cada rol, para activarlas o desactivarlas.
function Usuarios() {
    // La lista que manda el backend y cómo va su carga.
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorAlCargar, setErrorAlCargar] = useState("");
    // El id de la cuenta que se está activando o desactivando, para mostrar "Guardando..." en su tarjeta.
    const [actualizando, setActualizando] = useState("");
    // Los campos del formulario.
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rol, setRol] = useState("cocinero");
    const [password, setPassword] = useState("");
    const [repetida, setRepetida] = useState("");
    // Estado del formulario. creada guarda la cuenta recién creada, para mostrar su email.
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [creada, setCreada] = useState(null);
    const [mensaje, setMensaje] = useState("");

    // La cuenta con la que se entró: el backend no deja que un administrador se desactive a sí mismo.
    const miId = leerSesion()?.id;

    const cargarUsuarios = async () => {
        setCargando(true);
        setErrorAlCargar("");

        try {
            setUsuarios(await pedirApi("/api/admin/usuarios"));
        } catch (error) {
            setErrorAlCargar(error.message);
        } finally {
            setCargando(false);
        }
    };

    // Al abrir la sección se pide la lista una sola vez.
    useEffect(() => {
        cargarUsuarios();
    }, []);

    const crear = async (evento) => {
        evento.preventDefault();

        const erroresNuevos = validar({ nombre, apellido, password, repetida });
        setErrores(erroresNuevos);
        setCreada(null);
        setMensaje("");

        if(Object.values(erroresNuevos).length > 0) {
            return;
        }

        setEnviando(true);

        try {
            // Hay una ruta por rol. El backend arma el email (nombre, apellido y tres números al azar) y lo devuelve.
            const respuesta = await pedirApi(rol === "administrador" ? "/api/admin/admin" : "/api/admin/cocinero", {
                method: "POST",
                body: JSON.stringify({ nombre, apellido, password })
            });
            setCreada({ nombre: `${nombre.trim()} ${apellido.trim()}`, email: respuesta.email });
            setNombre("");
            setApellido("");
            setPassword("");
            setRepetida("");
            cargarUsuarios();
        } catch (error) {
            setMensaje(error.message);
        } finally {
            setEnviando(false);
        }
    };

    // Activa o desactiva una cuenta: el backend pone isActivo al revés de como estaba.
    const cambiarActivo = async (usuario) => {
        // Desactivar deja a esa persona sin poder entrar: se confirma antes.
        if(usuario.isActivo && !confirm(`¿Desactivar la cuenta de ${usuario.nombre} ${usuario.apellido}? No va a poder entrar hasta que la actives de nuevo.`)) {
            return;
        }

        setActualizando(usuario._id);

        try {
            await pedirApi(`/api/admin/usuario/${usuario._id}`, { method: "PATCH" });
        } catch (error) {
            alert(error.message);
        } finally {
            setActualizando("");
            cargarUsuarios();
        }
    };

    // Lo que se ve debajo de cada cuenta. La propia no tiene botón: no se puede desactivar.
    const accionesDe = (usuario) => {
        if(usuario._id === miId) {
            return <p>Es tu cuenta: no podés desactivarla.</p>;
        }

        if(actualizando === usuario._id) {
            return <p>Guardando...</p>;
        }

        return (
            <div className="acciones">
                <button onClick={() => cambiarActivo(usuario)}>{usuario.isActivo ? "Desactivar" : "Activar"}</button>
            </div>
        );
    };

    // Qué se ve en lugar de la lista: cargando, un error o las cuentas agrupadas por rol.
    const mostrarLista = () => {
        // "Cargando..." solo si todavía no hay nada para mostrar: al recargar, la lista queda en su lugar.
        if(cargando && usuarios.length === 0) {
            return <p>Cargando usuarios... Si el servidor estaba dormido, puede tardar hasta un minuto.</p>;
        }

        if(errorAlCargar) {
            return (
                <p className="error">
                    {errorAlCargar} <button className="enlace" onClick={cargarUsuarios}>Reintentar</button>
                </p>
            );
        }

        // Un grupo por rol: con filter se queda con las cuentas de ese rol.
        return GRUPOS.map((grupo) => {
            const delGrupo = usuarios.filter((usuario) => usuario.rol === grupo.rol);

            return (
                <div key={grupo.rol}>
                    <h3>{grupo.titulo} ({delGrupo.length})</h3>
                    {delGrupo.length === 0 && <p>No hay cuentas.</p>}
                    {delGrupo.map((usuario) => (
                        <article key={usuario._id} className="tarjeta">
                            <p>
                                <strong>{usuario.nombre} {usuario.apellido}</strong> · {usuario.email}
                                {!usuario.isActivo && <span className="aviso"> · Desactivada</span>}
                            </p>
                            {accionesDe(usuario)}
                        </article>
                    ))}
                </div>
            );
        });
    };

    return (
        <section>
            <h2>Usuarios</h2>

            {/* El formulario va arriba: los clientes pueden ser muchos, y así no hay que bajar hasta el final para crear una cuenta. */}
            <h3>Nueva cuenta del personal</h3>
            <p>El email lo arma el backend con el nombre y el apellido: pasáselo a quien va a usar la cuenta, junto con la contraseña.</p>
            <form onSubmit={crear} noValidate>
                <label>
                    Nombre
                    <input type="text" value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
                    {errores.nombre && <span className="error">{errores.nombre}</span>}
                </label>

                <label>
                    Apellido
                    <input type="text" value={apellido} onChange={(evento) => setApellido(evento.target.value)} />
                    {errores.apellido && <span className="error">{errores.apellido}</span>}
                </label>

                <label>
                    Rol
                    <select value={rol} onChange={(evento) => setRol(evento.target.value)}>
                        <option value="cocinero">Cocina</option>
                        <option value="administrador">Administración</option>
                    </select>
                </label>

                <label>
                    Contraseña (al menos {MINIMO_PASSWORD} caracteres)
                    <input type="password" value={password} onChange={(evento) => setPassword(evento.target.value)} />
                    {errores.password && <span className="error">{errores.password}</span>}
                </label>

                <label>
                    Repetí la contraseña
                    <input type="password" value={repetida} onChange={(evento) => setRepetida(evento.target.value)} />
                    {errores.repetida && <span className="error">{errores.repetida}</span>}
                </label>

                <button type="submit" disabled={enviando}>
                    {enviando ? "Creando..." : "Crear cuenta"}
                </button>
            </form>

            {creada && (
                <p className="exito">
                    Cuenta creada para {creada.nombre}. Para entrar, tiene que usar el email <strong>{creada.email}</strong> y la contraseña que elegiste.
                </p>
            )}
            {mensaje && <p className="error">{mensaje}</p>}

            {mostrarLista()}
        </section>
    );
}

export default Usuarios;