import React, { useContext, useEffect, useState } from "react";import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { listarDetalle } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import { useContextNota } from "../../contexto/notaPeso/NotaContext";
import ModalDetalleForm from "../../components/modals/notaPeso/modalDetalle";
import TablaDetalle from "../../components/tablas/TablaDetalle";
import Cargando from "../../components/Cargando";
function Detalle() {
    const { setListaDetalle } = useContextNota();
    const [cargandoDatos, setCargandoDatos] = useState(false);

    // Se ejecuta al cargar la página para obtener la lista de detalles
    useEffect(() => {
        //fetchData();
    }, []);
    const ActualizarTabla = async () => {
        try {
            const response = await AxiosPrivado.get(listarDetalle);// Llamada a la API para obtener la lista de detalles
            setListaDetalle(response.data.datos);
            console.log(response.data.datos)
            // Aquí deberías usar el contexto NotaContext para actualizar la lista de detalles
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
    };
    // Si se están cargando los datos, se muestra el indicador de carga
    if (cargandoDatos) {
        return <Cargando></Cargando>;
    } else {
        // Se renderiza la página con la lista de detalles
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Detalle Nota de Peso</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                                    <li className="breadcrumb-item active">Detalle</li>
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
                                        <h3 className="card-title">Detalle</h3>
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title">Modulo de detalle</h6>
                                        <p className="card-text">Este modulo le permite gestionar la información de cada uno de los detalles.</p>
                                        <ModalDetalleForm buttonLabel="Crear Producto" accion={true} datosDetalle={null} ActualizarTabla={ActualizarTabla}/>
                                        <span style={{ margin: "0 12px" }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Lista de Detalles</h3>
                                    </div>
    
                                    <div className="card-body">
                                        <TablaDetalle></TablaDetalle>
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

export default Detalle;
