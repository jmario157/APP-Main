import React, {createContext, useState} from 'react'

export const DataContext = createContext();

export const DataEtapasProvider = ({children}) =>{
 const [etapasArray, setEtapaArray] = useState([]);
 const [etapaLista, setEtapaLista] = useState([]);
 
    return(
        <DataContext.Provider value={{
        etapasArray, setEtapaArray, etapaLista, setEtapaLista
        }}>
         {children} 
        </DataContext.Provider>
    )
}