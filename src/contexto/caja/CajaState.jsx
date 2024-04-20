import React, { useReducer, useState, useEffect } from "react"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { buscarIpCaja, listarAperturas, listarBloques, listarCierres, listarContratos, listarEtapas, listarLotes, listarLugares, listarProyectos } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { CajaContext } from "./CajaContext";
import { useContextUsuario } from "../usuario/UsuarioContext";

export const CajaState = (props) => {
    const [caja, setCaja] = useState({});
    const [listaCajas, setListaCajas] = useState([]);
    const [listaAperturas, setListaAperturas] = useState([]);
    const [listaCierres, setListaCierres] = useState([]);
    const [apertura, setApertura] = useState({});
    const { CargarDatosCaja } = useContextUsuario();
    useEffect((()=>{
        CargarDatos();
    }),[])
    const CargarDatos = async () => {
        try {
            const response = await AxiosPrivado.get(listarAperturas);
            setListaAperturas(response.data.datos);
            const responseCierres = await AxiosPrivado.get(listarCierres);
            setListaCierres(responseCierres.data.datos);
            const responseCaja = await AxiosPrivado.get(buscarIpCaja);
            setCaja(responseCaja.data.datos);
          } catch (error) {
            console.log(error);
          }
    };
    return (
        <CajaContext.Provider value={{
            caja: caja,
            listaAperturas: listaAperturas,
            listaCierres: listaCierres,
            CargarDatos,
            setListaAperturas,
            setListaCierres,
            CargarDatosCaja
        }}>
            {props.children}
        </CajaContext.Provider>
    )
}
