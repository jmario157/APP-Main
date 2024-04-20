import React, { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Cargando from "../../components/Cargando";
import TablaContratos from "../../components/tablas/TablaContratos";
import { Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
const ContratosInicioContenido = () => {

  const [cargandoDatos, setCargandoDatos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //fetchData();
  }, []);

  const CrearNuevo =()=>{
    navigate("/app/contratos/nuevo");
  }

  if (cargandoDatos) {
    return (
      <Cargando></Cargando>
    );
  }
  else {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Contratos</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Inicio</a></li>
                  <li className="breadcrumb-item active">Contratos</li>
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
                    <h3 className="card-title">Contratos</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">Modulo de contratos</h6>
                    <p className="card-text">Este modulo le permite gestionar la información de cada uno de los contratos realizados con sus clientes.</p>
                    <Button onClick={CrearNuevo}>Crear Contrato</Button>
                    <span style={{ margin: "0 12px" }}></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Lista de contratos</h3>
                  </div>

                  <div className="card-body">
                    {
                      cargandoDatos ?
                        <p>Cargando</p>
                        :
                        <TablaContratos></TablaContratos>
                    }

                  </div>
                  <Link className="btn btn-primary" to={"/app/reporteContratos"}>Reportes</Link>
                  <span style={{ margin: "0 12px" }}></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

}

export default ContratosInicioContenido;
