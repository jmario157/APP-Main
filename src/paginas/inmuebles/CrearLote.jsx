import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TablaProyectos from "../../components/tablas/TablaProyectos";
import ModalProyectoForm from "../../components/modals/inmuebles/modalProyecto";
import { Link } from "react-router-dom";
import ModalEtapaForm from "../../components/modals/inmuebles/modalEtapa";
import TablaEtapas from "../../components/tablas/TablaEtapas";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
import { guardarBloques, guardarLotes, listarLotes } from "../../components/apiUrls";
import { mostraAlerta, mostraAlertaError, mostraAlertaWarning } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import ModalBloqueForm from "../../components/modals/inmuebles/modalBloque";
import TablaBloques from "../../components/tablas/TablaBloques";
import Header from "../../components/plantilla/Header";
import SideNav from "../../components/plantilla/SideNav";
import Footer from "../../components/plantilla/Footer";
import Select from "react-select";
import { Button } from "react-bootstrap";
function CrearLote() {
  const { setListaLotes, listaBloques, listaProyectos, listaEtapas } = useContextInmobiliario();
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorEtapaId, setErrorEtapaId] = useState(false);
  const [Etapas, setEtapas] = useState({});
  const [Bloques, setBloques] = useState({});
  const [proyectoId, setProyectoId] = useState(null);
  const [etapaId, setEtapaId] = useState(null);
  const [bloqueId, setBloqueId] = useState(null);
  const [formularioLote, setFormularioLote] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    valor: 0,
    prima: 0,
    estado: "DI",
    bloqueId: null,
    etapaId: null,
    proyectoId: null,
    activo: true,
  });
  const proyectos = listaProyectos?.map((f) => ({
    value: f.id,
    label: f.nombre
  }));
  useEffect(() => {
    const lista = listaEtapas.filter((f) => f.proyectoId == proyectoId);
    const lista2 = lista?.map((f) => ({
      value: f.id,
      label: f.nombre
    }));
    setEtapas(lista2);
    setFormularioLote({
      ...formularioLote,
      proyectoId: proyectoId
    })
    setEtapaId(null);
    setBloqueId(null);
  }, [proyectoId]);
  useEffect(() => {
    const lista = listaBloques.filter((f) => f.etapaId == etapaId);
    const lista2 = lista?.map((f) => ({
      value: f.id,
      label: f.nombre
    }));
    setBloques(lista2);
    setBloqueId(null);
    setFormularioLote({
      ...formularioLote,
      etapaId: etapaId
    })
  }, [etapaId]);
  useEffect(() => {
    setFormularioLote({
      ...formularioLote,
      bloqueId: bloqueId
    })
  }, [bloqueId]);
  const manejadorLote = (event) => {
    setFormularioLote({
      ...formularioLote,
      [event.target.name]: event.target.value,
    });
  };
  const limpiarCampos = () => {
    setErrorNombre(false);
    setErrorEtapaId(false);
    setBloqueId(null);
    setEtapaId(null);
    setProyectoId(null);
    //setEtapas([]);
    setFormularioLote({
      id: null,
      nombre: "",
      descripcion: "",
      valor: 0,
      prima: 0,
      estado: "DI",
      bloqueId: null,
      etapaId: null,
      proyectoId: null,
      activo: true,
    });
  };
  const saveLote = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioLote.nombre == "")
    ) {
      mostraAlerta("Escriba el nombre del lote", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioLote.nombre.length < 3)) {
      setErrorNombre(true);

      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioLote.proyectoId == null)) {
      setErrorEtapaId(true);
      mostraAlerta(
        "Debe seleccionar un proyecto",
        "warning"
      );
      return;
    }
    if ((formularioLote.etapaId == null)) {
      setErrorEtapaId(true);
      mostraAlerta(
        "Debe seleccionar una etapa",
        "warning"
      );
      return;
    }
    if ((formularioLote.bloqueId == null)) {
      setErrorEtapaId(true);
      mostraAlerta(
        "Debe seleccionar un bloque",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorEtapaId(false);
    try {
      await AxiosPrivado
        .post(guardarLotes, formularioLote)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta(response.data.msj, "success");
            limpiarCampos();
          } else if (response.data.tipo === 0) {
            if (response.data.msj.isArray) {
              response.data.msj.forEach((element) => {
                console.log(element.campo + " " + element.msj);
                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
              });
            }
            else {
              mostraAlertaWarning(response.data.msj);
            }
          } else if (response.data.tipo === 2) {
            if (response.data.msj.isArray) {
              response.data.msj.forEach((element) => {
                console.log(element.campo + " " + element.msj);
                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
              });
            }
            else {
              mostraAlertaWarning(response.data.msj);
            }

          }
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta("Error al ejecutar la petición", "warning");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  return (
    <>
      <Header></Header>
      <SideNav />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Nuevo Lote</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><Link to={"/app/inmobiliario/lotes"}>Lotes</Link></li>
                  <li className="breadcrumb-item active">Nuevo Lote</li>
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
                    <h3 className="card-title">Datos del lote</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 col-sm-5">
                        <div className="col-12">
                          <img src="/dist/img/lote-default.jpg" className="product-image" alt="Imagen Lote" />
                        </div>
                      </div>
                      <div className="col-12 col-sm-7">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-group">
                              <label htmlFor="exampleInputEmail1">Nombre</label>
                              <input
                                type="text"
                                className={`form-control ${errorNombre ? "is-invalid" : ""
                                  }`}
                                id="text"
                                placeholder="Ingrese el nombre"
                                name="nombre"
                                value={formularioLote.nombre}
                                onChange={manejadorLote}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-9">
                            <div className="form-group">
                              <label htmlFor="descripcion">Descripción</label>
                              <textarea
                                className="form-control"
                                rows={3}
                                placeholder="Descripción del bloque"
                                name="descripcion"
                                value={formularioLote.descripcion}
                                onChange={manejadorLote}
                              />
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="form-group">
                              <label htmlFor="exampleInputEmail1">
                                Estado
                              </label>
                              <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customSwitch3"
                                  name="activo"
                                  checked={formularioLote.activo}
                                  onChange={(event) => {
                                    setFormularioLote({
                                      ...formularioLote,
                                      activo: event.target.checked,
                                    });
                                  }}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="customSwitch3"
                                >
                                  {formularioLote.activo ? 'Activo' : 'Inactivo'}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    <div className="row">
                        <div className="col-sm-6 form-group">
                          <label>Valor</label>
                          <div className="input-group">
                            <input type="number" className="form-control" placeholder="Escriba el valor"
                              name="valor"
                              value={formularioLote.valor}
                              onChange={manejadorLote}
                            />
                            <div className="input-group-prepend">
                              <span className="input-group-text"><i></i>L</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 form-group">
                          <label>Prima</label>
                          <div className="input-group">
                            <input type="number" className="form-control" placeholder="Escriba la prima"
                              name="prima"
                              value={formularioLote.prima}
                              onChange={manejadorLote}
                            />
                            <div className="input-group-prepend">
                              <span className="input-group-text"><i></i>L</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="form-group">
                            <label htmlFor="proyectoId">Proyecto</label>
                            <Select

                              value={
                                proyectoId &&
                                proyectos?.find(
                                  (opcion) =>
                                    opcion.value === proyectoId
                                )
                              }
                              onChange={(event) => {
                                setProyectoId(event.value);
                              }}
                              options={proyectos}
                              isSearchable={true}
                            ></Select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label htmlFor="etapaId">Etapa</label>
                            <Select
                              value={
                                etapaId &&
                                Etapas?.find(
                                  (opcion) =>
                                    opcion.value === etapaId
                                )
                              }
                              onChange={(event) => {
                                setEtapaId(event.value);
                              }}
                              options={Etapas}
                              isSearchable={true}
                            ></Select>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label htmlFor="etapaId">Bloque</label>
                            <Select
                              value={
                                bloqueId &&
                                Bloques?.find(
                                  (opcion) =>
                                    opcion.value === bloqueId
                                )
                              }
                              onChange={(event) => {
                                setBloqueId(event.value);
                              }}
                              options={Bloques}
                              isSearchable={true}
                            ></Select>
                          </div>
                        </div>

                      </div>
                  </div>
                  <div className="modal-footer ">
                    <div className="card-footer">
                      <Button variant="warning" onClick={limpiarCampos}>
                        Limpiar Campos
                      </Button>
                      <span style={{ margin: "0 12px" }}></span>
                      <Button variant="primary" onClick={saveLote}>
                        Guardar
                      </Button>
                    </div>
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

export default CrearLote;
