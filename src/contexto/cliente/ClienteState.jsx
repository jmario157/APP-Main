import React, { useEffect, useReducer, useState } from "react"
import { ClienteContext } from "./ClienteContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarClientes, listarLugares, listarProfesiones } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";


export const ClienteState = (props) => {
    const [cliente, setCliente] = useState(null);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaLugares, setListaLugares] = useState([]);
    const [listaProfesiones, setListaProfesiones] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    useEffect(()=>{
        Lista();
    },[]);
    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarClientes);
            setListaClientes(response.data.datos);
            const responseLugares = await AxiosPrivado.get(listarLugares);
            console.log(responseLugares.data)
            setListaLugares(responseLugares.data.datos);
            const responseProfesiones = await AxiosPrivado.get(listarProfesiones);
            setListaProfesiones(responseProfesiones.data.datos);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ClienteContext.Provider value={{
            cliente: cliente,
            listaClientes: listaClientes,
            listaLugares: listaLugares,
            listaProfesiones: listaProfesiones,
            actualizar,
            setActualizar,
            setCliente,
            setListaClientes,
            setListaLugares,
            setListaProfesiones,
            Lista
        }}>
            {props.children}
        </ClienteContext.Provider>
    )
}

// export const ListarClientes = ()=>async ()=>{
//     var lista=[];
//     try {
//        const json = await AxiosPublico.get(listarClientes);
//        return json;

//     } catch (error) {
//         console.log(error);
//         lista= [];
//     }
//     return null;
// }
