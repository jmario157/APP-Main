import { createContext, useContext } from "react";
export const CajaContext = createContext();

export const useContextCaja=()=>{
    return useContext(CajaContext);
}