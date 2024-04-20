import { useOutlet } from "react-router-dom";
import { ProveedorState } from "../contexto/compra/ProveedorState";

export const ProveedorLayout = () => {
    const outlet = useOutlet();

    return (<ProveedorState>{outlet}</ProveedorState>);
}