import React, { useContext, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import TablaProyectos from "../../components/tablas/TablaProyectos";
import ModalProyectoForm from "../../components/modals/inmuebles/modalProyecto";
import { Link } from "react-router-dom";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
import { listarProyectos } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
function Proyecto() {
  const { setListaProyectos, listaLugares } = useContextInmobiliario();
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarProyectos);
      setListaProyectos(response.data.datos);
    } catch (error) {
      console.log(error);
      mostraAlertaError("El servidor no responde. Revise su conexión.");
      //mostraAlertaModificar();
    }
  }
  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Proyectos</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                <li className="breadcrumb-item active">Proyectos</li>
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
                  <h3 className="card-title">Proyectos</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">Modulo de proyectos</h6>
                  <p className="card-text">Este modulo le permite gestionar la información de cada uno de los proyectos.</p>
                  <Link to={"/app/inmobiliario/proyectonuevo"} className="btn btn-primary">Nuevo proyecto</Link>
                  
                  <span style={{ margin: "0 12px" }}></span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">Lista de proyectos</h3>
                </div>

                <div className="card-body">
                  <TablaProyectos></TablaProyectos>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}

export default Proyecto;
