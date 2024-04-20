import React from 'react';
import Header from '../plantilla/Header'
import SideNav  from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'
import Cargo from '../Cargo'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';
import { Navigate } from 'react-router-dom';

function PageCargo() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/cargos")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <React.StrictMode>
      <Header/>
      <SideNav/>
      <Cargo/>
      <Footer/>
    </React.StrictMode>
  );
}

export default PageCargo;
