import React, { useReducer, useState, useEffect } from "react"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { buscarIpCaja, listarAperturas, listarBloques, listarClientes, listarContratos, listarEtapas, listarLotes, listarLugares, listarPagos, listarProyectos } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { PagoContext } from "./PagoContext";
import { useContextUsuario } from "../usuario/UsuarioContext";

export const PagoState = (props) => {
    const { usuario, caja, estacion } = useContextUsuario();
    const [pago, setPago] = useState({});
    const [listaPagos, setListaPagos] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaContratos, setListaContratos] = useState([]);
    const [listaCuotas, setListaCuotas] = useState([]);
    const [amortizaciones, setAmortizaciones] = useState([]);
    useEffect((()=>{
        CargarDatos();
    }),[])
    const CargarDatos = async () => {
        try {
            const response = await AxiosPrivado.get(listarPagos);
            setListaPagos(response.data.datos);
            const responseClientes = await AxiosPrivado.get(listarClientes);
            setListaClientes(responseClientes.data.datos);
          } catch (error) {
            console.log(error);
          }
    };
    const ActualizarPagos = async () => {
        try {
            const response = await AxiosPrivado.get(listarPagos);
            setListaPagos(response.data.datos);
          } catch (error) {
            console.log(error);
          }
    };
    return (
        <PagoContext.Provider value={{
            listaPagos: listaPagos,
            listaClientes: listaClientes,
            listaContratos: listaContratos,
            listaCuotas: listaCuotas,
            amortizaciones: amortizaciones,
            caja: caja,
            setAmortizaciones,
            setListaContratos,
            setListaCuotas,
            setListaPagos,
            CargarDatos,
            ActualizarPagos
        }}>
            {props.children}
        </PagoContext.Provider>
    )
}
