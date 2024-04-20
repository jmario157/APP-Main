import React, {useEffect,useState} from 'react';
import { AxiosPrivado } from '../../components/axios/Axios';
import { listarProductos, listarEmpleado, listarSalidas } from '../../components/apiUrls';
import { SalidaContext } from './SalidaContext';


export const SalidaState = (props) => {
    const [listaProductos, setListaProductos] = useState([]);
    const [listaEmpleados, setListaEmpleados] = useState([]);
    const [listaSalidas, setListaSalidas] = useState([]);

    useEffect(() => {
        Lista();
        console.log("se cargaron los datos");
    },[]);

    const Lista = async ()=> {
        try {
            const responseProductos = await AxiosPrivado.get(listarProductos);
            setListaProductos(responseProductos.data.datos);
            const responseEmpleados = await AxiosPrivado.get(listarEmpleado);
            setListaEmpleados(responseEmpleados.data.datos);
            const responseSalidas = await AxiosPrivado.get(listarSalidas);
            setListaSalidas(responseSalidas.data.datos);
        }catch(error) {
            console.log(error);
        }
    };

    return(
        <SalidaContext.Provider value={{
            listaProductos: listaProductos,
            listaEmpleados: listaEmpleados,
            listaSalidas: listaSalidas,
            setListaProductos,
            setListaEmpleados,
            setListaSalidas,
            Lista
        }}>
            {props.children}
            </SalidaContext.Provider>
    )
}