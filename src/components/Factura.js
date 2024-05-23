import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import ModalFacturaForm from "./modals/factura/modalFactura";
import Cargando from "./Cargando";
import TablaFactura from "./tablas/TablaFactura";
import { useContextFactura } from "../contexto/factura/facturaContext";
import { listarFactura } from "./apiUrls";
import { mostraAlertaError } from "./Alerts/sweetAlert";
import { AxiosPrivado } from "./axios/Axios";

const Factura = () => {
    // Obtiene y actualiza la lista de facturas del contexto
    const { setListaFactura, listaNotaPeso, listaClientes } = useContextFactura();
    const [cargandoDatos, setCargandoDatos] = useState(false);

    useEffect(() => {
        //fetchData();
    }, []);
    // Función para actualizar la tabla de facturas
    const ActualizarTabla = async () => {
        try {
            const response = await AxiosPrivado.get(listarFactura);
            setListaFactura(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
    }
    // Renderiza el componente de carga si los datos están cargando
    if (cargandoDatos) {
        return (
            <Cargando></Cargando>
        );
    }
    else {
        // Renderiza el contenido principal
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Factura</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Inicio</a></li>
                                    <li className="breadcrumb-item active">Factura</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Factura</h3>
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title">Modulo de Factura</h6>
                                        <p className="card-text">Este modulo le permite gestionar la información de cada una de las facturas.</p>
                                        {/* Componente para crear una nueva factura */}
                                        <ModalFacturaForm buttonLabel="Crear Factura" accion={true} datosDelProyecto={null} ActualizarTabla={ActualizarTabla} listaNotaPeso={listaNotaPeso} listaClientes={listaClientes}/>
                                        <span style={{ margin: "0 12px" }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Lista de Facturas</h3>
                                    </div>

                                    <div className="card-body">
                                        {/* Muestra la tabla de facturas */}
                                        {
                                            cargandoDatos ?
                                                <p>Cargando</p>
                                                :
                                                <TablaFactura ></TablaFactura>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

}

export default Factura;

