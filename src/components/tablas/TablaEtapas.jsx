import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { AxiosPrivado } from '../axios/Axios';
import { mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarEtapaId, listarEtapas, listarProyectos } from "../apiUrls";
import { Button } from "react-bootstrap";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
import ModalProyectoForm from "../modals/inmuebles/modalProyecto";
import ModalEtapaForm from "../modals/inmuebles/modalEtapa";

const TablaEtapas = (props) => {
    const { listaEtapas, setListaEtapas, listaProyectos } = useContextInmobiliario();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaEtapas])
    const ActualizarTabla = async () => {
        if (listaEtapas.length > 0) {
            try {
                const response = await AxiosPrivado.get(listarEtapas);
                setListaEtapas(response.data.datos);

            } catch (error) {
                console.log(error);
                mostraAlertaError("El servidor no responde. Revise su conexión.");
                //mostraAlertaModificar();
            }
        }

    }
    const CrearTabla = () => {
        let table = new DataTable('#tablaEtapas', {
            data: listaEtapas,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "nombre",
                    "title": "Nombre",
                },
                {
                    "targets": 2,
                    "data": "descripcion",
                    "title": "Descripcion",
                },
                {
                    "targets": 3,
                    "data": "proyecto.nombre",
                    "title": "Proyecto",
                },
                {
                    "targets": 4,
                    "data": "activo",
                    "title": "Estado",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <span className={rowData.activo?"float-right badge bg-success":"float-right badge bg-danger"}>{rowData.activo?'Activo':'Inactivo'}</span>
                        );
                    }
                },
                {
                    "targets": 5,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <ModalEtapaForm key={rowData.id} accion={false} datosEtapa={rowData} datosProyectos={listaProyectos} ActualizarTabla={ActualizarTabla}></ModalEtapaForm>
                        );
                    }
                },
            ],
            "paging": true,
            "lengthChange": true,
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
                $('.dataTables_filter').find("[aria-controls='tablaEtapas']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }


    return (
        <div>
            <table id="tablaEtapas" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaEtapas;