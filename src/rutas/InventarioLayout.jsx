import { useOutlet} from "react-router-dom";
import { InventarioState } from "../contexto/inventario/InventarioState";

export const InventarioLayout = () =>{
    const outlet = useOutlet();
    return(
        <InventarioState>{outlet}</InventarioState>
    );
}