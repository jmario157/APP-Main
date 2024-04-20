import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalAlquilerForm from "../modals/alquiler/modalAlquiler";
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlerta, mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextAlquiler } from "../../contexto/alquiler/AlquilerContext";
import { listarAlquileres } from "../apiUrls";
import Cargando from "../Cargando"

const TablaAlquiler = (props) => {
    const { listaAlquileres, setListaAlquileres } = useContextAlquiler();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaAlquileres])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarAlquileres);
            setListaAlquileres(response.data.datos);
            console.log(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexion.");
        }
        setCargandoDatos(false);
    }

    const CrearTabla = () => {
        console.log("Se actualizo")
        let table = new DataTable('#tablaAlquiler', {
            data: listaAlquileres,
            "columnDefs": [
                {
                    "target": 0,
                    "data": "id",
                    "title": "Id"
                },
                {
                    "target": 1,
                    "data": "maquinaria",
                    "title": "Maquinaria"
                },
                {
                    "target": 2,
                    "data": "duracion",
                    "title": "Duracion"
                },
                {
                    "target": 3,
                    "data": "costo",
                    "title": "Costo"
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalAlquilerForm key={rowData.id} accion={false} datosAlquileres={rowData} ActualizarTabla={ActualizarTabla}></ModalAlquilerForm>
                        );
                    }
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
                $('.dataTables_filter').find("[aria-controls='tablaAlquiler']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }
    return (
        <div>
            <table id="tablaAlquiler" className="table table-bordered table-hover"></table>
        </div>
    );
}

export default TablaAlquiler;