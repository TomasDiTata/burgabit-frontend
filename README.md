# BurgaBit — Frontend

Aplicación web de BurgaBit, una hamburguesería donde cada cliente arma su hamburguesa. Es una SPA hecha con React que se conecta con la API de BurgaBit.

- **Aplicación publicada:** https://burgabit.vercel.app
- **Repositorio del backend:** https://github.com/bonanno05/BurgaBit
- **API:** https://burgabit.onrender.com (está en un plan gratuito: si estuvo sin uso, el primer pedido puede tardar hasta un minuto)

Trabajo de Programación III (UTN). Autor: Tomás Di Tata.

## Qué se puede hacer

La pantalla depende del rol de la cuenta con la que se ingresa:

| Rol | Qué puede hacer |
|---|---|
| Cliente | Registrarse, armar una o varias hamburguesas (medallones y toppings), confirmar el pedido, seguir su estado y cancelarlo mientras está Pendiente. |
| Cocina | Ver los pedidos activos, del más viejo al más nuevo, pasarlos de estado hasta entregarlos y cancelarlos con un motivo. |
| Administración | Crear y editar categorías e ingredientes, pausar y reactivar ingredientes, sumar stock, crear cuentas de cocina y de administración, activarlas o desactivarlas, y consultar todos los pedidos con su historial. |

Los clientes se registran desde la app. Las cuentas de cocina y de administración las crea un administrador desde el panel.

## Librerías

| Librería | Para qué se usa |
|---|---|
| `react` | Construir la interfaz con componentes y estado (`useState`, `useEffect`). |
| `react-dom` | Dibujar los componentes de React en la página. |
| `vite` | Servidor de desarrollo y armado de la versión para publicar (*build*). |
| `@vitejs/plugin-react` | Hace que Vite entienda JSX. |

No se usan otras librerías: los pedidos a la API se hacen con `fetch`, los estilos son CSS propio y la navegación entre pantallas se resuelve con el estado de React.

## Entorno

Hace falta Node.js 20.19 o más nuevo (lo pide Vite) y npm.

```bash
git clone https://github.com/TomasDiTata/burgabit-frontend.git
cd burgabit-frontend
npm install
```

Después, copiar el archivo `.env.example` con el nombre `.env`.

### Variables de entorno

| Variable | Qué es | Ejemplo |
|---|---|---|
| `VITE_API_URL` | Dirección de la API de BurgaBit, sin barra al final. | `https://burgabit.onrender.com` |

Vite solo lee las variables que empiezan con `VITE_`, y las copia en el código que baja el navegador: ahí no va ningún secreto. El archivo `.env` no se sube al repositorio.

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta la app en `http://localhost:5173`, con recarga al guardar. |
| `npm run build` | Arma la versión para publicar en la carpeta `dist`. |
| `npm run preview` | Sirve la carpeta `dist`, para probar el build en la compu. |

## Estructura

```
burgabit-frontend/
├── index.html                 La única página: React dibuja todo adentro de <div id="root">.
├── .env.example               Plantilla de las variables de entorno.
├── vite.config.js             Configuración de Vite (el plugin de React).
└── src/
    ├── main.jsx               Arranca React.
    ├── App.jsx                Decide qué pantalla se ve: login, registro o la del rol.
    ├── api.js                 pedirApi: la única función que habla con el backend.
    ├── sesion.js              Guarda, lee y borra el token (JWT) en el navegador.
    ├── validaciones.js        Reglas que comparten los formularios.
    ├── formato.js             Precios y fechas como se leen en Argentina.
    ├── pedidos.js             Cálculos y textos de los pedidos.
    ├── index.css              Los estilos de toda la app.
    ├── componentes/
    │   ├── Encabezado.jsx     Barra de arriba, con "Cerrar sesión".
    │   └── Estado.jsx         Etiqueta de color con el estado de un pedido.
    └── pantallas/
        ├── Login.jsx          Ingreso.
        ├── Registro.jsx       Alta de clientes.
        ├── PantallaCliente.jsx  Pestañas del cliente y pedido en curso.
        ├── PantallaCocina.jsx   Pedidos activos y cambios de estado.
        ├── PanelAdmin.jsx     Pestañas del administrador.
        ├── cliente/
        │   ├── Armador.jsx    Armado de la hamburguesa.
        │   ├── Pedido.jsx     Pedido en curso y confirmación.
        │   └── MisPedidos.jsx Pedidos del cliente y cancelación.
        └── admin/
            ├── Categorias.jsx   Categorías del menú.
            ├── Ingredientes.jsx Ingredientes, stock y disponibilidad.
            ├── Usuarios.jsx     Cuentas del personal.
            └── Pedidos.jsx      Consulta de todos los pedidos.
```

## Conexión con el backend y sesión

- Todas las pantallas llaman a `pedirApi` (`src/api.js`), que arma la dirección con `VITE_API_URL`, manda los datos en JSON y convierte las respuestas con error en mensajes para el usuario.
- Al ingresar, el backend devuelve un token JWT. Se guarda en `localStorage` y viaja en cada pedido en el encabezado `Authorization: Bearer <token>`.
- El frontend lee del token el rol, para elegir la pantalla, y el vencimiento, para pedir el ingreso de nuevo. Los permisos los controla siempre el backend.
- Los formularios se validan antes de enviar, y cada pedido a la API muestra que está en curso ("Cargando...", "Guardando...") y avisa si falla.

## Publicación

La app está publicada en Vercel, conectada a este repositorio: cada cambio en la rama `main` se publica solo. La variable `VITE_API_URL` está cargada en el panel de Vercel. El trabajo se hace en la rama `Pruebas` y pasa a `main` con un Pull Request.
