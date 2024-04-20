import React, { useEffect, useState } from "react";
import $ from 'jquery';
import { AxiosPrivado } from "../axios/Axios";
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarSalidas } from "../apiUrls";
import ReactDOM from 'react-dom';
import { Link, useNavigate } from "react-router-dom";
import DetallesSalidaModal from '../../components/modals/Compras/modalInformacionSalidas';
import { ReporteSalidas } from '../../reportes/Salidas/ReporteSalidas';

const TablaSalidas = (props) => {
    const [listaSalidas, setListaSalidas] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
    const [mostrarReporte, setMostrarReporte] = useState(false);
    const [datosParaInforme, setDatosParaInforme] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        ActualizarTabla();
    }, []);

    useEffect(() => {
        crearTabla();
    }, [listaSalidas]);

    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarSalidas);
            setListaSalidas(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde, Revise su conexión");
        }
        setCargandoDatos(false);
    }

    const obtenerNombreCompletoEmpleado = (empleado) => {
        const nombres = [empleado.primernombre, empleado.segundonombre];
        const apellidos = [empleado.primerapellido, empleado.segundoapellido];
        
        // Filtra elementos nulos y concatena los nombres
        const nombreCompleto = [...nombres, ...apellidos].filter(Boolean).join(" ");

        return nombreCompleto || "Empleado no encontrado";
    }

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const fechaFormateada = fechaObj.toLocaleDateString() + " | Hora: " + fechaObj.toLocaleTimeString();
        return fechaFormateada;
    };

    const crearTabla = () => {
        if ($.fn.DataTable.isDataTable("#tablaSalidas")) {
            $("#tablaSalidas").DataTable().destroy();
        }

        let table = new DataTable("#tablaSalidas", {
            data: listaSalidas.map((salida) => ({
                ...salida,
                empleado: obtenerNombreCompletoEmpleado(salida.empleado),
            })),
            columns: [
                { 
                    "targets": 0,
                    "data": "id", 
                    "title": "ID de Salida" 
                },
                { 
                    "targets": 1,
                    "data": "fecha", 
                    "title": "Fecha",
                    render: function(data) {
                        return formatearFecha(data);
                    }
                },
                {
                    "targets": 2,
                    "data": "empleado", 
                    "title": "Empleado Encargado",
                },
                {
                    data: null,
                    title: "Opciones",
                    createdCell: (cell, cellData) => {
                        ReactDOM.render(
                            <button
                                className="btn btn-primary"
                                onClick={() => mostrarDetallesSalida(cellData)}
                            >
                                Ver Detalles
                            </button>,
                            cell
                        );
                    },
                },
            ],
            "paging": true,
            "lengthChange": false,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            destroy: true,
            drawCallback: function () {
                $('.dataTables_filter').find("[aria-controls='tablaSalidas']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    const mostrarDetallesSalida = (salida) => {
        setShowModal(true);
        setSalidaSeleccionada(salida);
        console.log("Salida seleccionada:", salida);
    }


    const abrirReporte = (datos) => {
        console.log("SALIDAS",datos)
        navigate(`/app/reportesalidas/${datos}`);
       
    }

    return (
        <div>
            <table
                id="tablaSalidas"
                className="table table-bordered table-hover"
            ></table>
            <Link to="/app/reportesalidas" state={datosParaInforme}>
                <button className="btn btn-primary">
                    Ver Reporte
                </button>
            </Link>
       

            {showModal && (
                <DetallesSalidaModal
                    salida={salidaSeleccionada}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}

       
        </div>
    );
}

export default TablaSalidas;

