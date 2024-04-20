import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import {
  guardarEtapa,
  editarEtapa,
} from "../../apiUrls";
import { AxiosPrivado } from "../../axios/Axios";
import ModalInformacionEtapa from "./modalInformacionEtapa";
import Select from "react-select";
function ModalEtapaForm({ accion, datosEtapa, ActualizarTabla, datosProyectos }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorProyectoId, setErrorProyectoId] = useState(false);
  const [ActulizarImagen, setActualizarImagen] = useState(false);
  const [formularioEtapa, setFormularioEtapa] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    proyectoId: null,
    activo: true,
  });
  const proyectos = datosProyectos?.map((f) => ({
    value: f.id,
    label: f.nombre
  }));
  useEffect(() => {
    if (datosEtapa != null) {
      setActualizarImagen(true);
      setFormularioEtapa({
        ...datosEtapa
      });
    } else {
      setFormularioEtapa({
        id: null,
        nombre: "",
        descripcion: "",
        proyectoId: null,
        activo: true,
      });
    }
  }, [showModal]);

  const saveProyecto = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioEtapa.nombre == "")
    ) {
      mostraAlerta("Escriba el nombre de la etapa", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioEtapa.nombre.length < 3)) {
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioEtapa.proyectoId == null)) {
      setErrorProyectoId(true);
      mostraAlerta(
        "Debe seleccionar un proyecto",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorProyectoId(false);
    try {
      await AxiosPrivado
        .post(guardarEtapa, formularioEtapa)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta(response.data.msj, "success");
            ActualizarTabla();
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
          mostraAlerta("La identidad ya existe", "warning");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  const manejadorEtapa = (event) => {
    setFormularioEtapa({
      ...formularioEtapa,
      [event.target.name]: event.target.value,
    });
  };


  const modificarEtapa = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioEtapa.id === null) {
      mostraAlerta("Debe seleccionar una Etapa", "warning");
      return;
    }
    if (formularioEtapa.nombre == "") {
      console.log("El campo primernombre solo debe contener letras");
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre solo debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioEtapa.proyectoId == null)) {
      setErrorProyectoId(true);
      mostraAlerta(
        "Debe seleccionar un proyecto",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorProyectoId(false);
    AxiosPrivado
      .put(editarEtapa + formularioEtapa.id, formularioEtapa)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo === 1) {
          ActualizarTabla();
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo === 0) {
          mostraAlerta(response.data.msj);
        } else if (response.data.tipo === 2) {
          mostraAlerta(response.data.msj);
        }
        //fetchData();
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        mostraAlerta(error);
      });


  };

  const limpiarCampos = () => {
    setErrorNombre(false);
    setErrorProyectoId(false);
    setFormularioEtapa({
      id: null,
      nombre: "",
      descripcion: "",
      proyectoId: null,
      activo: true,
    });
  };

  const handleOpenModal = () => {
    setShowModalInformacion(true);
  };


  return (
    <>
      {accion ? (
        <div>
          <Button variant="primary" onClick={handleShow}>
            Crear Etapa
          </Button>
        </div>

      ) : (
        <div>
          <Button variant="info" onClick={handleOpenModal}>
            <i className="fas fa-folder">
            </i>
          </Button>

          <Button variant="warning" onClick={handleShow}>
            <i className="fas fa-pencil-alt">
            </i>
          </Button>
        </div>

      )}
      <Modal show={showModal} onHide={handleClose} className="modal fade" size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Formulario de Etapa</h4>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="card-body">
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
                      value={formularioEtapa.nombre}
                      onChange={manejadorEtapa}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Descripción del proyecto"
                      name="descripcion"
                      value={formularioEtapa.descripcion}
                      onChange={manejadorEtapa}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-10">
                  <div className="form-group">
                    <label htmlFor="proyectoId">Proyecto</label>
                    <Select
          
                      value={
                        formularioEtapa.proyectoId &&
                        proyectos?.find(
                          (opcion) =>
                            opcion.value === formularioEtapa.proyectoId
                        )
                      }
                      onChange={(event) => {
                        setFormularioEtapa({
                          ...formularioEtapa,
                          proyectoId: event.value,
                        });
                      }}
                      options={proyectos}
                      isSearchable={true}
                    ></Select>
                  </div>
                </div>
                <div className="col-sm-2">
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
                        checked={formularioEtapa.activo}
                        onChange={(event) => {
                          setFormularioEtapa({
                            ...formularioEtapa,
                            activo: event.target.checked,
                          });
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customSwitch3"
                      >
                        {formularioEtapa.activo ? 'Activo' : 'Inactivo'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /.card-body */}
          </form>
        </div>
        <div className="modal-footer ">
          <div className="card-footer">
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            <Button variant="warning" onClick={limpiarCampos}>
              Limpiar Campos
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            {accion ? (
              <Button variant="primary" onClick={saveProyecto}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarEtapa}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionEtapa datos={datosEtapa} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionEtapa>
    </>
  );
}

export default ModalEtapaForm;
