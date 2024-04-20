import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { AxiosPrivado } from '../axios/Axios';
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarLugares, listarMunicipios } from "../apiUrls";
import { useContextLugares } from "../../contexto/lugares/LugaresContext";
import ModalLugarForm from "../modals/lugares/modalLugar";
import ModalMunicipioForm from "../modals/lugares/modalMunicipio";

const TablaMunicipios = (props) => {
    const { setListaMunicipios, listaDepartamentos, listaMunicipios, listaPaises } = useContextLugares();
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaMunicipios])
    const ActualizarTabla = async () => {
        try {
            const response = await AxiosPrivado.get(listarMunicipios);
            setListaMunicipios(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }

    }
    const CrearTabla = () => {
        let table = new DataTable('#tablaMunicipios', {
            data: listaMunicipios,
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
                    "data": "departamento.nombre",
                    "title": "Departamento",
                },
                {
                    "targets": 3,
                    "data": "departamento.pai.nombre",
                    "title": "Pais",
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <ModalMunicipioForm key={rowData.id} accion={false} datosPaises={listaPaises} datosDepartamentos={listaDepartamentos} datosMunicipio={rowData} ActualizarTabla={ActualizarTabla}></ModalMunicipioForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaMunicipios']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }


    return (
        <div>
            <table id="tablaMunicipios" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaMunicipios;