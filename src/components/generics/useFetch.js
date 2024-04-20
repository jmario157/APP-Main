import {useState, useEffect} from "react";

export function useFetch(url){
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(true);


    useEffect(() => {
        setCargando(true);
        fetch(url)
        .then((response) => response.json())
        .then((data) => setDatos(data))
        .catch((error) => setError(error))
        .finally(() => setCargando(false));
    }, []);

    return {datos, cargando,error};
}