import React from 'react';
import Header from '../plantilla/Header'
import SideNav  from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'
import Usuarios from '../Usuarios';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';
import { Navigate } from 'react-router-dom';

function PageUsuario() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/usuarios")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>   
      <Header/>
      <SideNav/>
      <Usuarios/>
      <Footer/>
      </>

  );
}

export default PageUsuario;
