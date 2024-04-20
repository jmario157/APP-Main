import React, {createContext, useState} from 'react'

export const DataContext = createContext();

export const DataEmpleadoProvider = ({children}) =>{

 const [data, setData] = useState([]);
 const [empleadoArray, setEmpleadoArray] = useState([]);
 const [proyectoArray, setPoyectoArray] = useState([]);
 
    return(
        <DataContext.Provider value={{data, setData, 
        empleadoArray, setEmpleadoArray,
        proyectoArray, setPoyectoArray
        }}>
         {children} 
        </DataContext.Provider>
    )
}