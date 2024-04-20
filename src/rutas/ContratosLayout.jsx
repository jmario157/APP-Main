import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { mostraAlerta } from "../components/Alerts/sweetAlert";
import { ContratoState } from "../contexto/contratos/ContratoState";

export const ContratosLayout = () => {
  const outlet = useOutlet();
  
  return (
          <ContratoState >{outlet}</ContratoState>
  );
}