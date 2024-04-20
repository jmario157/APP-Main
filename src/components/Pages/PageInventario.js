import React from 'react';
import Header from '../plantilla/Header'
import SideNav  from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'
import Inventario from '../Inventario'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';
import { Navigate } from 'react-router-dom';

function PageInventario() {
    const { usuario } = useContextUsuario();
    if(!usuario.usuarioaccesos.find((f)=>f.ruta==="/inventario")){
        mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
        return(
            <Navigate to={"/app/home"}></Navigate>
        )
    }
    return (
        <>
        <Header/>
        <SideNav/>
        <Inventario/>
        <Footer/>
        </>
    );
}

export default PageInventario;