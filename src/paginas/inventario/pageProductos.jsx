import React from 'react';
import Header from '../../components/plantilla/Header'
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import Producto from './Productos';

function PageProductos() {
    const { usuario } = useContextUsuario();
    if (!usuario.usuarioaccesos.find((f) => f.ruta === "/inventario")) {
        mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
        return (
            <Navigate to={"/app/home"}></Navigate>
        )
    }
    return (
        <>
            <Header />
            <SideNav />
            <Producto />
            <Footer />
        </>

    );
}

export default PageProductos;
