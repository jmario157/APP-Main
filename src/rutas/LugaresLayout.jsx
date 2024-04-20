import { Suspense } from "react";
import { useLoaderData, useOutlet, Await, Navigate } from "react-router-dom";
import { LugaresState } from "../contexto/lugares/LugaresState";

export const LugaresLayout = ({ children }) => {
  const outlet = useOutlet();
  
  return (
          <LugaresState >{outlet}</LugaresState>
  );
}