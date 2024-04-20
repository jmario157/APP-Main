import { Suspense } from "react";
import { useLoaderData, useOutlet, Await, Navigate } from "react-router-dom";
import { PagoState } from "../contexto/pagos/PagoState";

export const PagosLayout = ({ children }) => {
  const outlet = useOutlet();
  
  return (
          <PagoState >{outlet}</PagoState>
  );
}