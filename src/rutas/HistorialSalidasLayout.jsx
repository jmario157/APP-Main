import { useOutlet } from "react-router-dom";
import { SalidaState } from "../contexto/compra/SalidaState";

export const HistorialSalidasLayout = () => {
    const outlet = useOutlet();

    return(<SalidaState>{outlet}</SalidaState>)
}