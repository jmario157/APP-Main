import {  useOutlet } from "react-router-dom";
import { AlquilerState } from "../contexto/alquiler/AlquilerState";

export const AlquilerLayout = () =>{
    const outlet = useOutlet();
    return(
        <AlquilerState>{outlet}</AlquilerState>
    );
}