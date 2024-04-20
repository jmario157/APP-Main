import React, { useEffect, useState } from "react"
import { TicketContext } from "./ticketContext"
import { AxiosPrivado } from "../../components/axios/Axios";
import { listarTicket } from "../../components/apiUrls";

export const TicketState = (props) => {
    const [listaTickets, setListaTicket] = useState([]);
    const [actualizarTickets, setActualizarTickets] = useState(false);

    useEffect(() => {
        ListaTicket();
    }, []);
    const ListaTicket= async () => {
        try {
            const response =  await AxiosPrivado.get(listarTicket);
            setListaTicket(response.data.datos);
        }catch (error) {
            console.log(error);
        }
    };

    return (
        <TicketContext.Provider value={{ 
            listaTickets,
            setListaTicket,
            actualizarTickets,
            setActualizarTickets,
            ListaTicket
            }}>
                { props.children}
        </TicketContext.Provider>
    )
}