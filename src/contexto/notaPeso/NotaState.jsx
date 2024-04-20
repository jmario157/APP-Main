import React, { useEffect, useState } from "react"
import { NotaContext } from "./NotaContext"
import { AxiosPrivado } from "../../components/axios/Axios";
import { listarNotaPeso, listarClientes, listarProductos, listarDetalle } from "../../components/apiUrls";

export const NotaState = (props) => {
    // Estados para almacenar los datos de las notas de peso, clientes, productos y detalles
    const [notaPeso, setNotaPeso] = useState(null);
    const [listaNotaPeso, setListaNotaPeso] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [listaDetalle, setListaDetalle] = useState([]);
    const [actualizar, setActualizar] = useState(false);

    // Se ejecuta al cargar el componente para obtener las listas de notas de peso, clientes, productos y detalles
    useEffect(() => {
        Lista();
        //console.log(Lista)
    }, []);
    // Función para obtener las listas de notas de peso, clientes, productos y detalles desde la API
    const Lista = async () => {
        try{
            const response = await AxiosPrivado.get(listarNotaPeso)
            setListaNotaPeso(response.data.datos);
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

    // Proporciona el estado y las funciones relacionadas con las notas de peso a los componentes hijos
    return (
        <NotaContext.Provider value={{
            notaPeso: notaPeso,
            listaNotaPeso: listaNotaPeso,
            listaClientes: listaClientes,
            listaProductos: listaProductos,
            listaDetalle: listaDetalle,
            actualizar,
            setActualizar,
            setNotaPeso,
            setListaNotaPeso,
            setListaClientes,
            setListaProductos,
            setListaDetalle,
            Lista
        }}>
            {props.children}
        </NotaContext.Provider>
    )
} 