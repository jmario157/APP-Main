import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { listarCompras } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import TablaHistorialCompras from "../../components/tablas/TablaHistorialCompras"; // Debes crear este componente


function HistorialCompras() {
  useEffect(() => {
    ActualizarTabla();
  }, []);

  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarCompras);
      // Aquí debes manejar los datos de compras que obtienes en response.data.datos
      console.log(response.data.datos);
    } catch (error) {
      console.log(error);
      mostraAlertaError("El servidor no responde. Revise su conexión");
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Historial de Compras</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to={"/app/home"}>Inicio</Link>
                </li>
                <li className="breadcrumb-item active">Historial de Compras</li>
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
                  <h6 className="card-title">Historial de Compras</h6>
                  <p className="card-text">
                    Este módulo le permite revisar el historial de compras y sus detalles.
                  </p>
                  <TablaHistorialCompras />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
   
    </div>
  );
}

export default HistorialCompras;
