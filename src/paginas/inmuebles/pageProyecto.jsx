import React from 'react';
import Header from '../../components/plantilla/Header'
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer'
import Proyecto from './Proyectos'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Link, Navigate } from 'react-router-dom';
import { mostraAlertaOk, mostraAlertaWarning } from '../../components/Alerts/sweetAlert';

function PageProyecto() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/proyectos")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header />
      <Proyecto />
      <SideNav />
      <Footer />
    </>

  );
}

export default PageProyecto;
