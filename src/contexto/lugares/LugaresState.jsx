import React, { useState, useEffect } from "react"
import { AxiosPrivado } from "../../components/axios/Axios";
import { listarDepartamentos, listarLugares, listarMunicipios, listarPaises } from "../../components/apiUrls";
import { LugaresContext } from "./LugaresContext";

export const LugaresState = (props) => {
    const [lugar, setLugar] = useState({});
    const [listaPaises, setListaPaises] = useState([]);
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    const [listaMunicipios, setListaMunicipios] = useState([]);
    const [listaLugares, setListaLugares] = useState([]);
    useEffect((()=>{
        CargarDatos();
        console.log("Cargo los datos");
    }),[])
    const CargarDatos = async () => {
        try {
            const response = await AxiosPrivado.get(listarDepartamentos);
            setListaDepartamentos(response.data.datos);
            const responseMunicipios = await AxiosPrivado.get(listarMunicipios);
            setListaMunicipios(responseMunicipios.data.datos);
            const responseLugares = await AxiosPrivado.get(listarLugares);
            setListaLugares(responseLugares.data.datos);
            const responsePaises = await AxiosPrivado.get(listarPaises);
            setListaPaises(responsePaises.data.datos);
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <LugaresContext.Provider value={{
            listaLugares: listaLugares,
            listaDepartamentos: listaDepartamentos,
            listaMunicipios: listaMunicipios,
            listaPaises: listaPaises,
            setListaLugares,
            setListaDepartamentos,
            setListaMunicipios,
            setListaPaises,
            CargarDatos
        }}>
            {props.children}
        </LugaresContext.Provider>
    )
}
