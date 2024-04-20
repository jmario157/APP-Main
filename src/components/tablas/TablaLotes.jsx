import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { AxiosPrivado } from '../axios/Axios';
import { mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarLotes } from "../apiUrls";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
import ModalBloqueForm from "../modals/inmuebles/modalBloque";
import { Button } from "react-bootstrap";
import ModalInformacionLote from "../modals/inmuebles/modalInformacionLote";

const TablaLotes = (props) => {
    const { listaLotes, setListaLotes } = useContextInmobiliario();
    const navigate = useNavigate();
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaLotes])
    const ActualizarTabla = async () => {
        if (listaLotes.length > 0) {
            try {
                const response = await AxiosPrivado.get(listarLotes);
                setListaLotes(response.data.datos);
            } catch (error) {
                console.log(error);
                mostraAlertaError("El servidor no responde. Revise su conexión.");
                //mostraAlertaModificar();
            }
        }

    }
    const seleccionEditar = (e) => {
        const id = e.target.value;
        navigate("/app/inmobiliario/loteeditar/"+id);
    }
    const CrearTabla = () => {
        let table = new DataTable('#tablaLotes', {
            data: listaLotes,
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
                    "data": "proyecto.nombre",
                    "title": "Proyecto",
                },
                {
                    "targets": 3,
                    "data": "etapa.nombre",
                    "title": "Etapa",
                },
                {
                    "targets": 4,
                    "data": "bloque.nombre",
                    "title": "Bloque",
                },
                {
                    "targets": 5,
                    "data": "activo",
                    "title": "Estado",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <span className={rowData.activo ? "float-right badge bg-success" : "float-right badge bg-danger"}>{rowData.activo ? 'Activo' : 'Inactivo'}</span>
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
                            <div>
                                <ModalInformacionLote datos={rowData}></ModalInformacionLote>
                                <Button variant="warning" value={rowData.id} onClick={e => seleccionEditar(e, "value")}>Editar
                                </Button>
                            </div>
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
                $('.dataTables_filter').find("[aria-controls='tablaLotes']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }


    return (
        <div>
            <table id="tablaLotes" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaLotes;