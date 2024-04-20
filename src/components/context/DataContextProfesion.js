import React, {createContext, useState} from 'react'

export const DataContextProfesion = createContext();
export const DataProfesionProvider = ({children}) =>{
 const [profesionArrar, setProfesionArray] = useState([]);
 const [profesionLista, setProfesionLista] = useState([]);

 
    return(
        <DataContextProfesion.Provider value={{
        profesionArrar, setProfesionArray,
         profesionLista, setProfesionLista, 
     
        }}>
         {children} 
        </DataContextProfesion.Provider>
    )
}