import { createContext, useContext } from "react";
export const ContratoContext = createContext();

export const useContextContrato=()=>{
    return useContext(ContratoContext);
}