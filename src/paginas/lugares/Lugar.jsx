import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { listarLugares, listarProyectos } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios"; 
import { useContextLugares } from "../../contexto/lugares/LugaresContext";
import TablaLugares from "../../components/tablas/TablaLugares";
import ModalLugarForm from "../../components/modals/lugares/modalLugar";
function Lugar() {
  const { setListaLugares, listaMunicipios, listaDepartamentos, listaPaises } = useContextLugares();
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarLugares);
      setListaLugares(response.data.datos);
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
              <h1>Lugares</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                <li className="breadcrumb-item active">Lugares</li>
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
                  <h3 className="card-title">Lugares</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">Modulo de lugares</h6>
                  <p className="card-text">Este modulo le permite gestionar la información de cada uno de los lugar de clientes y proyectos.</p>
                  <ModalLugarForm buttonLabel="Crear Lugar" accion={true} datosLugar={null} ActualizarTabla={ActualizarTabla} datosMunicipios={listaMunicipios} datosDepartamentos={listaDepartamentos} datosPaises={listaPaises}/>
                  <span style={{ margin: "0 12px" }}></span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">Lista de lugares</h3>
                </div>

                <div className="card-body">
                  <TablaLugares></TablaLugares>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}

export default Lugar;
