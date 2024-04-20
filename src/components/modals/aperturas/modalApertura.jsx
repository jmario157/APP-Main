import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import {
  guardarApertura,
  editarApertura,
} from "../../apiUrls";
import { AxiosPrivado } from "../../axios/Axios";
import ModalInformacionApertura from "./modalInformacionApertura";
function ModalAperturaForm({ accion, datosApertura, ActualizarTabla, datosCaja, datosUsuario, CargarDatosCaja }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorEfectivo, setErrorEfectivo] = useState(false);
  const [formularioApertura, setFormularioApertura] = useState({
    id: null,
    efectivo: 0,
    cajaId: datosCaja?.id,
    caja: datosCaja,
    usuarioId: datosUsuario?.id,
    usuario: datosUsuario
  });

  useEffect(() => {
    if (datosApertura != null) {
      setFormularioApertura({
        ...datosApertura
      });
    } else {
      setFormularioApertura({
        id: null,
        efectivo: 0,
        cajaId: datosCaja?.id,
        caja: datosCaja,
        usuarioId: datosUsuario?.id,
        usuario: datosUsuario
      });
    }
  }, [showModal]);

  const saveApertura = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioApertura.efectivo == 0)
    ) {
      mostraAlerta("Escriba el valor del efectivo", "warning");
      return;
    }
    if ((formularioApertura.cajaId == null)) {
      mostraAlerta(
        "Debe seleccionar una caja",
        "warning"
      );
      return;
    }
    if ((formularioApertura.usuarioId == null)) {
      mostraAlerta(
        "Debe seleccionar un usuario",
        "warning"
      );
      return;
    }
    setErrorEfectivo(false);
    try {
      await AxiosPrivado
        .post(guardarApertura, formularioApertura)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta(response.data.msj, "success");
            ActualizarTabla();
            CargarDatosCaja();
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
          mostraAlerta("Error al guardar", "Error");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  const manejadorApertura = (event) => {
    setFormularioApertura({
      ...formularioApertura,
      [event.target.name]: event.target.value,
    });
  };


  const modificarApertura = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioApertura.id === null) {
      mostraAlerta("Debe seleccionar una apertura", "warning");
      return;
    }
    if ((formularioApertura.cajaId == null)) {
      mostraAlerta(
        "Debe seleccionar una caja",
        "warning"
      );
      return;
    }
    if ((formularioApertura.usuarioId == null)) {
      mostraAlerta(
        "Debe seleccionar un usuario",
        "warning"
      );
      return;
    }
    setErrorEfectivo(false);
    AxiosPrivado
      .put(editarApertura + formularioApertura.id, formularioApertura)
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
    setErrorEfectivo(false);
    setFormularioApertura({
      id: null,
        efectivo: 0,
        cajaId: datosCaja?.id,
        caja: datosCaja,
        usuarioId: datosUsuario?.id,
        usuario: datosUsuario
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
            Crear Apertura
          </Button>
        </div>

      ) : (
        <div>
          <Button variant="info" onClick={handleOpenModal}>
            <i className="fas fa-folder">
            </i>
          </Button>

          <Button variant="warning" onClick={handleShow} disabled>
            <i className="fas fa-pencil-alt">
            </i>
          </Button>
        </div>

      )}
      <Modal show={showModal} onHide={handleClose} className="modal fade" size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Formulario de Apertura</h4>
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
                    <label htmlFor="exampleInputEmail1">Efectivo</label>
                    <input
                      type="number"
                      className={`form-control ${errorEfectivo ? "is-invalid" : ""
                        }`}
                      placeholder="Ingrese el efectivo"
                      name="efectivo"
                      value={formularioApertura.efectivo}
                      onChange={manejadorApertura}
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <strong><i className="fas fa-map-marker-alt mr-1"></i> Caja</strong>
                  <p className="text-muted">
                    {formularioApertura?.caja.nombre}
                  </p>
                  <hr></hr>
                  <strong><i className="far fa-file-alt mr-1"></i> Usuario</strong>
                  <p className="text-muted">
                    {formularioApertura.usuario ? formularioApertura.usuario.empleado.primernombre + " " + formularioApertura.usuario.empleado.segundonombre + " " + formularioApertura.usuario.empleado.primerapellido + " " + formularioApertura.usuario.empleado.segundoapellido : ""}
                  </p>
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
              <Button variant="primary" onClick={saveApertura}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarApertura}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionApertura datos={datosApertura} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionApertura>
    </>
  );
}

export default ModalAperturaForm;
