import React, { useEffect } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import ModalDetalleForm from "../modals/notaPeso/modalDetalle";

const TablaDetalle = ({ detalles }) => {

    useEffect(() => {
        CrearTabla();
    }, [detalles])

    const CrearTabla = () => {
        let table = new DataTable('#tablaDetalle', {
            data: detalles,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "pesada",
                    "title": "No.",
                },
                {
                    "targets": 2,
                    "data": "cantidad",
                    "title": "Sacos",
                },
                {
                    "targets": 3,
                    "data": "pesoBruto",
                    "title": "Peso Bruto",
                },
                {
                    "targets": 4,
                    "data": "tara",
                    "title": "Tara",
                },
                {
                    "targets": 5,
                    "data": "pesoNeto",
                    "title": "Peso Neto",
                },
                {
                    "targets": 6,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <ModalDetalleForm key={rowData.id} accion={false} datosDetalle={rowData} ></ModalDetalleForm>
                        );
                    }
                },
            ],
            "paging": false,
            "lengthChange": false,
            "searching": false,
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
                $('.dataTables_filter').find("[aria-controls='tablaDetalle']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table id="tablaDetalle" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaDetalle;
