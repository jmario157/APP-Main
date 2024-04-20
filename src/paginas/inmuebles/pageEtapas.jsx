import React from 'react';
import Header from '../../components/plantilla/Header'
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer'
import Etapas from './Etapas'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import {  Navigate } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';

function PageEtapa() {
  const { usuario } = useContextUsuario();
  console.log(usuario);
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/etapas")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header />
      <SideNav />
      <Etapas />
      <Footer />
    </>

  );
}

export default PageEtapa;
