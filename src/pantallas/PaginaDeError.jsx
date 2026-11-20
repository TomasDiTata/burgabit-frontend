import { Link } from "react-router";
import { inicioDe } from "../rutas.js";

// Los errores del cliente (4xx) que puede mostrar la app. Son los mismos códigos que devuelve el backend:
// 401: no se sabe quién sos (no hay sesión). 403: se sabe quién sos, pero tu cuenta no tiene permiso. 404: no existe.
const TITULOS = {
    401: "Sin sesión no hay hamburguesa",
    403: "Esta sección no es para tu cuenta",
    404: "Esta página se la comieron"
};

// Para el 403: de quién es cada sección y cómo se llama cada tipo de cuenta.
const SECCION_DEL_ROL = { cliente: "los clientes", cocinero: "la cocina", administrador: "la administración" };
const CUENTA_DEL_ROL = { cliente: "cliente", cocinero: "cocina", administrador: "administración" };

// Página de error: la foto de una hamburguesa desarmada, el código, qué pasó y qué se puede hacer.
// Usa el mismo diseño que el ingreso: la foto a un lado (arriba en el celular) y el contenido al otro.
// codigo: 401, 403 o 404. sesion: la sesión, si hay. rolNecesario: para el 403, el rol de la sección que se quiso abrir.
function PaginaDeError({ codigo, sesion, rolNecesario }) {
    // Qué pasó, en palabras.
    const explicacion = () => {
        if(codigo === 401) {
            return "Esta sección es para cuentas de BurgaBit: ingresá con la tuya o creá una nueva.";
        }

        if(codigo === 403) {
            return `Es de ${SECCION_DEL_ROL[rolNecesario]}, y entraste con una cuenta de ${CUENTA_DEL_ROL[sesion.rol]}.`;
        }

        return "La dirección está mal escrita o ya no existe.";
    };

    // Qué se puede hacer: ingresar (401), ir a la sección de tu cuenta (403) o volver (404).
    const botones = () => {
        if(codigo === 401) {
            return (
                <>
                    <Link to="/ingresar" className="boton principal">Ingresar</Link>
                    <Link to="/registro" className="boton">Crear cuenta</Link>
                </>
            );
        }

        if(codigo === 403) {
            return <Link to={inicioDe(sesion.rol)} className="boton principal">Ir a mi sección</Link>;
        }

        return <Link to={sesion ? inicioDe(sesion.rol) : "/"} className="boton principal">Volver a BurgaBit</Link>;
    };

    return (
        <div className="acceso">
            {/* La foto va como fondo en el CSS (.error-foto): parada en pantallas anchas y acostada en el celular. */}
            <div className="acceso-foto error-foto">
                <p className="lema">Se nos desarmó la hamburguesa.</p>
            </div>

            <main className="acceso-formulario">
                <Link to="/" className="logo">Burga<span>Bit</span></Link>
                <p className="error-codigo">Error {codigo}</p>
                <h1>{TITULOS[codigo]}</h1>
                <p>{explicacion()}</p>
                <div className="acciones">{botones()}</div>
            </main>
        </div>
    );
}

export default PaginaDeError;
