// Datos de navegación que comparten varias pantallas.

// La pantalla de inicio de cada rol: adónde va cada usuario al entrar.
const INICIO_DEL_ROL = {
    cliente: "/cliente/armar",
    cocinero: "/cocina",
    administrador: "/admin/categorias"
};

export const inicioDe = (rol) => INICIO_DEL_ROL[rol] ?? "/";

// Para las pestañas hechas con NavLink: React Router le pasa isActive a esta función,
// y la pestaña de la dirección actual recibe la clase "activa".
export const clasePestana = ({ isActive }) => (isActive ? "activa" : "");
