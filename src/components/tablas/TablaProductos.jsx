import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import { AxiosPrivado } from '../axios/Axios';
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarProductos } from "../apiUrls";
import { useContextInventario } from "../../contexto/inventario/InventarioContext";
import ModalProductosForm from "../modals/inventario/modalProductos";

const TablaProductos = (props) => {
    const { listaProducto, setListaProducto } = useContextInventario();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
        console.log(listaProducto)
    }, [listaProducto])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarProductos);
            setListaProducto(response.data.datos);
            console.log(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
        setCargandoDatos(false);
    }
    const CrearTabla = () => {
        let table = new DataTable('#tablaProductos', {
            data: listaProducto,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "fechaEntrada",
                    "title": "Fecha de Entrada",
                },
                {
                    "targets": 2,
                    "data": "tipoProducto",
                    "title": "Tipo de Cafe",
                },
                {
                    "targets": 3,
                    "data": "cantidad",
                    "title": "Cantidad",
                },
                {
                    "targets": 4,
                    "data": "pesoUnidad",
                    "title": "Peso por Unidad",
                },
                {
                    "targets": 5,
                    "data": "medidaPeso",
                    "title": "Unidad de Medida",
                },
                {
                    "targets": 6,
                    "data": "total",
                    "title": "Total del Peso",
                },
                {
                    "targets": 7,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <ModalProductosForm key={rowData.id} accion={false} datosProductos={rowData} ActualizarTabla={ActualizarTabla}></ModalProductosForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaProductos']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }


    return (
        <div>
            <table id="tablaProductos" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default TablaProductos;