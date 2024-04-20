import { Suspense } from "react";
import { useLoaderData, useOutlet, Await, Navigate } from "react-router-dom";
import { CajaState } from "../contexto/caja/CajaState";

export const CajasLayout = ({ children }) => {
  const outlet = useOutlet();
  
  return (
          <CajaState >{outlet}</CajaState>
  );
}