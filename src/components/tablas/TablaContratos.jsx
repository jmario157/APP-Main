import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import { Await, defer, useLoaderData, } from "react-router-dom";
import $ from 'jquery';
import { AxiosPublico } from '../axios/Axios';
import { mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarContratos } from "../apiUrls";
import Cargando from "../Cargando"
import { useContextContrato } from "../../contexto/contratos/ContratoContext";
import { Button } from "react-bootstrap";
import moment from "moment";
import ModalInformacionContrato from "../modals/contratos/modalInformacionContrato";

const TablaContratos = (props) => {
    //console.log(clientes)
    const { listaContratos, setListaContratos } = useContextContrato();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [contratoSeleccionado, setContratoSeleccionado] = useState();
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaContratos])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPublico.get(listarContratos);
            console.log("Respuesta",response.data.datos)
            setListaContratos(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
        setCargandoDatos(false);
    }

    const verModal = (contrato) => {
        setShowModal(true);
        setContratoSeleccionado(contrato);
    }

    const CrearTabla = () => {
        console.log("Contratos:",listaContratos);
        let table = new DataTable('#tablaContratos', {
            data: listaContratos,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "fechaInicio",
                    "title": "Fecha",
                    render: (data, type, row) =>  moment(row.fechaInicio).format('L')
                },
                {
                    "targets": 2,
                    "data": "saldo",
                    "title": "Valor",
                    render: (data, type, row) => "L "+ new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.saldo)
                },
                {
                    "targets": 3,
                    "data": "clienteId",
                    "title": "Cliente",
                    render: (data, type, row) => row.cliente.nombreprimer + ' ' + row.cliente.nombresegundo + ' ' + row.cliente.apellidoprimer + ' ' + row.cliente.apellidosegundo
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <Button className="btn btn-primary"
                            onClick={() => verModal(rowData)}>Ver</Button>
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
                $('.dataTables_filter').find("[aria-controls='tablaContratos']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });

    }
   

    return (
        <div>
            <table id="tablaContratos" className="table table-bordered table-hover">
            </table>
            {contratoSeleccionado &&
            <ModalInformacionContrato
                contrato={contratoSeleccionado}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            }
        </div>
    );
}

export default TablaContratos;