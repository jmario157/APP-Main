import React, { useEffect, useReducer, useState } from "react"
import { UsuarioContext } from "./UsuarioContext"
import { useSessionStorage } from "../storage/useSessionStorage"
import { buscarIpCaja, buscarIpEstacion } from "../../components/apiUrls";
import { AxiosPrivado } from "../../components/axios/Axios";

const UsuarioState = (props) => {
    const [usuario, setUsuario] = useSessionStorage("usuario_almacenado",null);
    const [token, setToken] = useSessionStorage("toke_almacenado",null);
    const [estacion, setEstacion] = useSessionStorage("estacion_almacenado",null);
    const [caja, setCaja] = useSessionStorage("caja_almacenado",null);
    const setCerrarSesion = () => {
        setUsuario(null);
        setToken(null);
    }
    const setLogin = async (data) => {
        try {
            setUsuario(data.usuario);
            setToken(data.token);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        CargarDatosCaja();
    },[])
    const CargarDatosCaja = async() =>{
        const responseEstacion = await AxiosPrivado.get(buscarIpEstacion);
        setEstacion(responseEstacion.data.datos);
        const responseCaja = await AxiosPrivado.get(buscarIpCaja);
        setCaja(responseCaja.data.datos);
    }
    return (
        <UsuarioContext.Provider value={{
            usuario: usuario,
            token: token,
            estacion: estacion,
            caja: caja,
            setLogin,
            setCerrarSesion,
            CargarDatosCaja,
        }}>
            {props.children}
        </UsuarioContext.Provider>
    )
}
export default UsuarioState;
