import React from "react";
import Header from "../plantilla/Header";
import SideNav from "../plantilla/SideNav";
import Footer from "../plantilla/Footer";

import Profesion from "../Profesion";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import { Navigate } from "react-router-dom";
import { mostraAlertaWarning } from "../Alerts/sweetAlert";
function PageProfesion() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/profesiones")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header />
      <SideNav />
      <Profesion />
      <Footer />
    </>
  );
}

export default PageProfesion;
