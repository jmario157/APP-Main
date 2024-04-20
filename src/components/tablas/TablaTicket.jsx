import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalTicketForm from "../modals/ticket/modalTicket";
import { AxiosPrivado } from '../axios/Axios';
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextTicket } from "../../contexto/ticket/ticketContext";
import { listarTicket } from "../apiUrls.js";
import Cargando from "../Cargando"

const TablaTicket = (props) => {
    const { listaTicket, setListaTicket } = useContextTicket();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaTicket])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarTicket);
            setListaTicket(response.data.datos);
            console.log(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexion.");
        }
        setCargandoDatos(false);
    }

    const CrearTabla = () => {
        console.log("Se actualizo")
        let table = new DataTable('#tablaTicket', {
            data: listaTicket,
            "columnDefs": [
                {
                    "target": 0,
                    "data": "id",
                    "title": "Id"
                },
                {
                    "target": 1,
                    "data": "titulo",
                    "title": "Titulo"
                },
                {
                    "target": 2,
                    "data": "descripcion",
                    "title": "Descripcion"
                },
                {
                    "targets": 3,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalTicketForm key={rowData.id} accion={false} datosTicket={rowData} ActualizarTabla={ActualizarTabla}></ModalTicketForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaTicket']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }
    return (
        <div>
            <table id="tablaTicket" className="table table-bordered table-hover"></table>
        </div>
    );
}

export default TablaTicket;