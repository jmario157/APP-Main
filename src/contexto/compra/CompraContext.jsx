import  { createContext, useContext } from "react";

export const CompraContext = createContext();

export const useContextCompra = () => {
    return useContext(CompraContext);
}