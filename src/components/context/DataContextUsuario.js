import React, {createContext, useState} from 'react'

export const DataContext = createContext();

export const DataUsuarioProvider = ({children}) =>{
 const [usuariosArray, setUsuarioArray] = useState([]);
 const [usuarioLista, setUsuarioLista] = useState([]);
 const [token, setToken] = useState("");
 
    return(
        <DataContext.Provider value={{
        usuariosArray, setUsuarioArray, 
        usuarioLista, setUsuarioLista,
        token, setToken
        }}>
         {children} 
        </DataContext.Provider>
    )
}