import React from 'react';
import Header from '../../components/plantilla/Header'
import SideNav  from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer'
import ContratosInicioContenido from './ContratosInicioContenido';
import { Navigate } from 'react-router-dom';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
function ContratosInicio() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/contratos")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header/>
      <SideNav/>
      <ContratosInicioContenido/>
      <Footer/>
      </>
  );
}

export default ContratosInicio;