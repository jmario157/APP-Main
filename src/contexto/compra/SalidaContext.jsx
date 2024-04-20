import { createContext, useContext } from "react";

export const SalidaContext = createContext();

export const useContextSalida = () => {
    return useContext(SalidaContext);
}