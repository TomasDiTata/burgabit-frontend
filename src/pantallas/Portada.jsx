import { Link } from "react-router";
import { inicioDe } from "../rutas.js";

// Lo que dice el botón principal según quién entró.
const TEXTO_DEL_BOTON = {
    cliente: "Armar mi pedido",
    cocinero: "Ir a la cocina",
    administrador: "Ir al panel"
};

// Los pasos para pedir, con su foto.
const PASOS = [
    { foto: "/img/medallones.jpg", titulo: "Elegí la base", texto: "Los medallones que más te gusten, con el pan incluido." },
    { foto: "/img/vegetales.jpg", titulo: "Sumá los toppings", texto: "Agregá los ingredientes que quieras, del menú del día." },
    { foto: "/img/pedidos.jpg", titulo: "Confirmá y retirala", texto: "Seguí tu pedido hasta que esté listo para retirar." }
];

// La portada: lo primero que se ve al entrar a BurgaBit. Invita a ingresar o, si ya hay sesión, a seguir.
function Portada({ sesion }) {
    return (
        <>
            <section className="portada">
                <img src="/img/portada.jpg" alt="Hamburguesa con cheddar, tomate y lechuga" />
                <div className="portada-texto">
                    <p className="logo">Burga<span>Bit</span></p>
                    <h1>Armá tu hamburguesa a tu manera</h1>
                    <p>Elegí los medallones y los toppings, confirmá el pedido y retirala recién hecha.</p>

                    <div className="acciones">
                        {sesion ? (
                            <Link to={inicioDe(sesion.rol)} className="boton principal">{TEXTO_DEL_BOTON[sesion.rol]}</Link>
                        ) : (
                            <>
                                <Link to="/ingresar" className="boton principal">Ingresar</Link>
                                <Link to="/registro" className="boton boton-claro">Crear cuenta</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <main>
                <h2>Así de fácil</h2>
                <div className="pasos">
                    {PASOS.map((paso, posicion) => (
                        <article key={paso.titulo} className="tarjeta paso-portada">
                            {/* alt vacío: la foto acompaña al texto, que ya dice todo. */}
                            <img src={paso.foto} alt="" loading="lazy" />
                            <h3>{posicion + 1}. {paso.titulo}</h3>
                            <p>{paso.texto}</p>
                        </article>
                    ))}
                </div>
            </main>
        </>
    );
}

export default Portada;
