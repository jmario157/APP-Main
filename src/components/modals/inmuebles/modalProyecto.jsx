import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../Alerts/sweetAlert";
import {
  guardarProyectos,
  editarProyectos,
  proyectoEditarImagen,
  imagenProyecto,
  listarLugares,
} from "../../apiUrls";
import { AxiosImagen, AxiosPrivado } from "../../axios/Axios";
import ModalInformacionProyecto from "./modalInformacionProyecto";
import BuscarLugar from "../lugares/BuscarLugar";
function ModalProyectoForm({ accion, datosProyecto, ActualizarTabla }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorNombre, setErrorNombre] = useState(false);
  const [nombreLugar, setNombreLugar] = useState("Selecione un lugar");
  const [errorLugar, setErrorLugar] = useState(false);
  const [ActulizarImagen, setActualizarImagen] = useState(false);
  const [listaLugares, setListaLugares] = useState([]);
  const [formularioProyecto, setFormularioProyecto] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    lugarId: null,
    activo: true,
    Imagen: "proyectos.jpg",
  });
  useEffect(async () => {
    const responseLugares = await AxiosPrivado.get(listarLugares);
    setListaLugares(responseLugares.data.datos);
    if (datosProyecto != null) {
      setActualizarImagen(true);
      setFormularioProyecto({
        ...datosProyecto
      });
      buscarIdlugarInicial(datosProyecto.lugarId);
    } else {
      setFormularioProyecto({
        id: null,
        nombre: "",
        descripcion: "",
        lugarId: null,
        activo: true,
        Imagen: "proyectos.jpg",
      });
    }
  }, [showModal]);

  const saveProyecto = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (formularioProyecto.nombre == "") {
      mostraAlerta("Escriba el nombre del proyecto", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioProyecto.nombre.length < 3)) {
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if (formularioProyecto.lugarId == null) {
      mostraAlerta("Escriba el lugar", "warning");
      setErrorLugar(true);
      return;
    }

    setErrorNombre(false);
    setErrorLugar(false);
    try {
      await AxiosPrivado
        .post(guardarProyectos, formularioProyecto)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta(response.data.msj, "success");
            ActualizarTabla();
            limpiarCampos()
          } else if (response.data.tipo === 0) {
            for (let i = 0; i < response.data.msj.length; i++) {
              response.data.msj.forEach((element) => {
                console.log(element);
                mostraAlerta(element.msj, "warning");
              });
            }
          } else if (response.data.tipo === 2) {
            response.data.msj.forEach((element) => {
              console.log(element.campo + " " + element.msj);
              mostraAlerta("El campo : " + element.campo + ", " + element.msj);
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta("Error al momento de guardar", "error");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  const manejadorProyecto = (event) => {
    setFormularioProyecto({
      ...formularioProyecto,
      [event.target.name]: event.target.value,
    });
  };


  const modificarProyecto = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioProyecto.id === null) {
      mostraAlerta("Debe seleccionar un proyecto", "warning");
      return;
    }
    if (formularioProyecto.nombre == "") {
      mostraAlerta("Escriba el nombre del proyecto", "warning");
      setErrorNombre(true);
      return;
    }
    if ((formularioProyecto.nombre.length < 3)) {
      setErrorNombre(true);
      mostraAlerta(
        "El campo nombre debe contener como minimo 3 letras",
        "warning"
      );
      return;
    }
    if (formularioProyecto.lugarId == null) {
      mostraAlerta("Selecione un lugar", "warning");
      setErrorLugar(true);
      return;
    }

    setErrorNombre(false);
    setErrorLugar(false);
    AxiosPrivado
      .put(editarProyectos + formularioProyecto.id, formularioProyecto)
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
    setFormularioProyecto({
      id: null,
      nombre: "",
      descripcion: "",
      lugarId: null,
      activo: true,
      Imagen: "proyectos.jpg",
    });
  };

  const handleOpenModal = () => {
    setShowModalInformacion(true);
  };

  const inputRef = useRef(null);

  const SeleccionarImagen = () => {
    // 👇️ open file input box on click of another element
    inputRef.current.click();
  };

  const handleFileChange = async event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    else {
      try {
        let formData = new FormData();
        formData.append('imagen', event.target.files[0]);
        const respuesta = await AxiosImagen.put(proyectoEditarImagen + formularioProyecto.id,
          formData,
        );
        if (respuesta.data.tipo === 1) {
          formularioProyecto.Imagen = respuesta.data.datos.Imagen;
          ActualizarTabla();
          mostraAlertaOk(respuesta.data.msj);
        }
      } catch (error) {
        console.log(error);
        mostraAlertaError("Error al actualizar la imagen");
      }
    }
  };
  const buscarIdlugarInicial = (id) => {
    const lugarSeleccionado = listaLugares?.find(
      (f) =>
        f.id == id
    );

    if (lugarSeleccionado) {
      setNombreLugar(lugarSeleccionado.nombre + ", " + lugarSeleccionado.municipio.nombre + ", " + lugarSeleccionado.municipio.departamento.nombre);
    }
    else {
      setNombreLugar("Seleccione un lugar");
    }
  };
  const buscarIdlugar = (id) => {
    const lugarSeleccionado = listaLugares?.find(
      (f) =>
        f.id == id
    );

    if (lugarSeleccionado) {
      setFormularioProyecto({
        ...formularioProyecto,
        lugarId: id
      });
      setNombreLugar(lugarSeleccionado.nombre + ", " + lugarSeleccionado.municipio.nombre + ", " + lugarSeleccionado.municipio.departamento.nombre);
    }
    else {
      setFormularioProyecto({
        ...formularioProyecto,
        lugarId: 0
      });
      setNombreLugar("Seleccione un lugar");
    }
  };

  return (
    <>
      {accion ? (
        <div>
          <Button variant="primary" onClick={handleShow}>
            Crear Proyecto
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
          <h4 className="modal-title text-primary">Formulario de Proyecto</h4>
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
                <div className="col-sm-2">
                  <div className="form-group">
                    <div className="text-center">
                      <img className="product-image" src={imagenProyecto + formularioProyecto.Imagen} alt="Foto" />
                    </div>
                    {
                      ActulizarImagen ? (
                        <>
                          <input
                            style={{ display: 'none' }}
                            ref={inputRef}
                            type="file"
                            onChange={handleFileChange}
                          />
                          <Button variant="light" className="btn btn-block btn-outline-info btn-xs" onClick={SeleccionarImagen}>Actualizar</Button>
                        </>
                      ) : (
                        <></>
                      )
                    }
                  </div>
                </div>
                <div className="col-sm-10">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${errorNombre ? "is-invalid" : ""
                        }`}
                      id="text"
                      placeholder="Ingrese el nombre"
                      name="nombre"
                      value={formularioProyecto.nombre}
                      onChange={manejadorProyecto}
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
                      value={formularioProyecto.descripcion}
                      onChange={manejadorProyecto}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-10">
                  <label>Lugar</label>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Ej: 0123"
                      value={nombreLugar}
                      disabled
                    />
                    <BuscarLugar lista={listaLugares} buscarIdlugar={buscarIdlugar}></BuscarLugar>
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
                        checked={formularioProyecto.activo}
                        onChange={(event) => {
                          setFormularioProyecto({
                            ...formularioProyecto,
                            activo: event.target.checked,
                          });
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customSwitch3"
                      >
                        {formularioProyecto.activo ? 'Activo' : 'Inactivo'}
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
              <Button variant="info" onClick={modificarProyecto}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionProyecto datos={datosProyecto} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionProyecto>
    </>
  );
}

export default ModalProyectoForm;
