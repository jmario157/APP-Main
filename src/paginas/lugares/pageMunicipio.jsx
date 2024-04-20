import React from 'react';
import Header from '../../components/plantilla/Header'
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Link, Navigate } from 'react-router-dom';
import { mostraAlertaOk, mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import Municipio from './Municipio';

function PageMunicipio() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/lugares")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header />
      <SideNav />
      <Municipio/>
      <Footer />
    </>

  );
}

export default PageMunicipio;
