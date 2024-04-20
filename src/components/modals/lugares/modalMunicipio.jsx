import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import {
  guardarMunicipios,
  editarMunicipios,
} from "../../apiUrls";
import { AxiosPrivado } from "../../axios/Axios";
import Select from "react-select";
import ModalInformacionMunicipio from "./modalInformacionMunicipio";
function ModalMunicipioForm({ accion, datosDepartamentos, ActualizarTabla, datosMunicipio, datosPaises }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorDepartamentoId, setErrorDepartamentoId] = useState(false);
  const [paiId, setPaisId] = useState(null);
  const [paises, setPaises] = useState(
    datosPaises?.map((f) => ({
      value: f.id,
      label: f.nombre
    }))
  );
  const [departamentoId, setDepartamentoId] = useState(null);
  const [departamentos, setDepartamentos] = useState({});
  const [formularioMunicipio, setFormularioMunicipio] = useState({
    id: null,
    nombre: "",
    departamentoId: null,
    numero:""
  });
  /*const paises = datosPaises?.map((f) => ({
    value: f.id,
    label: f.nombre
  }));*/
  useEffect(() => {
    if (datosMunicipio != null) {
      setFormularioMunicipio({
        id: datosMunicipio.id,
        nombre: datosMunicipio.nombre,
        departamentoId: datosMunicipio.departamentoId,
        numero: datosMunicipio.numero
      });
      setPaisId(datosMunicipio.departamento.pai.id);
      setDepartamentoId(datosMunicipio.departamentoId);
    } else {
      setFormularioMunicipio({
        id: null,
        nombre: "",
        departamentoId: null,
        numero: ""
      });
      setPaisId(null);
      setDepartamentoId(null);
    }
  }, []);
  useEffect(() => {
    const lista = datosDepartamentos.filter((f) => f.paiId == paiId);
    const lista2 = lista?.map((f) => ({
      value: f.id,
      label: f.nombre
    }));
    setDepartamentos(lista2);
    //}
  }, [paiId]);
  useEffect(() => {
    setFormularioMunicipio({
      ...formularioMunicipio,
      departamentoId: departamentoId
    });
    //}
  }, [departamentoId]);
  useEffect(()=>{
    setPaises(
      datosPaises?.map((f) => ({
        value: f.id,
        label: f.nombre
      }))
    );
    if (showModal && datosMunicipio != null){
      setPaisId(datosMunicipio.departamento.paiId);
      setDepartamentoId(datosMunicipio.departamentoId);
      setFormularioMunicipio({
        id: datosMunicipio.id,
        nombre: datosMunicipio.nombre,
        departamentoId: datosMunicipio.departamentoId,
        numero: datosMunicipio.numero,
      });
    }
  },[showModal])
  const saveMunicipio = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (
      (formularioMunicipio.nombre == "")
    ) {
      mostraAlerta("Escriba el nombre del municipio", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioMunicipio.nombre.length < 3)) {
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioMunicipio.departamentoId == null)) {
      setErrorDepartamentoId(true);
      mostraAlerta(
        "Debe seleccionar un departamento",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    try {
      await AxiosPrivado
        .post(guardarMunicipios, formularioMunicipio)
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
  const manejadorMunicipio = (event) => {
    setFormularioMunicipio({
      ...formularioMunicipio,
      [event.target.name]: event.target.value,
    });
  };


  const modificarMunicipio = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioMunicipio.id === null) {
      mostraAlerta("Debe seleccionar un municipio", "warning");
      return;
    }
    if (formularioMunicipio.nombre == "") {
      console.log("El campo nombre solo debe contener letras");
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre solo debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioMunicipio.departamentoId == null)) {
      setErrorDepartamentoId(true);
      mostraAlerta(
        "Debe seleccionar un departamento",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorDepartamentoId(false);
    AxiosPrivado
      .put(editarMunicipios + formularioMunicipio.id, formularioMunicipio)
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
    setErrorDepartamentoId(false);
    setDepartamentoId(null);
    setPaisId(null);
    setFormularioMunicipio({
      id: null,
      nombre: "",
      departamentoId: null,
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
            Crear Municipio/Condado
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
          <h4 className="modal-title text-primary">Formulario de Municipio/Condado</h4>
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
                      id="text"
                      placeholder="Ingrese el nombre"
                      name="nombre"
                      value={formularioMunicipio.nombre}
                      onChange={manejadorMunicipio}
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
                      id="text"
                      placeholder="Ingrese el código"
                      name="numero"
                      value={formularioMunicipio.numero}
                      onChange={manejadorMunicipio}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="paisesId">Paises</label>
                    <Select

                      value={
                        paiId &&
                        paises?.find(
                          (opcion) =>
                            opcion.value === paiId
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
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="departamentoId">Departamentos/Estados</label>
                    <Select
                      value={
                        departamentoId &&
                        departamentos?.find(
                          (opcion) =>
                            opcion.value === departamentoId
                        )
                      }
                      onChange={(event) => {
                        setDepartamentoId(event.value);
                      }}
                      options={departamentos}
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
              <Button variant="primary" onClick={saveMunicipio}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarMunicipio}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionMunicipio datos={datosMunicipio} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionMunicipio>
    </>
  );
}

export default ModalMunicipioForm;
