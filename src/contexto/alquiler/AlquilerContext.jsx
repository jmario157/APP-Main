import { createContext, useContext } from "react";
export const AlquilerContext = createContext();

export const useContextAlquiler = () =>{
    return useContext(AlquilerContext);
}