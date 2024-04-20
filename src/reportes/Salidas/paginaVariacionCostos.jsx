import React, { useState, useEffect } from 'react';
import { listarVariacionCostos } from '../../components/apiUrls'; 
import ComponenteFiltrado from './Filtros';
import ReporteVariacionCostos from './reporteVariacionCostos'; 

const ComponentePadre = ({ productoId, nombre }) => {
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [variacionesCostos, setVariacionesCostos] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [productoNombre, setProductoNombre] = useState(null);
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        fetch(listarVariacionCostos + productoId) // Obtén los datos de variación de costos
            .then((response) => response.json())
            .then((data) => {
                const datos = data.datos;
                setProductoNombre(nombre);
                setVariacionesCostos(datos);
                setDatos(datos);
            })
            .catch((error) => console.error(error));
            console.log("aqui los datos:",datos);
            console.log(nombre)
    }, [productoId]);

    const filterByMonth = (month) => {
        setSelectedMonth(month);
        // Filtrar los datos de variación de costos por mes aquí.
    };

    const showAll = () => {
        setSelectedMonth('');
        setFechaInicio(null);
        setFechaFin(null);
        console.log("aqui los datos:",datos)
        // Restaura los datos de variación de costos sin filtrar
        setVariacionesCostos(datos); // Asegúrate de que data.datos tenga la estructura adecuada
    };

    
       

    // Función para filtrar los datos de variación de costos por fecha
    const filtrarPorFechas = (datos, fechaInicio, fechaFin) => {
        if (fechaInicio && fechaFin) {
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            fechaFinObj.setDate(fechaFinObj.getDate() + 1);

            const datosFiltrados = datos.filter((variacion) => {
                const fechaVariacion = new Date(variacion.fechaCompra);
                return fechaVariacion >= fechaInicioObj && fechaVariacion <= fechaFinObj;
            });

            setVariacionesCostos(datosFiltrados);
        } else {
            // Si las fechas están vacías, mostrar todos los datos sin filtrar
            setVariacionesCostos(datos); // Asegúrate de que data.datos tenga la estructura adecuada
        }
    };

    const applyDateFilter = () => {
        filtrarPorFechas(variacionesCostos, fechaInicio, fechaFin);
        setSelectedMonth('');
    };

    return (
    
        <div>
            
            <ComponenteFiltrado
                setFechaInicio={setFechaInicio}
                setFechaFin={setFechaFin}
                filterByMonth={filterByMonth}
                showAll={showAll}
                applyDateFilter={applyDateFilter}
            />
            <ReporteVariacionCostos
                variacionesCostos={variacionesCostos}
                productoNombre={productoNombre}
                selectedMonth= {selectedMonth}
            />
        </div>
    );
};

export default ComponentePadre;
