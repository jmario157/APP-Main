import { createContext, useContext } from "react";
export const NotaContext = createContext();

export const useContextNota = () =>{
    return useContext(NotaContext);
}