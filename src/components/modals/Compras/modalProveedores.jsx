import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { mostraAlerta, mostraAlertaOk, mostraAlertaError, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import { guardarProveedores, editarProveedores } from "../../apiUrls"; // Importa las URL de la API aquí
import { AxiosPrivado } from "../../axios/Axios";
import ModalInformacionProveedores from "./modalInformacionProveedores";

function ModalProveedorForm({ accion, datosProveedor, ActualizarTabla }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [errorNombreProveedor, setErrorNombreProveedor] = useState(false);
  const [errorNumeros, setErrorNumeros] = useState([]);

  const [formProveedor, SetFormProveedor] = useState({
    id: null,
    nombre: "",
    nombrecontacto: "",
    rtn: "",
    numeros: [{ numero: "" }],
  });

  useEffect(() => {
    if (datosProveedor != null) {
      SetFormProveedor({
        id: datosProveedor.id,
        nombre: datosProveedor.nombre,
        nombrecontacto: datosProveedor.nombrecontacto,
        rtn: datosProveedor.rtn,
        numeros: datosProveedor.proveedortelefonos,
      });
    } else {
  
      limpiarCampos();
    }
  }, [datosProveedor]);

  const agregarNumero = () => {
    SetFormProveedor({
      ...formProveedor,
      numeros: [...formProveedor.numeros, { numero: "" }],
    });
  };

  const eliminarNumero = (index) => {
    const nuevosNumeros = [...formProveedor.numeros];
    nuevosNumeros.splice(index, 1);
    SetFormProveedor({
      ...formProveedor,
      numeros: nuevosNumeros,
    });
  };

  const manejadorNumero = (event, index) => {
    const nuevosNumeros = [...formProveedor.numeros];
    nuevosNumeros[index].numero = event.target.value;
    SetFormProveedor({
      ...formProveedor,
      numeros: nuevosNumeros,
    });

    // Limpiar el error de número si se modifica el número
    const nuevosErrores = [...errorNumeros];
    nuevosErrores[index] = false;
    setErrorNumeros(nuevosErrores);
  };

  const validateForm = () => {
    let valid = true;

    // Validación del nombre del proveedor
    if (formProveedor.nombre === "") {
      setErrorNombreProveedor(true);
      mostraAlerta("Por favor, ingrese el nombre del proveedor.", "warning");
      valid = false;
    } else {
      setErrorNombreProveedor(false);
    }

    // Validación de los números de teléfono
    const nuevosErrores = formProveedor.numeros.map((numero) => {
      if (numero.numero === "") {
        return true;
      }
      return false;
    });

    setErrorNumeros(nuevosErrores);

    if (nuevosErrores.includes(true)) {
      mostraAlerta("Por favor, ingrese números de teléfono válidos.", "warning");
      valid = false;
    }

    return valid;
  };

  const saveProveedores = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await AxiosPrivado.post(guardarProveedores, formProveedor).then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo == 1) {
          mostraAlerta(response.data.msj, "Success");
          ActualizarTabla();
          limpiarCampos();
        } else if (response.data.tipo === 0) {
          if (response.data.msj.isArray) {
            response.data.msj.forEach((element) => {
              console.log(element.campo + " " + element.msj);
              mostraAlertaWarning("El campo: " + element.campo + ", " + element.msj);
            });
          } else {
            mostraAlertaWarning(response.data.msj);
          }
        } else if (response.data.tipo === 2) {
          if (response.data.msj.isArray) {
            response.data.msj.forEach((element) => {
              console.log(element.campo + " " + element.msj);
              mostraAlertaWarning("El campo: " + element.campo + ", " + element.msj);
            });
          } else {
            mostraAlertaWarning(response.data.msj);
          }
        }
      });
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta("Error al ejecutar la petición", "warning");
    }
  };

  const manejadorProveedor = (event) => {
    SetFormProveedor({
      ...formProveedor,
      [event.target.name]: event.target.value,
    });
  };

  const modificarProveedor = () => {
    const regex = /^[a-zA-Z]+$/;
    if (formProveedor.id === null) {
      mostraAlerta("Debe seleccionar un proveedor", "warning");
      return;
    }
    if (formProveedor.nombre == "") {
      console.log("El campo nombre solo debe contener letras");
      setErrorNombreProveedor(true);
      mostraAlerta("El campo nombre solo debe contener como mínimo 3 letras", "warning");
      return;
    }
    setErrorNombreProveedor(false);

    AxiosPrivado.put(editarProveedores + formProveedor.id, formProveedor).then((response) => {
      console.log("Respuesta:", response.data);
      if (response.data.tipo === 1) {
        ActualizarTabla();
        mostraAlerta(response.data.msj, "Success");
        handleClose();
      } else if (response.data.tipo === 0) {
        mostraAlerta(response.data.msj);
      } else if (response.data.tipo === 2) {
        mostraAlerta(response.data.msj);
      }
    }).catch((error) => {
      console.error("Error: ", error);
      mostraAlerta(error);
    });
  };

  const limpiarCampos = () => {
    SetFormProveedor({
      id: null,
      nombre: "",
      nombrecontacto: "",
      rtn: "",
      numeros: [{ numero: "" }],
    });

    setErrorNombreProveedor(false);
    setErrorNumeros([]);
  };

  const handleOpenModal = () => {
    setShowModalInformacion(true);
  }

  return (
    <>
      {accion ? (
        <div>
          <Button variant="primary" onClick={handleShow}>
            Agregar Proveedor
          </Button>
        </div>
      ) : (
        <div>
          <Button variant="info" onClick={handleOpenModal}>
            <i className="fas fa-folder"></i>
          </Button>

          <Button variant="warning" onClick={handleShow}>
            <i className="fas fa-pencil-alt"></i>
          </Button>
        </div>
      )}

      <Modal show={showModal} onHide={handleClose} className="modal fade">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Formulario Proveedor</h4>
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
              <div className="form-group">
                <label htmlFor="nombreProveedor">Nombre del Proveedor</label>
                <input
                  type="text"
                  className={`form-control ${errorNombreProveedor ? "is-invalid" : ""}`}
                  id="text"
                  placeholder="Ingrese el nombre del proveedor"
                  name="nombre"
                  value={formProveedor.nombre}
                  onChange={manejadorProveedor}
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombrecontacto">Nombre de Contacto</label>
                <input
                  type="text"
                  className={`form-control ${errorNombreProveedor ? "is-invalid" : ""}`}
                  id="nombrecontacto"
                  placeholder="Ingrese el nombre de contacto"
                  name="nombrecontacto"
                  value={formProveedor.nombrecontacto}
                  onChange={manejadorProveedor}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rtn">RTN</label>
                <input
                  type="text"
                  className={`form-control ${errorNombreProveedor ? "is-invalid" : ""}`}
                  id="rtn"
                  placeholder="Ingrese el RTN"
                  name="rtn"
                  value={formProveedor.rtn}
                  onChange={manejadorProveedor}
                />
              </div>

              {/* Campo de texto para números de teléfono */}
              {formProveedor.numeros.map((numero, index) => (
                <div className="form-group" key={index}>
                  <label htmlFor={`numeroTelefono${index}`}>Número de Teléfono</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${errorNumeros[index] ? "is-invalid" : ""}`}
                      id={`numeroTelefono${index}`}
                      placeholder="Ingrese el número de teléfono"
                      name={`numero${index}`}
                      value={numero.numero}
                      onChange={(event) => manejadorNumero(event, index)}
                    />
                   
                    <div className="input-group-append">
                    {formProveedor.numeros.length > 1 &&
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => eliminarNumero(index)}
                      >
                        Eliminar
                      </button>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón para agregar número de teléfono */}
              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={agregarNumero}>
                  Agregar Número de Teléfono
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
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
              <Button variant="primary" onClick={saveProveedores}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarProveedor}>
                Modificar
              </Button>
            )}
          </div>
        </div>
      </Modal>
      <ModalInformacionProveedores datos={datosProveedor} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionProveedores>
    </>
  );
}

export default ModalProveedorForm;



