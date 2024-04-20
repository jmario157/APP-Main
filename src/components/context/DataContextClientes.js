import React, { createContext, useState } from 'react'

export const DataContextClientes = createContext();

export const DataClientesProvider = (props) => {

    const [clientesArray, setClientesArray] = useState([]);
    const [clientesLista, setClientesLista] = useState([]);
    const cargarLista = (lista) =>{
        setClientesLista(lista);
    };

    return (
        <DataContextClientes.Provider value={{
            clientesArray, setClientesArray, clientesLista, cargarLista
        }}>
            {props.children}
        </DataContextClientes.Provider>
    )
}
