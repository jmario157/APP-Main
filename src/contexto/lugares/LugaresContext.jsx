import { createContext, useContext } from "react";
export const LugaresContext = createContext();

export const useContextLugares=()=>{
    return useContext(LugaresContext);
}