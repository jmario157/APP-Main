import Reac, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import $ from 'jequery';
import { AxiosPrivado } from "../axios/Axios";
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from "datatables.net-dt";
import 'datatables.net-responsive-dt';
import { listarCompras } from "../apiUrls";
import { useContextCompra } from "../../contexto/compra/CompraContext";

const Tabla = (props) => {
    const {listaCompras, setListaCompras} = useContextCompra();
    useEffect(() => {
        ActualizarTabla();
    }, [])

    useEffect(() => {
        crearTabla();
    }, [listaCompras])

    const ActualizarTabla = async () => {
        console.log(listaCompras);
        try {
            const response = await AxiosPrivado.get(listarCompras);
            setListaCompras(response.data.datos);
        } catch(errror) {
            console.log (errror);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
        }
    }

    const crearTabla= () => {
        let table = new DataTable('#tablaCompras', {
            data: listaCompras,
            "columnDefs": [
                {
                    "targets": 0,
                    "data" : "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "fecha",
                    "title":"Fecha y Hora"
                },
                {
                    "targets": 2,
                    "data": "numerofactura",
                    "title": "Numero de Factura"
                },
                {
                    "targets": 3,
                    "data": "proveedor.nombre",
                    "title": "Proveedor",
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, rowData) => {
                        rootShouldForwardProp.render();
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
                $('.dataTables_filter').find("[aria-controls='tablaCompras']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }
    return (
        <div>
            <table id="tablaCompras" className="table table-bordered table-hover">
            </table>
        </div>
    )
}

export default Tabla;