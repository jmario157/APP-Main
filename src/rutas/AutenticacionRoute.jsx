import { Navigate, Outlet } from "react-router-dom";
import { useContextUsuario } from "../contexto/usuario/UsuarioContext";
import { mostraAlertaError } from "../components/Alerts/sweetAlert";

export const AutenticacionRoute = ({ children }) => {
  const { token, estacion } = useContextUsuario();
  if(!estacion){
    mostraAlertaError("Este dispositivo no cuenta con acceso al sistema");
    return <Navigate to="/login" />;
  }
  else if (!token) {
    mostraAlertaError("Token invalido");
    return <Navigate to="/login" />;
  }
  return <Outlet></Outlet>;
};