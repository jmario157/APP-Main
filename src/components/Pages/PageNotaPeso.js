import React from 'react';
import Header from '../plantilla/Header'
import SideNav from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'

import NotaPeso from '../NotaPeso';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';
import { Navigate } from 'react-router-dom';
function PageNotaPeso() {
    const { usuario } = useContextUsuario();
    if (!usuario.usuarioaccesos.find((f) => f.ruta === "/nota")) {
        mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
        return (
            <Navigate to={"/app/home"}></Navigate>
        )
    }
    return (
        <>
            <Header />
            <SideNav />
            <NotaPeso />
            <Footer />
        </>
    );
}

export default PageNotaPeso;