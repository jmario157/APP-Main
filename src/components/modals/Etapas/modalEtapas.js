import React, { useContext, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { DataContext } from "../../context/DataContextEtapas";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import Select from "react-select";
import {
  listarProyectos,
  guardarEtapa,
  editarProyectos,
  listarEtapas,
  editarEtapa,
} from "../../apiUrls";
import { set } from "date-fns";
function EtapaModal({ accion, datosEtapas }) {
  const [show, setShow] = useState(false);
  const [etapas, setEtapas] = useState([]);
  const [project, setProject] = useState([]);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState(false);
  const { etapasArray, setEtapaArray, etapaLista, setEtapaLista } =
    useContext(DataContext);

  useEffect(() => {
    traerProyecto();
  }, []);
  const [formularioEtapa, setFormularioEtapa] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    activo: true,
    proyectoId: "",
  });

  useEffect(() => {
    if (datosEtapas != null) {
      setFormularioEtapa({
        id: datosEtapas.id,
        nombre: datosEtapas.nombre,
        descripcion: datosEtapas.descripcion,
        activo: datosEtapas.activo,
        proyectoId: datosEtapas.proyectoId,
      });
    } else {
      setFormularioEtapa({
        id: null,
        nombre: "",
        descripcion: "",
        activo: true,
        proyectoId: "",
      });
    }
  }, [datosEtapas]);

  const traerProyecto = async () => {
    try {
      const response = await axios.get(listarProyectos);
      const data = response.data;
      const formattedOptions = data.datos.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));
      setProject(formattedOptions);
    } catch (error) {
      console.log(error);
    }
  };
  const manejadorEtapas = (event) => {
    setFormularioEtapa({
      ...formularioEtapa,
      [event.target.name]: event.target.value,
    });
  };

  const modificarEtapa = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioEtapa.nombre === "") {
      console.log("Por favor, El nombre de la etapa no puede ir vacio");
      mostraAlerta(
        "Por favor, El nombre de la etapa no puede ir vacio",
        "warning"
      );
      return;
    }

    axios
      .put(editarEtapa + formularioEtapa.id, formularioEtapa)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo == 1) {
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo == 0) {
          mostraAlerta(response.data.msj);
        } else if (response.data.tipo == 2) {
          mostraAlerta(response.data.msj);
        }
        fetchData();
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        mostraAlerta(error);
      });
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(listarEtapas);
      setEtapaLista(response.data);

      setEtapas([]);
      response.data.datos.forEach((element) => {
        etapas.push(element);
      });

      setEtapaArray(etapas);
    } catch (error) {
      mostraAlerta(
        "Ha ocurrido un error al cargar los datos, vuelva a intertarlo",
        "danger"
      );
    }
  };

  const guardarEtapas = async () => {
    // Validar campos vacíos
    if (formularioEtapa.nombre === "") {
      console.log("Por favor, revise los datos del Nombre dde la Etapa");
      setErrorNombre(true);
      mostraAlerta(
        "Por favor, revise los datos del Nombre de la Etapa",
        "warning"
      );
      return;
    }
    if (formularioEtapa.descripcion === "") {
      console.log("Por favor, revise los datos de la descripcion de la Etapa");
      setErrorDescripcion(true);
      mostraAlerta(
        "Por favor, revise los datos de Pla descripcion dde la Etapa",
        "warning"
      );
      return;
    }

    setErrorNombre(false);
    setErrorDescripcion(false);
    console.log(formularioEtapa);
    try {
      await axios
        .post(guardarEtapa, formularioEtapa)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo === 1) {
            mostraAlerta(response.data.msj, "success");
            limpiarCampos(setFormularioEtapa);
          } else if (response.data.tipo === 0) {
            mostraAlerta(
              "El nombre del proyecto debe de ser mayor a 3 letras",
              "warning"
            );
          } else if (response.data.tipo === 2) {
            mostraAlerta("Campos no valido intente de nuevo", "warning");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta(
            "Ha ocurrido un error, vuelva a intentar o comuniquese con el adminitrador" +
              error,
            "error"
          );
        });

      fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error + "comuniquese con el administrador", "danger");
    }
  };

  const limpiarCampos = (setFormularioEtapa) => {
    setFormularioEtapa({
      id: null,
      nombre: "",
      descripcion: "",
      activo: true,
      proyectoId:""
      // Reinicia los demás campos a su valor inicial
    });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {accion ? (
        <Button variant="primary" onClick={handleShow}>
          Crear Etapa
        </Button>
      ) : (
        <Button variant="warning" onClick={handleShow}>
          Modificar
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {accion ? (
            <Modal.Title>Crea la Etapa</Modal.Title>
          ) : (
            <Modal.Title>Modifica la Etapa</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="card-body">
              <div className="form-group">
                
                <div className="col-sm-8">
                  <div className="form-group">
                  
                      <label htmlFor="exampleInputEmail1">
                        Seleccione el Proyecto
                      </label>
                      <Select
                        value={
                          formularioEtapa.proyectoId &&
                          project.find(
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
                        options={project}
                        isSearchable={true}
                      ></Select>
               
                  </div>
                </div>
                <label htmlFor="exampleInputEmail1">Nombre de la Etapa</label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  placeholder="Ingrese el nombre de la etapa"
                  name="nombre"
                  value={formularioEtapa.nombre}
                  onChange={manejadorEtapas}
                />
              </div>
              <div className="form-group">
                <label>Descripción de la Etapa</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Ingrese Información de la etapa"
                  name="descripcion"
                  value={formularioEtapa.descripcion}
                  onChange={manejadorEtapas}
                />
              </div>

              <div className="form-group">
                <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitch3"
                    name="activo"
                    S
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
                    Estado de la Etapa
                  </label>
                </div>
              </div>
            </div>
            {/* /.card-body */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          {accion ? (
            <Button variant="primary" onClick={guardarEtapas}>
              Guardar
            </Button>
          ) : (
            <Button variant="info" onClick={modificarEtapa}>
              Modificar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EtapaModal;
