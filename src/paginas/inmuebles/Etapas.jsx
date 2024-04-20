import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import TablaProyectos from "../../components/tablas/TablaProyectos";
import ModalProyectoForm from "../../components/modals/inmuebles/modalProyecto";
import { Link } from "react-router-dom";
import ModalEtapaForm from "../../components/modals/inmuebles/modalEtapa";
import TablaEtapas from "../../components/tablas/TablaEtapas";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
import { listarEtapas } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
function Etapa() {
  const { setListaEtapas, listaProyectos } = useContextInmobiliario();
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarEtapas);
      setListaEtapas(response.data.datos);
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
              <h1>Etapas</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                <li className="breadcrumb-item active">Etapas</li>
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
                  <h3 className="card-title">Etapas</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">Modulo de etapas</h6>
                  <p className="card-text">Este módulo le permite gestionar la información de cada una de las etapas de cada uno de los proyectos.</p>
                  <ModalEtapaForm buttonLabel="Crear Etapa" accion={true} datosEtapa={null} ActualizarTabla={ActualizarTabla} datosProyectos={listaProyectos}/>
                  <span style={{ margin: "0 12px" }}></span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">Lista de etapas</h3>
                </div>

                <div className="card-body">
                  <TablaEtapas></TablaEtapas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}

export default Etapa;
