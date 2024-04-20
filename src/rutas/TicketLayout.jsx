import { useOutlet } from "react-router-dom";
import { TicketState } from "../contexto/ticket/ticketState";

export const TicketLayout = () =>{
    const outlet = useOutlet();

    return(
        <TicketState>{outlet}</TicketState>
    )
}