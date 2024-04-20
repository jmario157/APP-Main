import React from 'react';
import Header from '../../components/plantilla/Header';
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate, useParams } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import ComponentePadre from '../../reportes/Salidas/PageReporteMovimientos';

function PageReporteMovimientos() {
    const {id} = useParams();
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
        <div style={{ marginLeft: '250px', flex: '1',  }}>
        <ComponentePadre productoId={id}/>
        </div>
        <Footer />
      </> 
    );
}

export default PageReporteMovimientos;