import { Suspense } from "react";
import { useOutlet} from "react-router-dom";
import { InventarioState } from "../contexto/inventario/InventarioState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const InventarioLayout = () =>{
    const outlet = useOutlet();
    return(
        <InventarioState>{outlet}</InventarioState>
    );
}