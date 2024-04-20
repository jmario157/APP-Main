import { createContext, useContext } from "react";
export const PagoContext = createContext();

export const useContextPago=()=>{
    return useContext(PagoContext);
}