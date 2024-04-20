import React from 'react';
import Header from '../plantilla/Header'
import SideNav  from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'
import Empleado from '../Empleado'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate } from 'react-router-dom';
import { mostraAlertaWarning } from '../Alerts/sweetAlert';

function PageEmpleado() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/empleados")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <React.StrictMode>
      <Header/>
      <SideNav/>
      <Empleado/>
      <Footer/>
    </React.StrictMode>
  );
}

export default PageEmpleado;
