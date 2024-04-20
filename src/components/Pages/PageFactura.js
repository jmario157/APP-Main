import React from 'react';
import Header from '../plantilla/Header'
import SideNav from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'

import Factura from '../Factura';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';
import { Navigate } from 'react-router-dom';
function PageFactura() {
    const { usuario } = useContextUsuario();
    if (!usuario.usuarioaccesos.find((f) => f.ruta === "/factura")) {
        mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
        return (
            <Navigate to={"/app/home"}></Navigate>
        )
    }
    return (
        <>
            <Header />
            <SideNav />
            <Factura />
            <Footer />
        </>
    );
}

export default PageFactura;