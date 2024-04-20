import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { listarAperturas } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import Header from "../../components/plantilla/Header";
import Footer from "../../components/plantilla/Footer";
import SideNav from "../../components/plantilla/SideNav";
import { useContextCaja } from "../../contexto/caja/CajaContext";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import ModalAperturaForm from "../../components/modals/aperturas/modalApertura";
import TablaAperturas from "../../components/tablas/TablaAperturas";
function Aperturas() {
  const { setListaAperturas, caja, CargarDatosCaja } = useContextCaja();
  const { usuario } = useContextUsuario();
  const [crear, setCrear] = useState(true);
  const [mensaje, setMensaje] = useState("Esta no es una caja por lo que no se permiten generar aperturas");
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarAperturas);
      setListaAperturas(response.data.datos);
      console.log('Respuesta',response)
      console.log()
    } catch (error) {
      console.log(error);
      mostraAlertaError("El servidor no responde. Revise su conexión.");
      //mostraAlertaModificar();
    }
  }
  useEffect(() => {
    if (caja) {
      console.log('CAJA:',caja?.estado)
      if (caja?.estado == "AB") {
        setMensaje("Esta caja se encuentra abierta. No se puede generar la apertura.");
        setCrear(false);
      }
      else {
        setCrear(true);
      }
    }
    else {
      setCrear(false);
    }
  }, [caja]);
  return (
    <>
      <Header />
      <SideNav />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Aperturas</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                  <li className="breadcrumb-item active">Aperturas</li>
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
                    <h3 className="card-title">Aperturas</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">Modulo de aperturas</h6>
                    <p className="card-text">Este módulo le permite gestionar la información de cada una de las aperturas de caja.</p>
                    {crear ? (
                      <ModalAperturaForm buttonLabel="Crear Apertura" accion={true} datosApertura={null} ActualizarTabla={ActualizarTabla} datosUsuario={usuario} datosCaja={caja} CargarDatosCaja={CargarDatosCaja} />
                    ) : (
                      <p className="card-text">{mensaje}</p>
                    )}
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
                    <TablaAperturas></TablaAperturas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>

  );

}

export default Aperturas;
