import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarProyectos } from "../apiUrls";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import ModalInformacionProyecto from "../modals/inmuebles/modalInformacionProyecto";

const TablaProyectos = (props) => {
    const { listaProyectos, setListaProyectos, listaLugares } = useContextInmobiliario();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaProyectos])
    const ActualizarTabla = async () => {
        if (listaProyectos.length > 0) {
            try {
                const response = await AxiosPrivado.get(listarProyectos);
                setListaProyectos(response.data.datos);
            } catch (error) {
                console.log(error);
                mostraAlertaError("El servidor no responde. Revise su conexión.");
                //mostraAlertaModificar();
            }
        }

    }
    const CrearTabla = () => {
        let table = new DataTable('#tablaProyectos', {
            data: listaProyectos,
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
                    "data": null,
                    "title": "Lugar",
                    render: (data, type, row) => row.lugar.nombre + ', ' + row.lugar.municipio.nombre + ', ' + row.lugar.municipio.departamento.nombre
                },
                {
                    "targets": 4,
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
                    "targets": 5,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <div>
                                <ModalInformacionProyecto datos={rowData}></ModalInformacionProyecto>
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
                $('.dataTables_filter').find("[aria-controls='tablaProyectos']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }
    const seleccionEditar = (e) => {
        const id = e.target.value;
        navigate("/app/inmobiliario/proyectoeditar/"+id);
    }

    return (
        <div>
            <table id="tablaProyectos" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaProyectos;