import { useOutlet } from "react-router-dom";
import { FacturaState } from "../contexto/factura/facturaState";

export const FacturaLayout = () => {
    const outlet = useOutlet();

    return (
        <FacturaState>{outlet}</FacturaState>
    );
}