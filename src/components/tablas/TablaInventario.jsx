import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalInventarioForm from "../modals/inventario/ModalInventario";
import { AxiosPrivado } from '../axios/Axios';
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextInventario } from "../../contexto/inventario/InventarioContext";
import { listarInventario } from "../apiUrls";

const TablaInventario = (props) => {
    const { listaInventario, setListaInventario, listaProducto} = useContextInventario();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaInventario])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarInventario);
            setListaInventario(response.data.datos);
            console.log(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexion.");
        }
        setCargandoDatos(false);
    }

    const CrearTabla = () => {
        console.log("Se actualizo")
        let table = new DataTable('#tablaInventario', {
            data: listaInventario,
            "columnDefs": [
                {
                    "target": 0,
                    "data": "id",
                    "title": "Id"
                },
                {
                    "target": 1,
                    "data": "Producto.fechaEntrada",
                    "title": "Fecha de Entrada",
                    render: (data, type, row) => row.Producto?.fechaEntrada
                },
                {
                    "target": 2,
                    "data": "Producto.tipoProducto",
                    "title": "Tipo de Cafe",
                    render: (data, type, row) => row.Producto?.tipoProducto
                },
                {
                    "target": 3,
                    "data": "Producto.cantidad",
                    "title": "Sacos en Stock",
                    render: (data, type, row) => row.Producto?.cantidad
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalInventarioForm key={rowData.id} accion={false} datosInventario={rowData} ActualizarTabla={ActualizarTabla} datosProducto={listaProducto}></ModalInventarioForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaInventario']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }
    return (
        <div>
            <table id="tablaInventario" className="table table-bordered table-hover"></table>
        </div>
    );
}

export default TablaInventario;