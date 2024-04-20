import { Suspense } from "react";
import { useLoaderData, useOutlet, Await, Navigate } from "react-router-dom";
import { InmobiliarioState } from "../contexto/inmobiliario/InmobiliarioState";

export const InmobiliarioLayout = ({ children }) => {
  const outlet = useOutlet();
  
  return (
          <InmobiliarioState >{outlet}</InmobiliarioState>
  );
}