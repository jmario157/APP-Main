import React from 'react';
import Header from '../../components/plantilla/Header';
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import Salidas from './Salida';

function PageSalida() {
    const { usuario } = useContextUsuario();
    if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/productos")){
        mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
        <Navigate to={"/app/home"}></Navigate>
      )
    }
    return(
        <>
        <Header />
        <SideNav />
        <Salidas />
        <Footer />
      </> 
    );
}

export default PageSalida;