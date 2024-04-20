import { createContext, useContext } from "react";
export const InmobiliarioContext = createContext();

export const useContextInmobiliario=()=>{
    return useContext(InmobiliarioContext);
}