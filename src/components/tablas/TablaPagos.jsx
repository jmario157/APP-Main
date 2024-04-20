import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarPagos, listarProyectos } from "../apiUrls";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useContextPago } from "../../contexto/pagos/PagoContext";

const TablaPagos = (props) => {
    const { listaPagos, setListaPagos } = useContextPago();
    const navigate = useNavigate();
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
        console.log(listaPagos)
    }, [listaPagos])
    const ActualizarTabla = async () => {
        if (listaPagos.length > 0) {
            try {
                const response = await AxiosPrivado.get(listarPagos);
                setListaPagos(response.data.datos);
            } catch (error) {
                console.log(error);
                mostraAlertaError("El servidor no responde. Revise su conexión.");
                //mostraAlertaModificar();
            }
        }

    }

    const formatoMoneda = (valor) => {
        return "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
        }).format(valor);
    }

    const CrearTabla = () => {
        let table = new DataTable('#tablaPagos', {
            data: listaPagos,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "tipo",
                    "title": "Tipo",
                    render: (data, type, row) => row.tipo=="PR"? "Pago de prima" : row.tipo=="CU"? "Pago de cuota" : "Pago de capital"
                },
                {
                    "targets": 2,
                    "data": "contrato.id",
                    "title": "Contrato",
                },
                {
                    "targets": 3,
                    "data": null,
                    "title": "Usuario",
                    render: (data, type, row) => row.usuario?.empleado.primernombre + " " + row.usuario?.empleado.segundonombre + " " + row.usuario?.empleado.primerapellido + " " + row.usuario.empleado?.segundoapellido
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "Total",
                    render: (data, type, row) => formatoMoneda(row.pago)
                },
                {
                    "targets": 5,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <div>
                                <Button variant="warning" value={rowData.id} onClick={e => seleccionImprimir(e, "value")}>Imprimir
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
                $('.dataTables_filter').find("[aria-controls='tablaPagos']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }
    const seleccionImprimir = (e) => {
        const id = e.target.value;
        navigate("/app/contratos/reportepagoprima/"+id);
    }

    return (
        <div>
            <table id="tablaPagos" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaPagos;