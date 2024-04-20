import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { mostraAlerta } from "../components/Alerts/sweetAlert";
import EmpleadoState from "../contexto/empleados/EmpleadoState";

export const EmpleadoLayout = () => {
  const outlet = useOutlet();
  
  return (
          <EmpleadoState >{outlet}</EmpleadoState>
  );
}