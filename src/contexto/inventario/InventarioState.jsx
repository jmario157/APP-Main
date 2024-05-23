import React, { useEffect, useState } from "react"
import { InventarioContext } from "./InventarioContext"
import { AxiosPrivado} from "../../components/axios/Axios";
import { listarInventario, listarProductos } from "../../components/apiUrls";

export const InventarioState = (props) => {
    // Estado para el inventario actual
    const [inventario, setInventario] = useState(null);
    // Estado para la lista de inventario
    const [listaInventario, setListaInventario] = useState([]);
    // Estado para la lista de productos
    const [listaProducto, setListaProducto] = useState([]);
    // Estado para indicar si se debe actualizar el inventario
    const [actualizarInventario, setActualizarInventario] = useState(false);

    // Obtener la lista de inventario y productos al cargar el componente
    useEffect(() => {
        ListaInventario();
    }, []);
    const ListaInventario= async () => {
        try {
            // Obtener la lista de inventario
            const response =  await AxiosPrivado.get(listarInventario);
            setListaInventario(response.data.datos);
            // Obtener la lista de productos
            const responseProducto =  await AxiosPrivado.get(listarProductos);
            setListaProducto(responseProducto.data.datos);
        }catch (error) {
            console.log(error);
        }
    };

    // Contexto que proporciona los valores y funciones necesarios a los componentes hijos
    return (
        <InventarioContext.Provider value={{ 
            inventario: inventario,
            listaInventario: listaInventario,
            ListaProductos: listaProducto,
            setInventario,
            setListaInventario,
            actualizarInventario,
            setActualizarInventario,
            setListaProducto,
            ListaInventario,
            listaProducto
            }}>
                { props.children}
        </InventarioContext.Provider>
    )
}