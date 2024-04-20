import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { datoCierre, datoIdApertura, listarAperturas, listarCierres } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import Header from "../../components/plantilla/Header";
import Footer from "../../components/plantilla/Footer";
import SideNav from "../../components/plantilla/SideNav";
import { useContextCaja } from "../../contexto/caja/CajaContext";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import ModalCirreForm from "../../components/modals/cierre/modalCierre";
import TablaCierres from "../../components/tablas/TablaCierres";
function Cierres() {
  const { setListaCierres, caja, CargarDatosCaja } = useContextCaja();
  console.log('CAJA:',caja)
  const { usuario } = useContextUsuario();
  const [crear, setCrear] = useState(true);
  const [mensaje, setMensaje] = useState("Esta no es una caja por lo que no se permiten generar cierres");
  const [datosCierre, setDatosCierre] = useState();
  const [idApertura, setIdApertura]= useState();
  const[cajaid,setcaja]=useState(0);
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarCierres);
      setListaCierres(response.data.datos);
     // console.log(response.data.datos)
    } catch (error) {
      console.log(error);
      mostraAlertaError("El servidor no responde. Revise su conexión.");
      //mostraAlertaModificar();
    }
  }
  useEffect(() => {
    if (caja) {
      if (caja?.estado == "CE") {
        console.log('Estado',caja?.estado)
        console.log('CAJAID',caja.id)
        setMensaje("Esta caja se encuentra cerrada. No se puede generar el cierre.");
        setCrear(false);
      }
      else {
        actualizarDatosCierre();
        setCrear(true);
      }
    }
    else {
      setCrear(false);
    }
  }, [caja]);
  const actualizarDatosCierre = async () => {
    try {
     
      const response = await AxiosPrivado.get(datoCierre + caja.id);
      setcaja(caja.id);
      setDatosCierre(response.data.datos);
      console.log('Datos Cierre:', response.data.datos)
      
    } catch (error) {
      console.log(error);
      mostraAlertaError("El servidor no responde. Revise su conexión.");
      //mostraAlertaModificar();
    }
  }

  return (
    <>
      <Header />
      <SideNav />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Cierres</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                  <li className="breadcrumb-item active">Cierres</li>
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
                    <h3 className="card-title">Cierres</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">Modulo de cierres</h6>
                    <p className="card-text">Este módulo le permite gestionar la información de cada una de los cierres de caja.</p>
                    {crear ? (
                      <ModalCirreForm buttonLabel="Crear Cierre" accion={true} datosCierre={datosCierre} ActualizarTabla={ActualizarTabla} datosUsuario={usuario} datosCaja={caja} CargarDatosCaja={CargarDatosCaja} />
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
                    <h3 className="card-title">Lista de cierres</h3>
                  </div>

                  <div className="card-body">
                    <TablaCierres></TablaCierres>
                  </div>
                  <Link className="btn btn-primary" to={"/app/reporteCierres"}>Reportes</Link>
                  <span style={{ margin: "0 12px" }}></span>
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

export default Cierres;
