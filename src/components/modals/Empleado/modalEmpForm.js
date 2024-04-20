import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "admin-lte/dist/css/adminlte.min.css";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import { DataContext } from "../../context/DataEmpleadoContext";
import { useFormularioEmpleado } from "../../data/formularioEmpleadoData";
import {
  handleChange,
 
  limpiarCampos,
} from "../../data/formularioEmpleadoUtils";
import { DataContextCargo } from "../../context/DataCargo";
import ModalAddCargo from "./modalAgregarCargo";
import { listarEmpleado, guardarEmpleado, listarCargos } from "../../apiUrls";
function ModalEmpForm() {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [empleados, setempleados] = useState([]);
  const { formularioEmpleado, setFormularioEmpleado } = useFormularioEmpleado();
  const { setData, setEmpleadoArray } =
    useContext(DataContext);
  const [errorPrimerNombre, setErrorPrimerNombre] = useState(false);
  const [errorSalario, setErrorSalario] = useState(false);
  const [errorSegundoNombre, setErrorSegundoNombre] = useState(false);
  const [errorPrimerApellido, setErrorPrimerApellido] = useState(false);
  const [errorSegundoApellido, setErrorSegundoApellido] = useState(false);
  const [errorFecha, setErrorFecha] = useState(false);
  const [errorIdentidad, setErrorIdentidad] = useState(false);

  const { cargos, setCargos } = useContext(DataContextCargo);

  const fetchData = async () => {
    try {
      const response = await axios.get(listarEmpleado);
      setData(response.data);

      setempleados([]);
      response.data.datos.forEach((element) => {
        empleados.push(element);
      });

      setEmpleadoArray(empleados);
    } catch (error) {
      console.log(error);
    }
  };


  const handleInputChange = (event) => {
    handleChange(event, formularioEmpleado, setFormularioEmpleado);
  };

  const handleLimpiarCampos = () => {
    setErrorPrimerNombre(false);
    setErrorSegundoNombre(false);
    setErrorPrimerApellido(false);
    setErrorSegundoApellido(false);
    setErrorFecha(false);
    setErrorIdentidad(false);
    limpiarCampos(setFormularioEmpleado);
  };

  useEffect(() => {
    traerCargos();
  }, []);

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
  const saveEmpleado = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (
      (formularioEmpleado.identidad,
      formularioEmpleado.primernombre,
      formularioEmpleado.segundonombre,
      formularioEmpleado.fechaingreso === "")
    ) {
      mostraAlerta("Disculpe, Tiene que llenar estos campos", "warning");
      setErrorPrimerNombre(true);
      setErrorSegundoNombre(true);
      setErrorPrimerApellido(true);
      setErrorSegundoApellido(true);
      setErrorFecha(true);
      setErrorIdentidad(true);
      return;
    }
    if (formularioEmpleado.primernombre === "") {
      console.log("Por favor, complete el primer Nombre");
      setErrorPrimerNombre(true);
      mostraAlerta("Por favor, complete el primer Nombre", "warning");
      return;
    }
    if (!regex.test(formularioEmpleado.primernombre)) {
      console.log("El campo primernombre solo debe contener letras");
      setErrorPrimerNombre(true);
      mostraAlerta(
        "El campo primer nombre solo debe contener letras",
        "warning"
      );
      return;
    }
    if (
      formularioEmpleado.segundonombre === "" ||
      !regex.test(formularioEmpleado.segundonombre)
    ) {
      console.log("Por favor, revise los datos de Segundo Nombre");
      setErrorSegundoNombre(true);
      mostraAlerta("Por favor, revise los datos de Segundo Nombre", "warning");
      return;
    }
    if (
      formularioEmpleado.primerapellido === "" ||
      !regex.test(formularioEmpleado.primerapellido)
    ) {
      console.log("Por favor, revise los datos de Primer Apellido");
      setErrorPrimerApellido(true);
      mostraAlerta(
        "Por favor, revise los datos de Primero Apellido",
        "warning"
      );
      return;
    }
    if (
      formularioEmpleado.segundoapellido === "" ||
      !regex.test(formularioEmpleado.segundoapellido)
    ) {
      console.log("Por favor, revise los datos de Segundo Apellido");
      setErrorSegundoApellido(true);
      mostraAlerta(
        "Por favor, revise los datos de Segundo Apellido",
        "warning"
      );
      return;
    }
    if (formularioEmpleado.fechaingreso === "") {
      console.log("Por favor, seleccione una fecha");
      setErrorFecha(true);
      mostraAlerta("Por favor, seleccione una fecha", "warning");
      return;
    }
    if (formularioEmpleado.fechaingreso === "") {
      console.log("Por favor, seleccione un Cargo");
      setErrorFecha(true);
      mostraAlerta("Por favor, seleccione un Cargo", "warning");
      return;
    }
    if (!/^\d+$/.test(formularioEmpleado.salario)) {
      console.log("Por favor, ingrese solo números en el campo salario");
      setErrorSalario(true);
      mostraAlerta(
        "Por favor, ingrese solo números en el campo salario",
        "warning"
      );
      return;
    }
    setErrorIdentidad(false);
    setErrorPrimerNombre(false);
    setErrorSalario(false);
    setErrorPrimerApellido(false);
    setErrorSegundoNombre(false);
    setErrorSegundoApellido(false);
    setErrorFecha(false);
    try {
      await axios
        .post(guardarEmpleado, formularioEmpleado)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo === 1) {
            mostraAlerta(response.data.msj, "success");
            limpiarCampos(setFormularioEmpleado);
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
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta(error, "error");
        });

      fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error + "comuniquese con el administrador", "danger");
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Crear Empleado
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
            <p>Ingrese la información del empleado</p>
            <form>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Identidad</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errorIdentidad ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="Ingrese la identidad"
                        name="identidad"
                        value={formularioEmpleado.identidad}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Primer Nombre</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errorPrimerNombre ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="Ingrese el primer nombre"
                        name="primernombre"
                        value={formularioEmpleado.primernombre}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Segundo Nombre</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errorSegundoNombre ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="Ingrese el segundo nombre"
                        name="segundonombre"
                        value={formularioEmpleado.segundonombre}
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
                        className={`form-control ${
                          errorPrimerApellido ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="Ingrese el Primer Apellido"
                        name="primerapellido"
                        value={formularioEmpleado.primerapellido}
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
                        className={`form-control ${
                          errorSegundoApellido ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="Ingrese el Segundo Apellido"
                        name="segundoapellido"
                        value={formularioEmpleado.segundoapellido}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Salario</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errorSalario ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="Ingrese el Salario"
                        name="salario"
                        value={formularioEmpleado.salario}
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
                            formularioEmpleado.fechaingreso
                              ? new Date(formularioEmpleado.fechaingreso)
                              : null
                          }
                          onChange={(date) => {
                            const adjustedDate = new Date(date);
                            adjustedDate.setHours(12, 0, 0);

                            setFormularioEmpleado({
                              ...formularioEmpleado,
                              fechaingreso: adjustedDate,
                            });
                          }}
                          dateFormat="yyyy/MM/dd"
                          className={`form-control ${
                            errorFecha ? "is-invalid" : ""
                          }`} // Aplica la clase de Bootstrap para los estilos del formulario
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
                          checked={formularioEmpleado.activo}
                          onChange={(event) => {
                            setFormularioEmpleado({
                              ...formularioEmpleado,
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
                          formularioEmpleado.cargoId &&
                          cargos.find(
                            (opcion) => opcion.value === formularioEmpleado.cargoId
                          )
                        }
                        onChange={(event) => {
                          setFormularioEmpleado({
                            ...formularioEmpleado,
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
                {/* <div className="form-group">
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
                </div> */}
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
              <button className="btn btn-primary" onClick={saveEmpleado}>
                Crear
              </button>

              <span style={{ margin: "0 12px" }}></span>
              <button
                onClick={handleLimpiarCampos}
                className="btn btn-secondary"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );


}

export default ModalEmpForm;
