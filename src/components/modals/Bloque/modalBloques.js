import React, { useContext, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { DataContext } from "../../context/DataContextBloques";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import {
  listarEtapas,
  guardarBloques,
  editarEtapa,
  editarBloques,
  listarBloques,
  listarProyectos,
  listarEtapaId
} from "../../apiUrls";
import { set } from "date-fns";
import Select from "react-select";
function BloqueModal({ accion, datosDelBloque }) {
  const [show, setShow] = useState(false);
  const [etapas, setEtapas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState(false);
  const { bloquesArray, setBloquesArray, bloquesLista, setBloquesLista } =
    useContext(DataContext);

  const [formularioBloques, setFormularioBloques] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    activo: true,
    etapaId: "",
  });

  const [formularioProyecto, setFormularioProyecto] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    activo: true,
    Imagen:
      "https://www.bcone.com/wp-content/uploads/2020/04/user-manuals-icon-1030x984.png",
  });
  useEffect(() => {
    traerEtapas();
    TraerProyectos();
  }, []);
  useEffect(() => {
    if (datosDelBloque != null) {
      setFormularioBloques({
        id: datosDelBloque.id,
        nombre: datosDelBloque.nombre,
        descripcion: datosDelBloque.descripcion,
        activo: datosDelBloque.activo,
        etapaId: datosDelBloque.etapaId,
      });
    } else {
      setFormularioBloques({
        id: null,
        nombre: "",
        descripcion: "",
        activo: true,
        etapaId: "",
      });
    }
  }, [datosDelBloque]);

  const traerEtapas = async () => {
    try {
      const response = await axios.get(listarEtapas);
      const data = response.data;
      const formattedOptions = data.datos.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));
      setEtapas(formattedOptions);
    } catch (error) {
      console.log(error);
    }
  };
  const manejadorBloques = (event) => {
    setFormularioBloques({
      ...formularioBloques,
      [event.target.name]: event.target.value,
    });
  };

  const modificarBloques = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioBloques.nombre === "") {
      console.log("Por favor, El nombre del bloque no puede ir vacio");
      mostraAlerta(
        "Por favor, El nombre del bloque no puede ir vacio",
        "warning"
      );
      return;
    }

    axios
      .put(editarBloques + formularioBloques.id, formularioBloques)
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
  const TraerProyectos = async () => {
    try {
      const response = await axios.get(listarProyectos).then((response) => {
        // Obtener los datos de la respuesta
        const data = response.data;

        // Transformar los datos de la API en el formato requerido por react-select
        const formattedOptions = data.datos.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));

        setProyectos(formattedOptions);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filtlarEtapas = async(id) =>{
    try {
      const response = await axios.get(listarEtapaId + id);
      const data = response.data;
      const formattedOptions = data.datos.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));
      setEtapas(formattedOptions);
    } catch (error) {
      
    }
  }
  const fetchData = async () => {
    try {
      const response = await axios.get(listarBloques);
      setBloquesLista(response.data);

      setBloques([]);
      response.data.datos.forEach((element) => {
        bloques.push(element);
      });

      setBloquesArray(bloques);
    } catch (error) {
      mostraAlerta(
        "Ha ocurrido un error al cargar los datos, vuelva a intertarlo",
        "danger"
      );
    }
  };

  const guardarBloque = async () => {
    // Validar campos vacíos
    if (formularioBloques.nombre === "") {
      console.log("Por favor, revise los datos del Nombre del Bloque");
      setErrorNombre(true);
      mostraAlerta(
        "Por favor, revise los datos del Nombre del Bloque",
        "warning"
      );
      return;
    }
    if (formularioBloques.descripcion === "") {
      console.log("Por favor, revise los datos de la descripcion del Bloque");
      setErrorDescripcion(true);
      mostraAlerta(
        "Por favor, revise los datos de Pla descripcion del Bloque",
        "warning"
      );
      return;
    }

    setErrorNombre(false);
    setErrorDescripcion(false);
    try {
      await axios
        .post(guardarBloques, formularioBloques)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta(response.data.msj, "success");
            limpiarCampos(setFormularioBloques);
          } else if (response.data.tipo == 0) {
            mostraAlerta(
              "El nombre del bloque debe de ser mayor a 3 letras",
              "warning"
            );
          } else if (response.data.tipo == 2) {
            mostraAlerta("Campos no valido intente de nuevo", "warning");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta(
            "Ha ocurrido un error, vuelva a intertar o comuniquese con el adminitrador",
            "error"
          );
        });

      fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error + "comuniquese con el administrador", "danger");
    }
  };

  const limpiarCampos = (setFormularioBloques) => {
    setFormularioBloques({
      id: null,
      nombre: "",
      descripcion: "",
      activo: true,
      etapaId: "",
      // Reinicia los demás campos a su valor inicial
    });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {accion ? (
        <Button variant="primary" onClick={handleShow}>
          Crear Bloque
        </Button>
      ) : (
        <Button variant="warning" onClick={handleShow}>
          Modificar
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {accion ? (
            <Modal.Title>Crea el Bloque</Modal.Title>
          ) : (
            <Modal.Title>Modifica el Bloque</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="card-body">
              <div className="form-group">
               <div className="center">
                  <div className="form-group position-relative">
                    <label htmlFor="exampleInputEmail1">
                      Seleccione El Proyecto
                    </label>
                    <Select
                      value={
                        formularioProyecto &&
                        etapas.find(
                          (opcion) => opcion.value === formularioProyecto
                        )
                      }
                      onChange={(event) => {
                       filtlarEtapas(event.value);
                      }}
                      options={proyectos}
                      isSearchable={true}
                    ></Select>
                  </div>
                </div> 
                <div className="center">
                  <div className="form-group position-relative">
                    <label htmlFor="exampleInputEmail1">
                      Seleccione El Proyecto
                    </label>
                    <Select
                      value={
                        formularioBloques &&
                        etapas.find(
                          (opcion) => opcion.value === formularioBloques
                        )
                      }
                      onChange={(event) => {
                        setFormularioBloques({
                          ...formularioBloques,
                          etapaId: event.value,
                        });
                      }}
                      options={etapas}
                      isSearchable={true}
                    ></Select>
                  </div>
                </div> 
                <label htmlFor="exampleInputEmail1">Nombre del Bloque</label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  placeholder="Ingrese el nombre del bloque"
                  name="nombre"
                  value={formularioBloques.nombre}
                  onChange={manejadorBloques}
                />
              </div>
              <div className="form-group">
                <label>Descripción del Bloque</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Ingrese Información del bloque"
                  name="descripcion"
                  value={formularioBloques.descripcion}
                  onChange={manejadorBloques}
                />
              </div>
              <div className="form-group position-relative">
                <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success position-absolute">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitch3"
                    name="activo"
                    checked={formularioBloques.activo}
                    onChange={(event) => {
                      setFormularioBloques({
                        ...formularioBloques,
                        activo: event.target.checked,
                      });
                    }}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customSwitch3"
                  >
                    Estado del Bloque
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
            <Button variant="primary" onClick={guardarBloque}>
              Guardar
            </Button>
          ) : (
            <Button variant="info" onClick={modificarBloques}>
              Modificar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BloqueModal;
