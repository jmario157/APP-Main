import { createContext, useContext } from "react";

export const ProveedorContext = createContext();

export const useContextProveedor = () => {
    return useContext(ProveedorContext);
}