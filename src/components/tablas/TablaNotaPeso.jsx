import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalNotaPesoForm from "../modals/notaPeso/modalNotaPeso";
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlerta, mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextNota } from "../../contexto/notaPeso/NotaContext";
import { listarNotaPeso } from "../apiUrls";
import Cargando from "../Cargando"

const TablaNotaPeso = (props) => {
    const { listaNotaPeso, setListaNotaPeso, listaCliente, listaProducto} = useContextNota();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaNotaPeso])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarNotaPeso);
            setListaNotaPeso(response.data.datos);
            console.log(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexion.");
        }
        setCargandoDatos(false);
    }

    const CrearTabla = () => {
        console.log("Se actualizo")
        let table = new DataTable('#tablaNotaPeso', {
            data: listaNotaPeso,
            "columnDefs": [
                {
                    "target": 0,
                    "data": "id",
                    "title": "Id"
                },
                {
                    "target": 1,
                    "data": "fechaIngreso",
                    "title": "Fecha de Ingreso"
                },                
                {
                    "targets": 2,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalNotaPesoForm key={rowData.id} accion={false} datosNotaPeso={rowData} ActualizarTabla={ActualizarTabla} datosClientes={listaCliente} datosProductos={listaProducto} ></ModalNotaPesoForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaNotaPeso']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }
    return (
        <div>
            <table id="tablaNotaPeso" className="table table-bordered table-hover"></table>
        </div>
    );
}

export default TablaNotaPeso;