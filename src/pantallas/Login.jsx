import { useState } from "react";
import { pedirApi } from "../api.js";

// El mismo formato de email que exige el backend (modelo Usuario, campo email).
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Revisa los datos antes de enviarlos. Devuelve un objeto con un mensaje por cada campo con problemas:
// si está todo bien, el objeto queda vacío.
const validar = (email, password) => {
    const errores = {};

    if(email === "") {
        errores.email = "Ingresá tu email.";
    } else if(!FORMATO_EMAIL.test(email)) {
        errores.email = "Revisá el email: tiene que ser como nombre@mail.com.";
    }

    if(password === "") {
        errores.password = "Ingresá tu contraseña.";
    }

    return errores;
};

// Pantalla de inicio de sesión. Cuando el backend acepta los datos, le pasa el token a App.
function Login({ alIniciarSesion }) {
    // Un estado por campo: lo que el usuario va escribiendo.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Estado de la pantalla: errores de cada campo, si se está enviando y el mensaje del servidor.
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const enviar = async (evento) => {
        // Sin esto, el navegador recarga la página al enviar el formulario y se pierde todo.
        evento.preventDefault();

        const erroresNuevos = validar(email, password);
        setErrores(erroresNuevos);
        setMensaje("");

        // Si algún campo tiene problemas, no se envía nada al servidor.
        if(erroresNuevos.email || erroresNuevos.password) {
            return;
        }

        setEnviando(true);

        try {
            const { token } = await pedirApi("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            alIniciarSesion(token);
        } catch (error) {
            // Por ejemplo: "Email o contraseña incorrectos." o "Usuario desactivado.".
            setMensaje(error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main>
            <h1>BurgaBit</h1>
            <p>Iniciá sesión para armar tu hamburguesa y seguir tus pedidos.</p>

            {/* noValidate: los avisos los muestra validar(), en castellano y al lado de cada campo. */}
            <form onSubmit={enviar} noValidate>
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
                    Contraseña
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(evento) => setPassword(evento.target.value)}
                    />
                    {errores.password && <span className="error">{errores.password}</span>}
                </label>

                <button type="submit" disabled={enviando}>
                    {enviando ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            {enviando && <p>Si el servidor estaba dormido, puede tardar hasta un minuto.</p>}
            {mensaje && <p className="error">{mensaje}</p>}
        </main>
    );
}

export default Login;