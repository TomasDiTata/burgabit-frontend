import { useState } from "react";
import { pedirApi } from "../api.js";
import { FORMATO_EMAIL, MINIMO_PASSWORD } from "../validaciones.js";

// Revisa los datos antes de enviarlos, con las mismas reglas que el modelo Usuario del backend.
// Devuelve un objeto con un mensaje por cada campo con problemas: si está todo bien, el objeto queda vacío.
const validar = ({ nombre, apellido, email, password, repetida }) => {
    const errores = {};

    // trim: un nombre de puros espacios cuenta como vacío (el backend también los saca).
    if(nombre.trim() === "") {
        errores.nombre = "Ingresá tu nombre.";
    }

    if(apellido.trim() === "") {
        errores.apellido = "Ingresá tu apellido.";
    }

    if(email === "") {
        errores.email = "Ingresá tu email.";
    } else if(!FORMATO_EMAIL.test(email)) {
        errores.email = "Revisá el email: tiene que ser como nombre@mail.com.";
    }

    if(password.length < MINIMO_PASSWORD) {
        errores.password = `La contraseña tiene que tener al menos ${MINIMO_PASSWORD} caracteres.`;
    }

    if(repetida !== password) {
        errores.repetida = "Las contraseñas no coinciden.";
    }

    return errores;
};

// Pantalla para crear una cuenta de cliente. Si sale bien, inicia sesión con los mismos datos.
function Registro({ alIniciarSesion, alIrAlLogin }) {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repetida, setRepetida] = useState("");
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const enviar = async (evento) => {
        evento.preventDefault();

        const erroresNuevos = validar({ nombre, apellido, email, password, repetida });
        setErrores(erroresNuevos);
        setMensaje("");

        // Object.values devuelve un array con los mensajes: si tiene alguno, no se envía nada al servidor.
        if(Object.values(erroresNuevos).length > 0) {
            return;
        }

        setEnviando(true);

        try {
            // Se crea la cuenta: el backend siempre la crea con el rol cliente.
            await pedirApi("/api/auth/registrar", {
                method: "POST",
                body: JSON.stringify({ nombre, apellido, email, password })
            });
            // Después se inicia sesión con los mismos datos, para no tener que escribirlos otra vez.
            const { token } = await pedirApi("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            alIniciarSesion(token);
        } catch (error) {
            // Por ejemplo: "Usuario ya registrado.".
            setMensaje(error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main>
            <h1>BurgaBit</h1>
            <p>Creá tu cuenta para armar tu hamburguesa y seguir tus pedidos.</p>

            <form onSubmit={enviar} noValidate>
                <label>
                    Nombre
                    <input
                        type="text"
                        autoComplete="given-name"
                        value={nombre}
                        onChange={(evento) => setNombre(evento.target.value)}
                    />
                    {errores.nombre && <span className="error">{errores.nombre}</span>}
                </label>

                <label>
                    Apellido
                    <input
                        type="text"
                        autoComplete="family-name"
                        value={apellido}
                        onChange={(evento) => setApellido(evento.target.value)}
                    />
                    {errores.apellido && <span className="error">{errores.apellido}</span>}
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(evento) => setEmail(evento.target.value)}
                    />
                    {errores.email && <span className="error">{errores.email}</span>}
                </label>

                <label>
                    Contraseña (al menos {MINIMO_PASSWORD} caracteres)
                    <input
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(evento) => setPassword(evento.target.value)}
                    />
                    {errores.password && <span className="error">{errores.password}</span>}
                </label>

                <label>
                    Repetí la contraseña
                    <input
                        type="password"
                        autoComplete="new-password"
                        value={repetida}
                        onChange={(evento) => setRepetida(evento.target.value)}
                    />
                    {errores.repetida && <span className="error">{errores.repetida}</span>}
                </label>

                <button type="submit" disabled={enviando}>
                    {enviando ? "Creando la cuenta..." : "Crear cuenta"}
                </button>
            </form>

            {enviando && <p>Si el servidor estaba dormido, puede tardar hasta un minuto.</p>}
            {mensaje && <p className="error">{mensaje}</p>}

            <p>
                ¿Ya tenés cuenta? <button className="enlace" onClick={alIrAlLogin}>Iniciá sesión</button>
            </p>
        </main>
    );
}

export default Registro;