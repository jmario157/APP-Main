import React from "react"
import { useSessionStorage } from "../storage/useSessionStorage"
import { EmpleadoContext } from "./EmpleadoContext";

const EmpleadoState = (props) => {
    const [usuario, setUsuario] = useSessionStorage("usuario_almacenado",null);
    const [token, setToken] = useSessionStorage("toke_almacenado",null);
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
    return (
        <EmpleadoContext.Provider value={{
            usuario: usuario,
            token: token,
            setLogin,
            setCerrarSesion,
        }}>
            {props.children}
        </EmpleadoContext.Provider>
    )
}
export default EmpleadoState;
