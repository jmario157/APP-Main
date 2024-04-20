import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
//import TablaCliente from "./parts/tablaCliente";
import "react-datepicker/dist/react-datepicker.css";
import ModalAlquilerForm from "./modals/alquiler/modalAlquiler";
import Cargando from "./Cargando";
import TablaAlquiler from "./tablas/TablaAlquiler";
import { listarAlquileres } from "./apiUrls";
import { mostraAlertaError } from "./Alerts/sweetAlert";
import { AxiosPrivado } from "./axios/Axios";
import { useContextAlquiler } from "../contexto/alquiler/AlquilerContext";
const Alquiler = () => {
    const { setListaAlquileres } = useContextAlquiler();
    const [cargandoDatos, setCargandoDatos] = useState(false);

    useEffect(() => {
        //fetchData();
    }, []);
    const ActualizarTabla = async () => {
        try {
            const response = await AxiosPrivado.get(listarAlquileres);
            setListaAlquileres(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
    }
    if (cargandoDatos) {
        return (
            <Cargando></Cargando>
        );
    }
    else {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Alquiler</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Inicio</a></li>
                                    <li className="breadcrumb-item active">Alquileres</li>
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
                                        <h3 className="card-title">Alquileres</h3>
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title">Modulo de alquileres</h6>
                                        <p className="card-text">Este modulo le permite gestionar la información de cada uno de los alquileres.</p>
                                        <ModalAlquilerForm buttonLabel="Crear Alquiler" accion={true} datosDelProyecto={null} ActualizarTabla={ActualizarTabla}/>
                                        <span style={{ margin: "0 12px" }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Lista de alquileres</h3>
                                    </div>

                                    <div className="card-body">
                                        {
                                            cargandoDatos ?
                                                <p>Cargando</p>
                                                :
                                                <TablaAlquiler ></TablaAlquiler>
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

export default Alquiler;
