import { useOutlet } from "react-router-dom";
import { CompraState } from "../contexto/compra/CompraState";

export const GraficosLayout = () =>{
    const outlet = useOutlet();

    return(<CompraState>{outlet}</CompraState>)
}