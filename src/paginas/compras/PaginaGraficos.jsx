import SideNav from '../../components/plantilla/SideNav';
import React from 'react';
import Header from '../../components/plantilla/Header';
import Footer from '../../components/plantilla/Footer';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import PageGraficos from './pageGraficos';

function PaginaGraficos() {
  const { usuario } = useContextUsuario();
  if (!usuario.usuarioaccesos.find((f) => f.ruta == "/productos")) {
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return <Navigate to={"/app/home"} />;
  }
  return (
    <>
      <Header />
      <SideNav />
      <div style={{ marginLeft: '250px', flex: '1' }}>
        <PageGraficos />
      </div>
      <Footer />
    </>
  );
}

export default PaginaGraficos;
