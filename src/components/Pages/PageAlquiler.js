import React from 'react';
import Header from '../plantilla/Header'
import SideNav  from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'
import Alquiler from '../Alquiler'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';
import { Navigate } from 'react-router-dom';

function PageAlquiler() {
    const { usuario } = useContextUsuario();
    if(!usuario.usuarioaccesos.find((f)=>f.ruta==="/alquiler")){
        mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
        return(
            <Navigate to={"/app/home"}></Navigate>
        )
    }
    return (
        <>
        <Header/>
        <SideNav/>
        <Alquiler/>
        <Footer/>
        </>
    );
}

export default PageAlquiler;