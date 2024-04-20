import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';



import { Button, Modal } from "react-bootstrap";
import $ from 'jquery';
import ModalClienteForm from "../modals/Clientes/modalClientes";
import { listarClientes } from '../apiUrls'
import { AxiosPublico } from '../axios/Axios';
import { mostraAlerta } from "../Alerts/sweetAlert";

const CardCliente = (datos) => {
    const [tablaCreada, setTablaCreada] = useState(false);
    const [listaClientes, setListaClientes] = useState([]);
    $.DataTable = require('datatables.net-dt');
    useEffect(() => {
        console.log("Entro");
        peticion();
    }, []);

    const peticion = async () => {
        try {
            const respuesta = await AxiosPublico.get('clientes/listar');
            console.log(respuesta.data.datos);
            setListaClientes(respuesta.data.datos);
            const lista = respuesta.data.datos;
            const table = $("#ListaClientes").DataTable(
                {
                    data: lista,
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                    "scrollX": true,
                    "lengthChange": true,
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
                                root.render(<ModalClienteForm accion={false} datosClientes={rowData}></ModalClienteForm>);
                            }
                        },
                    ],
                    destroy: true  // I think some clean up is happening here
                }
            )
            //mostraAlerta("Datos cargados correctamente", "success");
        } catch (error) {
            mostraAlerta("ha ocurrido un error", "error");
        }
    };

    return (
        <div className="col-md-3">
            <div className="card card-widget widget-user shadow">
                <div className="widget-user-header bg-info">
                    <h3 className="widget-user-username">{datos.nombreprimer} {datos.nombresegundo} {datos.apellidoprimer} {datos.apellidosegundo}</h3>
                    <h5 className="widget-user-desc">{datos.identidad}</h5>
                </div>
                <div className="widget-user-image">
                    <img className="img-circle elevation-2" src="../dist/img/user1-128x128.jpg" alt="User Avatar" />
                </div>
                <div className="card-footer p-0">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <p>Direccion: {datos.direccion}</p>
                        </li>
                        <li className="nav-item">
                            <p>Telefonos: {datos.clientetelefonos.map(f=>{
                                f.numero +', '
                            })}</p>
                        </li>
                        <li className="nav-item">
                            <p>{datos.genero}</p>
                        </li>
                        <li className="nav-item">
                            <p>{datos.profesion}</p>
                        </li>
                        <li className="nav-item">
                            <p>{datos.activo}</p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
}

export default CardCliente;