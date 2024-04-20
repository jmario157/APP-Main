import { createContext, useContext } from "react";
export const FacturaContext = createContext();

export const useContextFactura = () =>{
    return useContext(FacturaContext);
}