import React from 'react';
import Header from '../../components/plantilla/Header'
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import Detalle from './Detalle';

function PageDetalle() {
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
            <Detalle />
            <Footer />
        </>

    );
}

export default PageDetalle;
