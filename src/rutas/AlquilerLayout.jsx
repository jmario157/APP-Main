import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AlquilerState } from "../contexto/alquiler/AlquilerState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const AlquilerLayout = () =>{
    const outlet = useOutlet();
    return(
        <AlquilerState>{outlet}</AlquilerState>
    );
}