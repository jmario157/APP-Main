import React, { useEffect, useState,} from "react";
import $ from 'jquery';
import { AxiosPrivado } from "../axios/Axios";
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextProveedor } from "../../contexto/compra/ProveedorContext";
import { listarProveedores } from "../apiUrls";
import ModalProveedorForm from "../modals/Compras/modalProveedores";
import { createRoot } from 'react-dom/client';
import Cargando from "../Cargando";

const Tabla = (props) => {
    const { listaProveedores, setListaProveedores } = useContextProveedor(); 
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    },[])
    useEffect(() => {
        CrearTabla();
    }, [listaProveedores])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarProveedores);
            setListaProveedores(response.data.datos);
            console.log(response.data.datos)
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
        }
        setCargandoDatos(false);
    }
    const CrearTabla = () => {
        //console.log("Se actualizó")
        let table = new DataTable('#tablaProveedores',{
            data: listaProveedores,
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
                    "data": "nombrecontacto",
                    "title": "Nombre de Contacto"
                },
                {
                    "targets": 3,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalProveedorForm key={rowData.id} accion={false} datosProveedor={rowData} ActualizarTabla={ActualizarTabla}  ></ModalProveedorForm>
                        );
                        td.style.maxWidth = '10px'
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
                $('.dataTables_filter').find("[aria-controls='tablaProveedores']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table id="tablaProveedores" className="table table-bordered table-hover">
            </table>
        </div>
    )
}

export default Tabla; 

