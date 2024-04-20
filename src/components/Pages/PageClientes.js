import React from 'react';
import Header from '../plantilla/Header'
import SideNav  from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'

import Cliente from '../Clientes';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';
import { Navigate } from 'react-router-dom';
function PageClientes() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta==="/clientes")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header/>
      <SideNav/>
      <Cliente/>
      <Footer/>
      </>
  );
}

export default PageClientes;