import React, { useEffect, useState } from 'react';
import { CompraContext } from './CompraContext';
import { AxiosPrivado } from '../../components/axios/Axios';
import { listarCompras, listarProveedores, buscarIpCaja } from '../../components/apiUrls';

export const CompraState = (props) => {
    const [listaCompras, setListaCompras] = useState([]);
    const [listaProveedores, setListaProveedores] = useState([]);
    const [caja, setCaja] = useState({});

    useEffect(() => {
        Lista();
        console.log("se cargaron los datos");
    },[]);
    const Lista = async () => {
        try{
            const response= await AxiosPrivado.get(listarCompras)
            setListaCompras(response.data.datos);
            const responseProveedores= await AxiosPrivado.get(listarProveedores);
            setListaProveedores(responseProveedores.data.datos);
            const responseCaja = await AxiosPrivado.get(buscarIpCaja);
            setCaja(responseCaja.data.datos);
        }catch(error){
            console.log(error);
        }
    };

    return(
        <CompraContext.Provider value={{
            listaCompras: listaCompras, 
            listaProveedores: listaProveedores,
            caja:caja,
            setListaProveedores,
            setListaCompras,
            Lista
        }}>
            {props.children}
        </CompraContext.Provider>
    )
}