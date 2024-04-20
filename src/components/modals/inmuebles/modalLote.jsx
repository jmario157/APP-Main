import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import {
  guardarBloques,
  editarBloques,
} from "../../apiUrls";
import { AxiosPrivado } from "../../axios/Axios";
import Select from "react-select";
import ModalInformacionLote from "./modalInformacionLote";
function ModalLoteForm({ accion, datosLote, datosBloques, ActualizarTabla, datosProyectos, datosEtapas }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorEtapaId, setErrorEtapaId] = useState(false);
  const [Etapas, setEtapas] = useState({});
  const [proyectoId, setProyectoId] = useState(null);
  const [formularioBloque, setFormularioBloque] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    etapaId: null,
    activo: true,
  });
  const proyectos = datosProyectos?.map((f) => ({
    value: f.id,
    label: f.nombre
  }));
  
  useEffect(() => {
    if (datosBloque != null) {
      setProyectoId(datosBloque.etapa.proyecto.id)
      setFormularioBloque({
        ...datosBloque
      });
      
    } else {
      setFormularioBloque({
        id: null,
        nombre: "",
        descripcion: "",
        etapaId: null,
        activo: true,
      });
    }
  }, []);
  useEffect(()=>{
    /*setFormularioBloque({
      ...formularioBloque,
      etapaId: null
    })*/
    //if(proyectoId){
      const lista = datosEtapas.filter((f)=>f.proyectoId==proyectoId);
      const lista2 = lista?.map((f)=>({
        value: f.id,
        label: f.nombre
      }));
      setEtapas(lista2);
    //}
  },[proyectoId]);

  const saveBloque = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioBloque.nombre == "")
    ) {
      mostraAlerta("Escriba el nombre del bloque", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioBloque.nombre.length < 3)) {
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioBloque.etapaId == null)) {
      setErrorEtapaId(true);
      mostraAlerta(
        "Debe seleccionar una etapa",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorEtapaId(false);
    try {
      await AxiosPrivado
        .post(guardarBloques, formularioBloque)
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
  const manejadorBloque = (event) => {
    setFormularioBloque({
      ...formularioBloque,
      [event.target.name]: event.target.value,
    });
  };


  const modificarBloque = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioBloque.id === null) {
      mostraAlerta("Debe seleccionar una bloque", "warning");
      return;
    }
    if (formularioBloque.nombre == "") {
      console.log("El campo nombre solo debe contener letras");
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre solo debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if ((formularioBloque.etapaId == null)) {
      setErrorEtapaId(true);
      mostraAlerta(
        "Debe seleccionar una etapa",
        "warning"
      );
      return;
    }
    setErrorNombre(false);
    setErrorEtapaId(false);
    AxiosPrivado
      .put(editarBloques + formularioBloque.id, formularioBloque)
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
    setErrorEtapaId(false);
    setProyectoId(null);
    //setEtapas([]);
    setFormularioBloque({
      id: null,
      nombre: "",
      descripcion: "",
      etapaId: null,
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
            Crear Bloque
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
          <h4 className="modal-title text-primary">Formulario de Bloques</h4>
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
                      value={formularioBloque.nombre}
                      onChange={manejadorBloque}
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
                      placeholder="Descripción del bloque"
                      name="descripcion"
                      value={formularioBloque.descripcion}
                      onChange={manejadorBloque}
                    />
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
                <div className="col-sm-10">
                  <div className="form-group">
                    <label htmlFor="etapaId">Etapa</label>
                    <Select
                      value={
                        formularioBloque.etapaId &&
                        Etapas?.find(
                          (opcion) =>
                            opcion.value === formularioBloque.etapaId
                        )
                      }
                      onChange={(event) => {
                        setFormularioBloque({
                          ...formularioBloque,
                          etapaId: event.value
                        });
                      }}
                      options={Etapas}
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
                        checked={formularioBloque.activo}
                        onChange={(event) => {
                          setFormularioBloque({
                            ...formularioBloque,
                            activo: event.target.checked,
                          });
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customSwitch3"
                      >
                        {formularioBloque.activo ? 'Activo' : 'Inactivo'}
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
              <Button variant="primary" onClick={saveBloque}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarBloque}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionLote datos={datosLote} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionLote>
    </>
  );
}

export default ModalLoteForm;
