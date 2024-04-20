import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextContrato } from "../../contexto/contratos/ContratoContext";
import moment from "moment";
import { useContextPago } from "../../contexto/pagos/PagoContext";

const TablaPagoCuotasSeleccionadas = () => {
    //console.log(clientes)
    const { amortizaciones, listaCuotas } = useContextPago();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        //ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaCuotas])
    
    const CrearTabla = () => {
        let table = new DataTable('#tablaAmortizacionCuota', {
            data: listaCuotas,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "numero",
                    "title": "N°",
                },
                {
                    "targets": 1,
                    "data": "fechapago",
                    "title": "Fecha Pago",
                    render: (data, type, row) => moment(row.fechapago).format('L')
                },
                {
                    "targets": 2,
                    "data": "cuota",
                    "title": "Cuota",
                    render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.cuota)
                },
                {
                    "targets": 3,
                    "data": "amortizacioncapital",
                    "title": "Capital",
                    render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.amortizacioncapital)
                },
                {
                    "targets": 4,
                    "data": "intereses",
                    "title": "Intereses",
                    render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.intereses)
                },
                {
                    "targets": 5,
                    "data": "saldocapital",
                    "title": "Saldo Capital",
                    render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.saldocapital)
                },
                {
                    "targets": 6,
                    "data": null,
                    "title": "Estado",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <span className={moment().diff(moment(row.fechapago)) > 0 ? "float-right badge bg-danger" : "float-right badge bg-warning" }>{moment().diff(moment(row.fechapago)) > 0 ? 'Pago en mora' : 'Pago pendiente'}</span>
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
                $('.dataTables_filter').find("[aria-controls='tablaAmortizacionCuota']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }


    return (
        <div>
            <table id="tablaAmortizacionCuota" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaPagoCuotasSeleccionadas;