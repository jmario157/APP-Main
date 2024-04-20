import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalClienteForm from "../modals/Clientes/modalClientes";
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlerta, mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextCliente } from "../../contexto/cliente/ClienteContext";
import { listarClientes } from "../apiUrls";
import Cargando from "../Cargando"

const Tabla = (props) => {
    //console.log(clientes)
    const { listaClientes, setListaClientes, listaProfesiones, listaLugares } = useContextCliente();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaClientes])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarClientes);
            setListaClientes(response.data.datos);
            console.log(response.data.datos)
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
        setCargandoDatos(false);
    }
    const CrearTabla = () => {
        console.log("Se actualizo")
        let table = new DataTable('#tablaClientes10', {
            data: listaClientes,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "identidad",
                    "title": "Identidad",
                },
                {
                    "targets": 2,
                    "data": "nombreprimer",
                    "title": "Nombre",
                    render: (data, type, row) => row.nombreprimer + ' ' + row.nombresegundo + ' ' + row.apellidoprimer + ' ' + row.apellidosegundo
                },
                {
                    "targets": 3,
                    "data": "direccion",
                    "title": "Direccion",
                    render: (data, type, row) => row.direccion + '. ' + row.lugar?.nombre + ', ' + row.lugar?.municipio.nombre + ', ' + row.lugar?.municipio.departamento.nombre
                },
                {
                    "targets": 4,
                    "data": "genero",
                    "title": "Genero",
                    render: (data, type, row) => {
                        if (data == "M")
                            return "Masculino"
                        else
                            return "Femenino"
                    }
                },
                {
                    "targets": 5,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalClienteForm key={rowData.id} accion={false} datosClientes={rowData} ActualizarTabla={ActualizarTabla} datosProfesiones={listaProfesiones} listaLugares={listaLugares}></ModalClienteForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaClientes10']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table id="tablaClientes10" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default Tabla;