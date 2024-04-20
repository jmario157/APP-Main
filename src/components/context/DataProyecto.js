import React, {createContext, useState} from 'react'

export const DataContext = createContext();

export const DataProjectProvider = ({children}) =>{


 const [proyectoArray, setProyectoArray] = useState([]);
 const [proyectoLista, setProyectoLista] = useState([]);
 
    return(
        <DataContext.Provider value={{
        proyectoArray, setProyectoArray, proyectoLista, setProyectoLista
        }}>
         {children} 
        </DataContext.Provider>
    )
}