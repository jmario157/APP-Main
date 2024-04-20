import React, { useReducer, useState, useEffect } from "react"
import { InmobiliarioContext } from "./InmobiliarioContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarBloques, listarContratos, listarEtapas, listarLotes, listarLugares, listarProyectos } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";

export const InmobiliarioState = (props) => {
    const [proyecto, setProyecto] = useState({});
    const [listaProyectos, setListaProyectos] = useState([]);
    const [etapa, setEtapa] = useState({});
    const [listaEtapas, setListaEtapas] = useState([]);
    const [bloque, setBloque] = useState({});
    const [listaBloques, setListaBloques] = useState([]);
    const [lote, setLote] = useState({});
    const [listaLotes, setListaLotes] = useState([]);
    const [listaLugares, setListaLugares] = useState([]);
    useEffect((()=>{
        CargarDatos();
    }),[])
    const CargarDatos = async () => {
        try {
            const response = await AxiosPrivado.get(listarProyectos);
            setListaProyectos(response.data.datos);
            const responseEtapas = await AxiosPrivado.get(listarEtapas);
            setListaEtapas(responseEtapas.data.datos);
            const responseBloques = await AxiosPrivado.get(listarBloques);
            setListaBloques(responseBloques.data.datos);
            const responseLotes = await AxiosPrivado.get(listarLotes);
            setListaLotes(responseLotes.data.datos);
            const responseLugares = await AxiosPrivado.get(listarLugares);
            setListaLugares(responseLugares.data.datos);
          } catch (error) {
            console.log(error);
          }
    };
    const ActualizarProyectos = async () => {
        try {
            const response = await AxiosPrivado.get(listarProyectos);
            setListaProyectos(response.data.datos);
          } catch (error) {
            console.log(error);
          }
    };
    return (
        <InmobiliarioContext.Provider value={{
            proyecto: proyecto,
            listaProyectos: listaProyectos,
            etapa: etapa,
            listaEtapas: listaEtapas,
            bloque: bloque,
            listaBloques: listaBloques,
            lote: lote,
            listaLotes: listaLotes,
            listaLugares: listaLugares,
            setProyecto,
            setListaProyectos,
            setEtapa,
            setListaEtapas,
            setBloque,
            setListaBloques,
            setLote,
            setListaLotes,
            setListaLugares,
            CargarDatos,
            ActualizarProyectos
        }}>
            {props.children}
        </InmobiliarioContext.Provider>
    )
}
