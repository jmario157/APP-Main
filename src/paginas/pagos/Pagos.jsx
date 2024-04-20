import React, { useContext, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import { Link } from "react-router-dom";
import { listarPagos, listarProyectos } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import Header from "../../components/plantilla/Header";
import SideNav from "../../components/plantilla/SideNav";
import Footer from "../../components/plantilla/Footer";
import TablaPagos from "../../components/tablas/TablaPagos";
import { useContextPago } from "../../contexto/pagos/PagoContext";
function Pagos() {
  const { setListaPagos, listaPagos } = useContextPago();
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarPagos);
      setListaPagos(response.data.datos);
    } catch (error) {
      console.log(error);
      mostraAlertaError("El servidor no responde. Revise su conexión.");
      //mostraAlertaModificar();
    }
  }
  return (
    <>
      <Header/>
      <SideNav/>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Pagos</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                  <li className="breadcrumb-item active">Pagos</li>
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
                    <h3 className="card-title">Pagos</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">Modulo de pagos</h6>
                    <p className="card-text">Este modulo le permite gestionar la información de cada uno de los pagos realizados por cada uno de los clientes.</p>
                    <Link to={"/app/pagos/cuota"} className="btn btn-primary">Nuevo pago cuota</Link>

                    <span style={{ margin: "0 12px" }}></span>
                    <Link to={"/app/pagos/"} className="btn btn-info">Nuevo pago capital</Link>

                    <span style={{ margin: "0 12px" }}></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Lista de pagos</h3>
                  </div>

                  <div className="card-body">
                    <TablaPagos></TablaPagos>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>

  );

}

export default Pagos;
