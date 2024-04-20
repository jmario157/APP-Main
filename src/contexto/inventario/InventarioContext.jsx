import { createContext, useContext } from "react";
export const InventarioContext = createContext();

export const useContextInventario = () =>{
    return useContext(InventarioContext);
}