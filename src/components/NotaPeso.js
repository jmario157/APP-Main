import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import ModalNotaPesoForm from "./modals/notaPeso/modalNotaPeso";
import Cargando from "./Cargando";
import TablaNotaPeso from "./tablas/TablaNotaPeso";
import { useContextNota } from "../contexto/notaPeso/NotaContext";
import { listarNotaPeso } from "./apiUrls";
import { mostraAlertaError } from "./Alerts/sweetAlert";
import { AxiosPrivado } from "./axios/Axios";

const NotaPeso = () => {
    // Obtiene datos del contexto de la aplicación
    const { setListaNotaPeso, listaClientes, listaProductos } = useContextNota();
    const [cargandoDatos, setCargandoDatos] = useState(false);

    useEffect(() => {
        //fetchData();
        console.log(listaClientes)
    }, []);
    // Función para actualizar la tabla de notas de peso
    const ActualizarTabla = async () => {
        try {
            const response = await AxiosPrivado.get(listarNotaPeso);
            setListaNotaPeso(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
    }
    // Renderiza un componente de carga si se están cargando los datos, o la página de notas de peso
    if (cargandoDatos) {
        return (
            <Cargando></Cargando> // Componente de carga
        );
    }
    else {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Nota de Peso</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Inicio</a></li>
                                    <li className="breadcrumb-item active">Nota de Peso</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Sección de contenido */}
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Notas de Peso</h3>
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title">Modulo de Nota de Peso</h6>
                                        <p className="card-text">Este modulo le permite gestionar la información de cada una de las notas de peso.</p>
                                        {/* Componente de formulario para crear una nueva nota de peso */}
                                        <ModalNotaPesoForm buttonLabel="Crear Nota" accion={true} datosDelProyecto={null} ActualizarTabla={ActualizarTabla} listaClientes={listaClientes} datosProductos={listaProductos} />
                                        <span style={{ margin: "0 12px" }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Lista de Notas de Peso</h3>
                                    </div>

                                    <div className="card-body">
                                        {
                                            cargandoDatos ?
                                                <p>Cargando</p> // Muestra "Cargando" mientras se cargan los datos
                                                :
                                                <TablaNotaPeso ></TablaNotaPeso> // Renderiza la tabla de notas de peso
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

export default NotaPeso;


