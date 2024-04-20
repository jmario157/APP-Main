import React, { useContext, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { DataContextProfesion } from "../../context/DataContextProfesion";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import {
  listarProyectos,
  guardarProyectos,
  editarProyectos,
  guardarProfesiones,
  listarProfesiones,
  modificarProfesiones,
} from "../../apiUrls";

function ModalProfesion({ accion, datosProfesion }) {
  const [show, setShow] = useState(false);
  const [profesion, setProfesion] = useState([]);
  const [errorNombre, setErrorNombre] = useState(false);
  const {  profesionArrar, setProfesionArray,
    profesionLista, setProfesionLista, } =
    useContext(DataContextProfesion)

  const [formularioProfesion, setFormularioProfesion] = useState({
    id: null,
    nombre: "",
  });

  useEffect(() => {
    if (datosProfesion != null) {
      setFormularioProfesion({
        id: datosProfesion.id,
        nombre: datosProfesion.nombre,
        
      });
    } else {
      setFormularioProfesion({
        id: null,
        nombre: "",
    
      });
    }
  }, [datosProfesion]);

  const manejadorProyectos = (event) => {
    setFormularioProfesion({
      ...formularioProfesion,
      [event.target.name]: event.target.value,
    });
  };

  const modificarProyecto = () => {
    console.log(formularioProfesion)
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioProfesion.nombre === "" ) {
      console.log("Por favor, El nombre de la Profesion no puede ir vacio");
      mostraAlerta(
        "Por favor, El nombre de la profesion  puede ir vacio",
        "warning"
      );
      return;
    }
    if (formularioProfesion.nombre.length <= 3) {
      console.log("Por favor, el nombre de la profesión debe tener más de tres caracteres");
      mostraAlerta("Por favor, el nombre de la profesión debe tener más de tres caracteres", "warning");
      return;
    }
    axios
      .put(modificarProfesiones + formularioProfesion.id, formularioProfesion)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo === 1) {
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo === 0) {
          mostraAlerta(response.data.msj);
        } else if (response.data.tipo === 2) {
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
      const response = await axios.get(listarProfesiones);
      setProfesionLista(response.data);

      setProfesion([]);
      response.data.datos.forEach((element) => {
        profesion.push(element);
      });

      setProfesionArray(profesion);
    } catch (error) {
      mostraAlerta(
        "Ha ocurrido un error al cargar los datos, vuelva a intertarlo",
        "danger"
      );
    }
  };

  const guardarProyecto = async () => {
    // Validar campos vacíos
    if (formularioProfesion.nombre === "") {
      console.log("Por favor, revise los datos del Nombre de la Profesion");
      setErrorNombre(true);
      mostraAlerta(
        "Por favor, revise los datos del Nombre de la Profesion",
        "warning"
      );
      return;
    }
    if (formularioProfesion.nombre.length <= 3) {
      console.log("Por favor, el nombre de la profesión debe tener más de tres caracteres");
      mostraAlerta("Por favor, el nombre de la profesión debe tener más de tres caracteres", "warning");
      return;
    }
   
    setErrorNombre(false);

    try {
      console.log(formularioProfesion)
      await axios
        .post(guardarProfesiones, formularioProfesion)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo === 1) {
            mostraAlerta(response.data.msj, "success");
            limpiarCampos(setFormularioProfesion);
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
            "Ha ocurrido un error, vuelva a intentar o comuniquese con el administrador",
            "error"
          );
        });

      fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error + "comuniquese con el administrador", "danger");
    }
  };

  const limpiarCampos = (setFormularioProfesion) => {
    setFormularioProfesion({
      id: null,
      nombre: ""
    });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (

    <>

      {accion ? (
        <Button variant="primary" onClick={handleShow}>
          Crear Profesion
        </Button>
      ) : (
        <Button variant="warning" onClick={handleShow}>
          Modificar
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {accion ? (
            <Modal.Title>Crea la Profesión</Modal.Title>
          ) : (
            <Modal.Title>Modifica la Profesión</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Nombre del Profesion</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Ingrese el nombre del proyecto"
                  name="nombre"
                  value={formularioProfesion.nombre}
                  onChange={manejadorProyectos}
                />
              </div>
            
             

           </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          {accion ? (
            <Button variant="primary" onClick={guardarProyecto}>
              Guardar
            </Button>
          ) : (
            <Button variant="info" onClick={modificarProyecto}>
              Modificar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProfesion;
