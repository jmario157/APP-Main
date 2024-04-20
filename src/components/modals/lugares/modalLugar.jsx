import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import {
  guardarBloques,
  editarBloques,
  guardarLugares,
  editarLugares,
} from "../../apiUrls";
import { AxiosPrivado } from "../../axios/Axios";
import Select from "react-select";
import ModalInformacionBloque from "./modalInformacionLugar";
function ModalLugarForm({ accion, datosDepartamentos, ActualizarTabla, datosMunicipios, datosLugar, datosPaises }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorMunicipioId, setErrorMunicipioId] = useState(false);
  const [paiId, setPaisId] = useState(null);
  const [departamentoId, setDepartamentoId] = useState(null);
  const [departamentos, setDepartamentos] = useState({});
  const [municipioId, setMunicipioId] = useState(null);
  const [municipios, setMunicipios] = useState({});
  const [formularioLugar, setFormularioLugar] = useState({
    id: null,
    nombre: "",
    municipioId: null,
  });
  const paises = datosPaises?.map((f) => ({
    value: f.id,
    label: f.nombre
  }));
  useEffect(() => {
    if (datosLugar != null) {
      setFormularioLugar({
        id: datosLugar.id,
        nombre: datosLugar.nombre,
        municipioId: datosLugar.municipioId
      });
      setPaisId(datosLugar.municipio.departamento.pai.id);
      setDepartamentoId(datosLugar.municipio.departamentoId);
      setMunicipioId(datosLugar.municipioId);
    } else {
      setFormularioLugar({
        id: null,
        nombre: "",
        municipioId: null,
      });
      setPaisId(null);
      setDepartamentoId(null);
      setMunicipioId(null);
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
    const lista = datosMunicipios.filter((f) => f.departamentoId == departamentoId);
    const lista2 = lista?.map((f) => ({
      value: f.id,
      label: f.nombre
    }));
    setMunicipios(lista2);
    //}
  }, [departamentoId]);
  useEffect(() => {
    if (datosLugar != null) {
      setFormularioLugar({
        id: datosLugar.id,
        nombre: datosLugar.nombre,
        municipioId: datosLugar.municipioId
      });
    } else {
      setFormularioLugar({
        ...formularioLugar,
        municipioId: municipioId
      })
    }
  }, [municipioId]);
  useEffect(()=>{
    if (showModal && datosLugar != null){
      setDepartamentoId(datosLugar.municipio.departamentoId);
      setMunicipioId(datosLugar.municipioId);
    }
  },[showModal])
  const saveLugar = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioLugar.nombre == "")
    ) {
      mostraAlerta("Escriba el nombre del lugar", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioLugar.nombre.length < 3)) {
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioLugar.municipioId == null)) {
      setErrorMunicipioId(true);
      mostraAlerta(
        "Debe seleccionar un municipio",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    try {
      await AxiosPrivado
        .post(guardarLugares, formularioLugar)
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
  const manejadorLugar = (event) => {
    setFormularioLugar({
      ...formularioLugar,
      [event.target.name]: event.target.value,
    });
  };


  const modificarLugar = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioLugar.id === null) {
      mostraAlerta("Debe seleccionar un lugar", "warning");
      return;
    }
    if (formularioLugar.nombre == "") {
      console.log("El campo nombre solo debe contener letras");
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre solo debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioLugar.municipioId == null)) {
      setErrorMunicipioId(true);
      mostraAlerta(
        "Debe seleccionar una etapa",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorMunicipioId(false);
    AxiosPrivado
      .put(editarLugares + formularioLugar.id, formularioLugar)
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
    setErrorMunicipioId(false);
    setDepartamentoId(null);
    setMunicipioId(null);
    //setEtapas([]);
    setFormularioLugar({
      id: null,
      nombre: "",
      municipioId: null,
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
            Crear Lugar
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
          <h4 className="modal-title text-primary">Formulario de Lugar</h4>
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
                      value={formularioLugar.nombre}
                      onChange={manejadorLugar}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
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
              </div>
              <div className="row">
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
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="municipioId">Municipios/Condados</label>
                    <Select
                      value={
                        municipioId &&
                        municipios?.find(
                          (opcion) =>
                            opcion.value === municipioId
                        )
                      }
                      onChange={(event) => {
                        setMunicipioId(event.value);
                      }}
                      options={municipios}
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
              <Button variant="info" onClick={modificarLugar}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionBloque datos={datosLugar} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionBloque>
    </>
  );
}

export default ModalLugarForm;
