import { useOutlet } from "react-router-dom";
import { NotaState } from "../contexto/notaPeso/NotaState";

export const NotaPesoLayout = () => {
    const outlet = useOutlet();

    return (
        <NotaState>{outlet}</NotaState>
    );
}