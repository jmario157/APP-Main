import React, { useState, useEffect } from 'react';
import { listarMovimientosProductos } from '../../components/apiUrls';
import ComponenteFiltrado from './Filtros';
import ReporteMovimientosProductos from './ReporteMovimientos';

const ComponentePadre = ({productoId}) => {
    const [productId, setProductoId] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [datosMovimientos, setDatosMovimientos] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [salidas, setSalidas] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [productoNombre, setProductoNombre] = useState(null);

    useEffect(() => {
        fetch(listarMovimientosProductos + productoId)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.datos);
                const datos = data.datos;
                setProductoNombre(datos[0].producto.nombre);
                setDatosMovimientos(datos);
                setEntradas(filtrarEntradas(datos));
                setSalidas(filtrarSalidas(datos));
            })
            .catch((error) => console.error(error));
    }, [productoId]);

    const filterByMonth = (month) => {
        setSelectedMonth(month);
        // Filtrar los datos por mes aquí y actualizar entradas y salidas.
    };

    const showAll = () => {
        setSelectedMonth('');
        setFechaInicio(null);
        setFechaFin(null);
        setEntradas(filtrarEntradas(datosMovimientos));
        setSalidas(filtrarSalidas(datosMovimientos));
    };
    

    // Función para filtrar las entradas
    const filtrarEntradas = (datos) => {
        return datos.filter((movimiento) => movimiento.tipo === 'entrada');
    };

    // Función para filtrar las salidas
    const filtrarSalidas = (datos) => {
        return datos.filter((movimiento) => movimiento.tipo === 'salida');
    };

    // Función para filtrar los datos por fecha
    const filtrarPorFechas = (datos, fechaInicio, fechaFin) => {
        if (fechaInicio && fechaFin) {
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            fechaFinObj.setDate(fechaFinObj.getDate() + 1);

            const datosFiltrados = datos.filter((movimiento) => {
                const fechaMovimiento = new Date(movimiento.movimientoRelacionado.fecha);
                return fechaMovimiento >= fechaInicioObj && fechaMovimiento <= fechaFinObj;
            });

            setEntradas(filtrarEntradas(datosFiltrados));
            setSalidas(filtrarSalidas(datosFiltrados));
        } else {
            // Si las fechas están vacías, mostrar todos los datos sin filtrar
            setEntradas(filtrarEntradas(datosMovimientos));
            setSalidas(filtrarSalidas(datosMovimientos));
        }
    };
    const applyDateFilter = () => {
        filtrarPorFechas(datosMovimientos, fechaInicio, fechaFin);
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
            <ReporteMovimientosProductos
                productoId={productoId}
                productoNombre={productoNombre}
                entradas={entradas}
                salidas={salidas}
                selectedMonth={selectedMonth}
            />
        </div>
    );
};
export default ComponentePadre;
