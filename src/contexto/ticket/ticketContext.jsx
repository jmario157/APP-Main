import { createContext, useContext } from "react";
export const TicketContext = createContext();

export const useContextTicket = () =>{
    return useContext(TicketContext);
}