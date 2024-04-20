import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { AxiosPrivado } from '../axios/Axios';
import { mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarAperturas, listarEtapaId, listarEtapas, listarProyectos } from "../apiUrls";
import { useContextCaja } from "../../contexto/caja/CajaContext";
import ModalAperturaForm from "../modals/aperturas/modalApertura";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import moment from "moment";

const TablaAperturas = (props) => {
    const { listaAperturas, setListaAperturas, caja } = useContextCaja();
    const { usuario } = useContextUsuario();
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaAperturas])
    const ActualizarTabla = async () => {
        if (listaAperturas.length > 0) {
            try {
                const response = await AxiosPrivado.get(listarAperturas);
                setListaAperturas(response.data.datos);

            } catch (error) {
                console.log(error);
                mostraAlertaError("El servidor no responde. Revise su conexión.");
                //mostraAlertaModificar();
            }
        }

    }
    const CrearTabla = () => {
        let table = new DataTable('#tablaAperturas', {
            data: listaAperturas,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "createdAt",
                    "title": "Fecha",
                    render: (data, type, row) => moment(row.createdAt).format('DD-MM-YYYY, h:mm:ss a')
                },
                {
                    "targets": 2,
                    "data": "efectivo",
                    "title": "Efectivo",
                    render: (data, type, row) => "L "+ new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.efectivo)
                },
                {
                    "targets": 3,
                    "data": "caja.nombre",
                    "title": "Caja",
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "Usuario",
                    render: (data, type, row) => row.usuario.empleado.primernombre + ' ' + row.usuario.empleado.segundonombre + ' ' + row.usuario.empleado.primerapellido + ' ' + row.usuario.empleado.primerapellido
                },
                {
                    "targets": 5,
                    "data": "anulado",
                    "title": "Anulado",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <span className={rowData.anulado?"float-right badge bg-danger":"float-right badge bg-success"}>{rowData.anulado?'Si':'No'}</span>
                        );
                    }
                },
                {
                    "targets": 6,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <ModalAperturaForm key={rowData.id} accion={false} datosApertura={rowData} datosCaja={caja} ActualizarTabla={ActualizarTabla} datosUsuario={usuario}></ModalAperturaForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaAperturas']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }


    return (
        <div>
            <table id="tablaAperturas" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaAperturas;