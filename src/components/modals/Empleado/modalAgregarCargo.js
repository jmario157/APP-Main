import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import {DataContextCargo } from "../../context/DataCargo";
import { 
  listarCargos, guardarCargos} from "../../apiUrls";
const ModalAddCargo = () => {
  const [formularioCargo, setFormularioCargo] = useState({
    nombre: "",
  });
  const [showModal, setShowModal] = useState(false);
  const { setCargos } = useContext(DataContextCargo);

  const traerCargos = async () => {
    try {
      const response = await axios.get(listarCargos);
      const data = response.data;
      const formattedOptions = data.datos.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));
      setCargos(formattedOptions);
   
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setFormularioCargo({
      ...formularioCargo,
      [event.target.name]: event.target.value,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };


  const saveCargos = async (event) => {
    event.preventDefault();

    // Validar campos vacíos
    if (formularioCargo.nombre === "") {
      mostraAlerta("Por favor, complete el nombre del cargo",'warning');
      return;
    }

    try {
      const response = await axios.post(
        guardarCargos,
        formularioCargo
      );

      const data = response.data;
      if (response.data.tipo === 1) {
        mostraAlerta((response.data.msj),'success');
      } else if(response.data.tipo === 0) {
      
        for (let i = 0; i < response.data.msj.length; i++) {
          response.data.msj.forEach(element => {
            console.log(element)
            mostraAlerta(element)
          });
        }
      }else if(response.data.tipo === 2){
       response.data.msj.forEach(element => {
         console.log(element.campo +' '+ element.msj  )
         mostraAlerta("El campo : " + element.campo + ", " + element.msj )
       });
      }

      traerCargos()
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <Button variant="primary" onClick={handleOpenModal}>
        Nuevo Cargo
      </Button>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="modal-center"
      >
        <Modal.Header >
          <Modal.Title>Nuevo Cargo</Modal.Title>
          <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseModal}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveCargos}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre del cargo</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formularioCargo.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalAddCargo;
