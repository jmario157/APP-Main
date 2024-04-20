import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { listarDepartamentos, listarMunicipios } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import { useContextLugares } from "../../contexto/lugares/LugaresContext";
import ModalDepartamentoForm from "../../components/modals/lugares/modalDepartamento";
import TablaDepartamentos from "../../components/tablas/TablaDepartamentos";
import ModalMunicipioForm from "../../components/modals/lugares/modalMunicipio";
import TablaMunicipios from "../../components/tablas/TablaMunicipios";
function Municipio() {
  const { setListaMunicipios, listaPaises, listaDepartamentos, listaMunicipios } = useContextLugares();
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarMunicipios);
      setListaMunicipios(response.data.datos);
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
              <h1>Municipios/Condados</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                <li className="breadcrumb-item active">Municipios</li>
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
                  <h3 className="card-title">Municipios</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">Modulo de municipios</h6>
                  <p className="card-text">Este modulo le permite gestionar la información de cada uno de los municipios o condados de clientes y proyectos.</p>
                  <ModalMunicipioForm buttonLabel="Crear Municipio" accion={true} datosMunicipio={null} ActualizarTabla={ActualizarTabla} datosPaises={listaPaises} datosDepartamentos={listaDepartamentos} />
                  <span style={{ margin: "0 12px" }}></span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">Lista de Municipios</h3>
                </div>
                <div className="card-body">
                  <TablaMunicipios></TablaMunicipios>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}

export default Municipio;
