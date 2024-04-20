import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import {
  guardarDepartamentos,
  editarDepartamentos,
} from "../../apiUrls";
import { AxiosPrivado } from "../../axios/Axios";
import Select from "react-select";
import ModalInformacionDepartamento from "./modalInformacionDepartamento";
function ModalDepartamentoForm({ accion, datosDepartamento, datosPaises, ActualizarTabla }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorPaisId, setErrorPaisId] = useState(false);
  const [paisId, setPaisId] = useState(null);
  const [formularioDepartamento, setFormularioDepartamento] = useState({
    id: null,
    nombre: "",
    paiId: null,
    numero: ""
  });
  const paises = datosPaises?.map((f) => ({
    value: f.id,
    label: f.nombre
  }));

  useEffect(() => {
    if (datosDepartamento != null) {
      setFormularioDepartamento({
        id: datosDepartamento.id,
        nombre: datosDepartamento.nombre,
        paiId: datosDepartamento.paiId,
        numero: datosDepartamento.numero
      });
      setPaisId(datosDepartamento.pai.paiId);
    } else {
      setFormularioDepartamento({
        id: null,
        nombre: "",
        paiId: null,
        numero: ""
      });
      setPaisId(null);
    }
  }, []);
  
  useEffect(() => {
    if (datosDepartamento != null) {
      setFormularioDepartamento({
        id: datosDepartamento.id,
        nombre: datosDepartamento.nombre,
        paiId: datosDepartamento.paiId,
        numero: datosDepartamento.numero
      });
    } else {
      setFormularioDepartamento({
        ...formularioDepartamento,
        paiId: paisId
      })
    }
  }, [paisId]);
  useEffect(()=>{
    if (showModal && datosDepartamento != null){
      setPaisId(datosDepartamento.paiId);
    }
  },[showModal])
  const saveLugar = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioDepartamento.nombre == "")
    ) {
      mostraAlerta("Escriba el nombre del departamento", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioDepartamento.nombre.length < 3)) {
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioDepartamento.paiId == null)) {
      setErrorPaisId(true);
      mostraAlerta(
        "Debe seleccionar un pais",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    try {
      await AxiosPrivado
        .post(guardarDepartamentos, formularioDepartamento)
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
          mostraAlerta("Error al ejecutar la petición", "warning");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  const manejadorDepartamentos = (event) => {
    setFormularioDepartamento({
      ...formularioDepartamento,
      [event.target.name]: event.target.value,
    });
  };


  const modificarDepartamento = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioDepartamento.id === null) {
      mostraAlerta("Debe seleccionar un departamento", "warning");
      return;
    }
    if (formularioDepartamento.nombre == "") {
      console.log("El campo nombre solo debe contener letras");
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre solo debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioDepartamento.paiId == null)) {
      setErrorPaisId(true);
      mostraAlerta(
        "Debe seleccionar un pais",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorPaisId(false);
    AxiosPrivado
      .put(editarDepartamentos + formularioDepartamento.id, formularioDepartamento)
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
    setErrorPaisId(false);
    setPaisId(null);
    setFormularioDepartamento({
      id: null,
      nombre: "",
      paiId: null,
      numero: ""
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
            Crear Departamento/Estado
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
          <h4 className="modal-title text-primary">Formulario de Departamentos/Estados</h4>
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
                <div className="col-sm-8">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${errorNombre ? "is-invalid" : ""
                        }`}
                      id="nombre"
                      placeholder="Ingrese el nombre"
                      name="nombre"
                      value={formularioDepartamento.nombre}
                      onChange={manejadorDepartamentos}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Código</label>
                    <input
                      type="text"
                      className={`form-control ${errorNombre ? "is-invalid" : ""
                        }`}
                      id="numero"
                      placeholder="Ingrese el código"
                      name="numero"
                      value={formularioDepartamento.numero}
                      onChange={manejadorDepartamentos}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="PaiId">Pais</label>
                    <Select
                      value={
                        paisId &&
                        paises?.find(
                          (opcion) =>
                            opcion.value === paisId
                        )
                      }
                      onChange={(event) => {
                        setPaisId(event.value);
                      }}
                      options={paises}
                      isSearchable={true}
                    ></Select>
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
              <Button variant="primary" onClick={saveLugar}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarDepartamento}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionDepartamento datos={datosDepartamento} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionDepartamento>
    </>
  );
}

export default ModalDepartamentoForm;
