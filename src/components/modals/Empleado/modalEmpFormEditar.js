import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import axios from "axios";
import Select from "react-select";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import { DataContext } from "../../context/DataEmpleadoContext";

import ModalAddCargo from "./modalAgregarCargo";
import { DataContextCargo } from "../../context/DataCargo";
import { listarEmpleado, listarCargos, editarEmpleado } from "../../apiUrls";

function ModalEmpFormEditar({ empleado }) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [empleados, setEmpleados] = useState([]);

  const { setData, setEmpleadoArray } = useContext(DataContext);
  const { cargos, setCargos } = useContext(DataContextCargo);

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

  const [unEmpleado, setUnEmpleado] = useState({
    identidad: empleado.identidad,
    primernombre: empleado.primernombre,
    segundonombre: empleado.segundonombre,
    primerapellido: empleado.primerapellido,
    segundoapellido: empleado.segundoapellido,
    salario: empleado.salario,
    fechaingreso: empleado.fechaingreso,
    activo: empleado.activo,
    Imagen:
      "https://th.bing.com/th/id/R.579240372b9ea8f56ac3cb39d4c02c82?rik=w4w6Dia1XQxGyg&pid=ImgRaw&r=0",
    cargoId: empleado.cargoId,
  });

  const handleInputChange = (event) => {
    setUnEmpleado({
      ...unEmpleado,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    traerCargos();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(listarEmpleado);
      setData(response.data);

      setEmpleados([]);
      response.data.datos.forEach((element) => {
        empleados.push(element);
      });

      setEmpleadoArray(empleados);
    } catch (error) {
      console.log(error);
    }
  };

  const modificarEmpleado = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (unEmpleado.primernombre === "") {
      console.log("Por favor, complete todos los campos");
      mostraAlerta("Por favor, complete todos los campos", "warning");
      return;
    }
    if (!regex.test(unEmpleado.primernombre)) {
      console.log("El campo primernombre solo debe contener letras");
      mostraAlerta(
        "El campo primer nombre solo debe contener letras",
        "warning"
      );
      return;
    }
    if (!/^\d+$/.test(unEmpleado.salario)) {
      console.log("Por favor, ingrese solo números en el campo salario");
      mostraAlerta(
        "Por favor, ingrese solo números en el campo salario",
        "warning"
      );
      return;
    }

    axios
      .put(editarEmpleado + empleado.id, unEmpleado)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo === 1) {
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo === 0) {
          for (let i = 0; i < response.data.msj.length; i++) {
            response.data.msj.forEach((element) => {
              console.log(element);
              mostraAlerta(element);
            });
          }
        } else if (response.data.tipo === 2) {
          response.data.msj.forEach((element) => {
            console.log(element.campo + " " + element.msj);
            mostraAlerta("El campo : " + element.campo + ", " + element.msj);
          });
        }
        fetchData();
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        mostraAlerta(error);
      });
  };

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        Editar
      </Button>

      <Modal show={showModal} onHide={handleClose} className="custom-modal">
        <div className="modal-content modal-xl">
          <div className="modal-header modal-primary">
            <h4 className="modal-title text-primary">Formulario de Empleado</h4>
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
            <p>Actualice la información del empleado</p>
            <form>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Identidad</label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Ingrese la identidad"
                        name="identidad"
                        value={unEmpleado.identidad}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Primer Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Ingrese el primer nombre"
                        name="primernombre"
                        value={unEmpleado.primernombre}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Segundo Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Ingrese el segundo nombre"
                        name="segundonombre"
                        value={unEmpleado.segundonombre}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Primer Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Ingrese el Primer Apellido"
                        name="primerapellido"
                        value={unEmpleado.primerapellido}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Segundo Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Ingrese el Segundo Apellido"
                        name="segundoapellido"
                        value={unEmpleado.segundoapellido}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Salario</label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Ingrese el Salario"
                        name="salario"
                        value={unEmpleado.salario}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Fecha de Ingreso
                      </label>

                      <ReactDatePicker
                       selected={
                        unEmpleado.fechaingreso
                          ? new Date(unEmpleado.fechaingreso)
                          : null
                      }
                      onChange={(date) => {
                        const adjustedDate = new Date(date);
                        adjustedDate.setHours(12, 0, 0);

                        setUnEmpleado({
                          ...unEmpleado,
                          fechaingreso: adjustedDate,
                        });
                      }}
                      dateFormat="yyyy/MM/dd"
                      className={`form-control` }
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Estado del empleado</label>
                      <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                        <span style={{ margin: "0 30px" }}></span>
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitch3"
                          name="activo"
                          checked={unEmpleado.activo}
                          onChange={(event) => {
                            setUnEmpleado({
                              ...unEmpleado,
                              activo: event.target.checked,
                            });
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch3"
                        ></label>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Seleccione el cargo
                      </label>

                      <Select
                        value={
                          unEmpleado.cargoId &&
                          cargos.find(
                            (opcion) => opcion.value === unEmpleado.cargoId
                          )
                        }
                        onChange={(event) => {
                          setUnEmpleado({
                            ...unEmpleado,
                            cargoId: event.value,
                          });
                        }}
                        options={cargos}
                        isSearchable={true}
                      ></Select>
                    </div>
                    <ModalAddCargo />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputFile">Seleccione la foto</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="exampleInputFile"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="exampleInputFile"
                      >
                        Choose file
                      </label>
                    </div>
                    <div className="input-group-append">
                      <span className="input-group-text">Upload</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* /.card-body */}
            </form>
          </div>
          <div className="modal-footer justify-content-between">
            <button
              type="button"
              className="btn btn-default"
              onClick={handleClose}
            >
              Cerrar
            </button>
            <div className="card-footer">
              <span style={{ margin: "0 12px" }}></span>
              <button
                className="btn btn-info"
                onClick={(event) => modificarEmpleado(event)}
              >
                Modificar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalEmpFormEditar;
