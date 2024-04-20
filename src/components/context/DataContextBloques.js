import React, {createContext, useState} from 'react'

export const DataContext = createContext();

export const DataBloquesProvider = ({children}) =>{


 const [bloquesArray, setBloquesArray] = useState([]);
 const [bloquesLista, setBloquesLista] = useState([]);
 
    return(
        <DataContext.Provider value={{
        bloquesArray, setBloquesArray, bloquesLista, setBloquesLista
        }}>
         {children} 
        </DataContext.Provider>
    )
}