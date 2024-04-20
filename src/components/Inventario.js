import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
//import TablaCliente from "./parts/tablaCliente";
import "react-datepicker/dist/react-datepicker.css";
import ModalInventarioForm from "./modals/inventario/ModalInventario";
import Cargando from "./Cargando";
import TablaInventario from "./tablas/TablaInventario";
import { listarInventario } from "./apiUrls";
import { mostraAlertaError } from "./Alerts/sweetAlert";
import { AxiosPrivado } from "./axios/Axios";
import { useContextInventario } from "../contexto/inventario/InventarioContext";
const Inventario = () => {
    // Obtenemos la lista de productos del contexto
    const { listaProducto, setListaInventario } = useContextInventario();
    const [cargandoDatos, setCargandoDatos] = useState(false);

    useEffect(() => {
        //fetchData();
    }, []);
    // Función para actualizar la tabla de inventario
    const ActualizarTabla = async () => {
        try {
            // Obtenemos los datos del inventario desde el servidor
            const response = await AxiosPrivado.get(listarInventario);
            // Actualizamos la lista de inventario en el contexto
            setListaInventario(response.data.datos);
        } catch (error) {
            console.log(error);
            // Mostramos una alerta en caso de error
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
    };
    if (cargandoDatos) {
        // Mostramos un componente de carga mientras se cargan los datos
        return <Cargando></Cargando>;
    } else {
        // Mostramos la interfaz principal del inventario
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Inventario</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        <a href="#">Inicio</a>
                                    </li>
                                    <li className="breadcrumb-item active">Inventario</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Inventario</h3>
                                        <div className="card-tools">
                                            <button
                                                type="button"
                                                className="btn btn-tool"
                                                data-card-widget="remove"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title">Modulo de inventario</h6>
                                        <p className="card-text">
                                            Este modulo le permite gestionar la información del
                                            inventario.
                                        </p>
                                        <ModalInventarioForm
                                            buttonLabel="Crear Inventario"
                                            accion={true}
                                            datosDelProyecto={null}
                                            ActualizarTabla={ActualizarTabla}
                                            datosProducto={listaProducto}
                                        />
                                        <span style={{ margin: "0 12px" }}></span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Lista de inventario</h3>
                                    </div>

                                    <div className="card-body">
                                        {cargandoDatos ? (
                                            <p>Cargando</p>
                                        ) : (
                                            <TablaInventario></TablaInventario>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
};

export default Inventario;
