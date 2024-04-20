import React, {createContext, useState} from 'react'

export const DataContext = createContext();
export const DataLotesProvider = ({children}) =>{
 const [lotesArray, setLotesArray] = useState([]);
 const [lotesLista, setLotesLista] = useState([]);
 const [lotesAccion, setLotesAccion] = useState([]);
 const [lotesModificar, setLotesDividir] = useState([]);
 
    return(
        <DataContext.Provider value={{
        lotesArray, setLotesArray,
         lotesLista, setLotesLista, 
         lotesAccion, setLotesAccion,
         lotesModificar, setLotesDividir
        }}>
         {children} 
        </DataContext.Provider>
    )
}