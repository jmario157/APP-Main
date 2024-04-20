import React, {createContext, useState} from 'react'

export const DataContextCargo = createContext();

export const DataCargoProvider = ({children}) =>{

 const [cargos, setCargos] = useState([]);



    return(
        <DataContextCargo.Provider value={{cargos,setCargos}}>
         {children} 
        </DataContextCargo.Provider>
    )
}