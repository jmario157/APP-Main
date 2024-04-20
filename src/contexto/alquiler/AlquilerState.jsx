import React, { useEffect, useReducer, useState } from "react"
import { AlquilerContext } from "./AlquilerContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarAlquileres, listarLugares } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";

export const AlquilerState = (props) => {
    const [listaAlquileres, setListaAlquileres] = useState([]);
    const [actualizarAlquileres, setActualizarAlquileres] = useState(false);

    useEffect(() => {
        ListaAlquiler();
    }, []);
    const ListaAlquiler= async () => {
        try {
            const response =  await AxiosPrivado.get(listarAlquileres);
            setListaAlquileres(response.data.datos);
        }catch (error) {
            console.log(error);
        }
    };

    return (
        <AlquilerContext.Provider value={{ 
            listaAlquileres,
            setListaAlquileres,
            actualizarAlquileres,
            setActualizarAlquileres,
            ListaAlquiler
            }}>
                { props.children}
        </AlquilerContext.Provider>
    )
}