import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import TablaProyectos from "../../components/tablas/TablaProyectos";
import ModalProyectoForm from "../../components/modals/inmuebles/modalProyecto";
import { Link } from "react-router-dom";
import ModalEtapaForm from "../../components/modals/inmuebles/modalEtapa";
import TablaEtapas from "../../components/tablas/TablaEtapas";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
import { listarLotes } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import ModalBloqueForm from "../../components/modals/inmuebles/modalBloque";
import TablaBloques from "../../components/tablas/TablaBloques";
import TablaLotes from "../../components/tablas/TablaLotes";
function Lotes() {
  const { setListaLotes, listaBloques, listaProyectos, listaEtapas } = useContextInmobiliario();
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarLotes);
      setListaLotes(response.data.datos);
      console.log(response.data.datos)
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
              <h1>Lotes</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                <li className="breadcrumb-item active">Lotes</li>
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
                  <h3 className="card-title">Lotes</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">Módulo de lotes</h6>
                  <p className="card-text">Este módulo le permite gestionar la información de cada una de los lotes disponibles para la venta.</p>
                  <Link className="btn btn-primary" to={"/app/inmobiliario/crearlote"}>Crear Lote</Link>
                  <span style={{ margin: "0 12px" }}></span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">Lista de lotes</h3>
                </div>

                <div className="card-body">
                  <TablaLotes></TablaLotes>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}

export default Lotes;
