import React, { useEffect, useState } from "react"
import { FacturaContext } from "./facturaContext"
import { AxiosPrivado } from "../../components/axios/Axios";
import { listarFactura, listarNotaPeso, listarClientes, listarProductos, listarDetalle } from "../../components/apiUrls";

export const FacturaState = (props) => {
    // Definición de los estados
    const [factura, setFactura] = useState(null);
    const [listaFactura, setListaFactura] = useState([]);
    const [listaNotaPeso, setListaNotaPeso] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [listaDetalle, setListaDetalle] = useState([]);
    const [actualizar, setActualizar] = useState(false);

    // useEffect para cargar la lista de facturas y otros datos al cargar el componente
    useEffect(() => {
        Lista();// Llama a la función Lista al cargar el componente
        //console.log(Lista)
    }, []);
    // Función para cargar las listas de facturas, notas de peso, clientes, productos y detalles
    const Lista = async () => {
        try{
            const response = await AxiosPrivado.get(listarFactura)
            setListaFactura(response.data.datos)
            const responseNotaPeso = await AxiosPrivado.get(listarNotaPeso)
            setListaNotaPeso(responseNotaPeso.data.datos);
            const responseClientes = await AxiosPrivado.get(listarClientes)
            console.log(responseClientes.data)
            setListaClientes(responseClientes.data.datos);
            const responseProductos = await AxiosPrivado.get(listarProductos)
            console.log(responseProductos.data)
            setListaProductos(responseProductos.data.datos);
            const responseDetalle = await AxiosPrivado.get(listarDetalle)
            console.log(responseProductos.data)
            setListaDetalle(responseDetalle.data.datos);
        } catch (error){
            console.log(error);
        }
    };

    // Renderiza el contexto proporcionando los estados y funciones necesarios a los componentes hijos
    return (
        <FacturaContext.Provider value={{
            factura: factura,
            listaFactura: listaFactura,
            listaNotaPeso: listaNotaPeso,
            listaClientes: listaClientes,
            listaProductos: listaProductos,
            listaDetalle: listaDetalle,
            actualizar,
            setActualizar,
            setFactura,
            setListaFactura,
            setListaNotaPeso,
            setListaClientes,
            setListaProductos,
            setListaDetalle,
            Lista
        }}>
            {props.children}
        </FacturaContext.Provider>
    )
} 