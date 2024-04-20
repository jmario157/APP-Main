import React, { useEffect, useState } from "react";
import { ProveedorContext } from "./ProveedorContext";
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarProveedores } from "../../components/apiUrls";

export const ProveedorState = (props) => {
   
    const [listaProveedores, setListaProveedores] = useState([]);
   
    useEffect(() => {
        Lista();
        console.log("Se cargaron los datos");
    },[]);
    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarProveedores);
            setListaProveedores(response.data.datos);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ProveedorContext.Provider value={{
            listaProveedores: listaProveedores,

            setListaProveedores,
            Lista
        }}>
            {props.children}
        </ProveedorContext.Provider>
    )
}


