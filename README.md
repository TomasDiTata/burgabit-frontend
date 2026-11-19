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

## Pantallas y direcciones

Cada pantalla tiene su dirección, así que se puede guardar o compartir el enlace, recargar sin perder la pantalla y usar "Atrás" y "Adelante" del navegador sin salir de BurgaBit.

| Dirección | Pantalla | Para quién |
|---|---|---|
| `/` | Portada | Todos |
| `/ingresar` | Ingreso | Quien no ingresó |
| `/registro` | Registro de clientes | Quien no ingresó |
| `/cliente/armar` | Armar la hamburguesa y confirmar el pedido | Cliente |
| `/cliente/pedidos` | Mis pedidos | Cliente |
| `/cocina` | Pedidos activos | Cocina |
| `/admin/categorias`, `/admin/ingredientes`, `/admin/usuarios`, `/admin/pedidos` | Panel del administrador | Administración |

- Sin sesión, las pantallas de los roles muestran el error 401, con botones para ingresar o crear una cuenta. Con una cuenta de otro rol, muestran el error 403 y ofrecen ir a la sección propia. Son los mismos códigos que usa el backend, y es solo para la navegación: los permisos los controla siempre el backend.
- Después de ingresar, el ingreso se reemplaza en el historial, así "Atrás" no vuelve al formulario.
- Cualquier otra dirección muestra el error 404. Los tres errores usan la misma página (`PaginaDeError.jsx`), con la foto de una hamburguesa desarmada.

## Librerías

| Librería | Para qué se usa |
|---|---|
| `react` | Construir la interfaz con componentes y estado (`useState`, `useEffect`). |
| `react-dom` | Dibujar los componentes de React en la página. |
| `react-router` | Las rutas: una dirección por pantalla, con `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `Navigate` y `useNavigate`. |
| `vite` | Servidor de desarrollo y armado de la versión para publicar (*build*). |
| `@vitejs/plugin-react` | Hace que Vite entienda JSX. |

No se usan otras librerías: los pedidos a la API se hacen con `fetch` y los estilos son CSS propio.

De React Router se usa la versión 7. La 8 se usa igual, pero pide Node.js 22.22 o más nuevo.

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
├── vercel.json                Le dice a Vercel que responda con index.html en cualquier dirección.
├── public/                    Archivos que se publican tal cual, sin procesar.
│   ├── favicon.svg            Ícono de la pestaña del navegador: una hamburguesa.
│   ├── fonts/                 La letra de los títulos (Bebas Neue) y su licencia.
│   └── img/                   Las fotos: portada, banners y una por tipo de categoría.
└── src/                       El código de la aplicación.
    ├── main.jsx               Arranca React, envuelto en BrowserRouter.
    ├── App.jsx                Las rutas: qué pantalla va en cada dirección, y cuáles piden sesión y rol.
    ├── rutas.js               La pantalla de inicio de cada rol y la clase de las pestañas.
    ├── fotos.js               Elige la foto de cada categoría según su nombre.
    ├── hamburguesa.js         Qué capa del dibujo le toca a cada ingrediente, y en qué orden se apilan.
    ├── api.js                 pedirApi: la única función que habla con el backend.
    ├── sesion.js              Guarda, lee y borra el token (JWT) en el navegador.
    ├── validaciones.js        Reglas que comparten los formularios.
    ├── formato.js             Precios y fechas como se leen en Argentina.
    ├── pedidos.js             Cálculos y textos de los pedidos.
    ├── index.css              Los estilos de toda la app, con los colores de la marca.
    ├── componentes/           Piezas que usan varias pantallas.
    │   ├── Banner.jsx         La foto de arriba de una sección, con el título y un texto encima.
    │   ├── Cargando.jsx       El aviso de "Cargando..." mientras llegan los datos.
    │   ├── Encabezado.jsx     Barra de arriba: el logo, la sección y "Cerrar sesión".
    │   ├── ErrorAlCargar.jsx  El error de una carga, con el botón "Reintentar".
    │   ├── Hamburguesa.jsx    El dibujo de una hamburguesa: el pan, una capa por ingrediente y el pan.
    │   └── Estado.jsx         Etiqueta de color con el estado de un pedido.
    └── pantallas/             Una pantalla por rol, más la portada, el ingreso y el registro.
        ├── Portada.jsx        La primera página, con la foto y los botones para empezar.
        ├── Login.jsx          Ingreso.
        ├── Registro.jsx       Alta de clientes.
        ├── PaginaDeError.jsx  Los errores 401, 403 y 404: qué pasó y qué hacer.
        ├── PantallaCliente.jsx  Pestañas del cliente, sus rutas y el pedido en curso.
        ├── PantallaCocina.jsx   Pedidos activos y cambios de estado.
        ├── PanelAdmin.jsx     Pestañas del administrador y sus rutas.
        ├── cliente/           Las partes de la pantalla del cliente.
        │   ├── Armador.jsx    Armado de la hamburguesa.
        │   ├── Pedido.jsx     Pedido en curso y confirmación.
        │   └── MisPedidos.jsx Pedidos del cliente y cancelación.
        └── admin/             Las secciones del panel del administrador.
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
- Los pedidos del panel del administrador se piden ya filtrados: al elegir un estado, el pedido es `/api/admin?estado=...` y el backend devuelve solo esos. Así no viajan todos los pedidos para descartarlos en el navegador.

## Diseño

- **Estilo de hamburguesería:** fondo crema, rojo ketchup, amarillo mostaza y negro carbón. Los colores están como variables al principio de `src/index.css`.
- **Letra de los títulos:** Bebas Neue, guardada en `public/fonts`, así no depende de otro sitio. Tiene licencia SIL Open Font License (`public/fonts/OFL.txt`).
- **Responsive:** en el celular, las fotos van arriba y el contenido abajo, y las pestañas bajan de renglón. El resumen del armador queda pegado abajo de la pantalla.
- **Una foto en cada sección:** el armador, "Mis pedidos", la cocina y las cuatro secciones del panel empiezan con un banner: una foto con el título encima. Es el componente `Banner`.
- **La hamburguesa se dibuja mientras se arma:** en el armador, cada vez que se toca "+" cae una capa nueva sobre el pan (carne, cheddar, lechuga, tomate, salsa...). La capa se elige por palabras del nombre del ingrediente (`src/hamburguesa.js`), y el dibujo es todo CSS: no usa imágenes. En la compu, el resumen queda fijo a la derecha con el dibujo grande; en el celular, la barra de abajo lo muestra chico. Los pasos que ya tienen lo necesario se marcan en verde y con ✓. El mismo dibujo, en chico, acompaña cada hamburguesa del pedido, de "Mis pedidos", de la cocina y del panel.
- **Portada:** la foto grande con los botones para empezar, los tres pasos y, al final, una franja con otra invitación a pedir ("¿Se te hizo agua la boca?").
- **Teclado:** al moverse con Tab, el botón o enlace que tiene el foco se marca con un borde mostaza, visible también sobre los fondos oscuros.
- **Hamburguesa y papas a los costados:** en pantallas de 1300 px o más sobra lugar a los costados de la columna del medio. Ahí van una hamburguesa (a la izquierda) y unas papas fritas (a la derecha), fijas mientras se baja y desvaneciéndose hacia el centro con un degradé crema. En esas pantallas los banners quedan como carteles sin foto, y su foto ni se descarga (`loading="lazy"`). En el celular no hay costados: ahí cada banner muestra su foto.

### Fotos

Son de Unsplash y Pexels, con la licencia de cada sitio, que permite usarlas gratis y sin pedir permiso. Están achicadas para la web. Las de la cocina y el panel, además, están recortadas en una franja ancha, que es la parte que muestra el banner.

| Archivo | Dónde se ve | Origen |
|---|---|---|
| `portada.jpg` | Portada e ingreso | [Pexels 1639557](https://www.pexels.com/photo/1639557/) |
| `registro.jpg` | Registro | [Unsplash](https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5) |
| `armar.jpg` | Banner del armador | [Unsplash](https://images.unsplash.com/photo-1561758033-d89a9ad46330) |
| `pedidos.jpg` | Banner de "Mis pedidos" y portada | [Pexels 2271107](https://www.pexels.com/photo/2271107/) |
| `cocina.jpg` | Banner de la cocina | [Unsplash](https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf) |
| `categorias.jpg` | Banner de categorías, en el panel | [Unsplash](https://images.unsplash.com/photo-1498837167922-ddd27525d352) |
| `ingredientes.jpg` | Banner de ingredientes, en el panel | [Unsplash](https://images.unsplash.com/photo-1466637574441-749b8f19452f) |
| `usuarios.jpg` | Banner de usuarios, en el panel | [Unsplash](https://images.unsplash.com/photo-1555992336-03a23c7b20ee) |
| `pedidos-panel.jpg` | Banner de pedidos, en el panel | [Unsplash](https://images.unsplash.com/photo-1466978913421-dad2ebd01d17) |
| `error-parada.jpg`, `error-acostada.jpg` | Página de error: parada en pantallas anchas (con amarillo agregado a los costados) y acostada en el celular | [Pexels 7497213](https://www.pexels.com/photo/7497213/) |
| `costado-hamburguesa.jpg` | Costado izquierdo, en pantallas anchas | [Pexels 8365318](https://www.pexels.com/photo/8365318/) |
| `costado-papas.jpg` | Costado derecho, en pantallas anchas | [Pexels 4109234](https://www.pexels.com/photo/4109234/) |
| `medallones.jpg` | Categorías de medallones o carne, y portada | [Unsplash](https://images.unsplash.com/photo-1572802419224-296b0aeee0d9) |
| `vegetales.jpg` | Categorías de toppings, verduras o vegetales, y portada | [Pexels 19247582](https://www.pexels.com/photo/19247582/) |
| `quesos.jpg` | Categorías de quesos | [Unsplash](https://images.unsplash.com/photo-1542574271-7f3b92e6c821) |
| `panes.jpg` | Categorías de panes | [Unsplash](https://images.unsplash.com/photo-1568901346375-23c9450c58cd) |
| `salsas.jpg` | Categorías de salsas o aderezos | [Unsplash](https://images.unsplash.com/photo-1472476443507-c7a5948772fc) |
| `panceta.jpg` | Categorías de panceta | [Unsplash](https://images.unsplash.com/photo-1528607929212-2636ec44253e) |
| `papas.jpg` | Categorías de papas o acompañamientos | [Pexels 115740](https://www.pexels.com/photo/115740/) |
| `hamburguesa.jpg` | Cualquier otra categoría | [Unsplash](https://images.unsplash.com/photo-1571091718767-18b5b1457add) |

## Publicación

La app está publicada en Vercel, conectada a este repositorio: cada cambio en la rama `main` se publica solo. La variable `VITE_API_URL` está cargada en el panel de Vercel. El trabajo se hace en la rama `Pruebas` y pasa a `main` con un Pull Request.

Como cada pantalla tiene su dirección, `vercel.json` le indica a Vercel que responda con `index.html` en cualquier dirección. Después, React Router dibuja la pantalla que corresponde. Sin ese archivo, recargar en `/cliente/pedidos` daría un error 404 de Vercel.
