import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { ClienteState } from "../contexto/cliente/ClienteState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const ClienteLayout = () => {
  const outlet = useOutlet();
  
  return (
          <ClienteState >{outlet}</ClienteState>
  );
}