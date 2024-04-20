import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import { guardarAlquileres, editarAlquileres } from "../../apiUrls";
import ModalInformacionAlquileres from "./modalInformacionAlquileres";
import { AxiosPrivado } from "../../axios/Axios";

function ModalAlquilerForm({ accion, datosAlquileres, ActualizarTabla }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const [errorMaquinaria, setErrorMaquinaria] = useState(false);
    const [errorDuracion, setErrorDuracion] = useState(false);
    const [errorCosto, setErrorCosto] = useState(false);
    const [formularioAlquileres, setFormularioAlquileres] = useState({
        id: datosAlquileres ? datosAlquileres.id : null,
        maquinaria: datosAlquileres ? datosAlquileres.maquinaria : "",
        duracion: datosAlquileres ? datosAlquileres.duracion : "",
        costo: datosAlquileres ? datosAlquileres.costo : ""
    });

    useEffect(() => {
        if (datosAlquileres != null) {
            setFormularioAlquileres(datosAlquileres);
        } else {
            limpiarCampos();
        }
    }, [datosAlquileres]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormularioAlquileres({
            ...formularioAlquileres,
            [name]: value
        });
    };

    const saveAlquiler = async () => {
        // Validaciones de campos
        if (!formularioAlquileres.maquinaria || !formularioAlquileres.duracion || !formularioAlquileres.costo) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorMaquinaria(!formularioAlquileres.maquinaria);
            setErrorDuracion(!formularioAlquileres.duracion);
            setErrorCosto(!formularioAlquileres.costo);
            return;
        }

        // Resetear errores
        setErrorMaquinaria(false);
        setErrorDuracion(false);
        setErrorCosto(false);

        try {
            const response = await AxiosPrivado.post(guardarAlquileres, formularioAlquileres);
            console.log("Respuesta:", response.data);
            if (response.data.tipo === 1) {
                mostraAlerta(response.data.msj, "success");
                ActualizarTabla();
                limpiarCampos();
            } else {
                handleErrorResponse(response.data);
            }
        } catch (error) {
            console.error("Error:", error);
            mostraAlertaError("Error al guardar el alquiler.");
        }
    };

    const modificarAlquiler = () => {
        // Validaciones de campos
        if (!formularioAlquileres.maquinaria || !formularioAlquileres.duracion || !formularioAlquileres.costo) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorMaquinaria(!formularioAlquileres.maquinaria);
            setErrorDuracion(!formularioAlquileres.duracion);
            setErrorCosto(!formularioAlquileres.costo);
            return;
        }

        // Resetear errores
        setErrorMaquinaria(false);
        setErrorDuracion(false);
        setErrorCosto(false);

        AxiosPrivado.put(editarAlquileres + formularioAlquileres.id, formularioAlquileres)
            .then((response) => {
                console.log("Respuesta:", response.data);
                if (response.data.tipo === 1) {
                    ActualizarTabla();
                    mostraAlerta(response.data.msj, "success");
                } else {
                    handleErrorResponse(response.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                mostraAlertaError("Error al modificar el alquiler.");
            });
    };

    const handleErrorResponse = (data) => {
        if (Array.isArray(data.msj)) {
            data.msj.forEach((element) => {
                console.log(element.campo + " " + element.msj);
                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
            });
        } else {
            mostraAlertaWarning(data.msj);
        }
    };

    const limpiarCampos = () => {
        setFormularioAlquileres({
            id: null,
            maquinaria: "",
            duracion: "",
            costo: "",
        });
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleOpenModal = () => setShowModalInformacion(true);

    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Crear Alquiler
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

            <Modal show={showModal} onHide={handleClose}>
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Formulario de Alquiler</h4>
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
                <Modal.Body>
                <div className="modal-body">
                    <form>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="maquinaria">Maquinaria</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorMaquinaria ? "is-invalid" : ""}`}
                                            id="maquinaria"
                                            name="maquinaria"
                                            value={formularioAlquileres.maquinaria}
                                            onChange={handleInputChange}
                                        />
                                        {errorMaquinaria && <div className="invalid-feedback">Este campo es requerido.</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="duracion">Duración</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorDuracion ? "is-invalid" : ""}`}
                                            id="duracion"
                                            name="duracion"
                                            value={formularioAlquileres.duracion}
                                            onChange={handleInputChange}
                                        />
                                        {errorDuracion && <div className="invalid-feedback">Este campo es requerido.</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="costo">Costo</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorCosto ? "is-invalid" : ""}`}
                                            id="costo"
                                            name="costo"
                                            value={formularioAlquileres.costo}
                                            onChange={handleInputChange}
                                        />
                                        {errorCosto && <div className="invalid-feedback">Este campo es requerido.</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="warning" onClick={limpiarCampos}>
                        Limpiar Campos
                    </Button>
                    {accion ? (
                        <Button variant="primary" onClick={saveAlquiler}>
                        Crear
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={modificarAlquiler}>
                        Actualizar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <ModalInformacionAlquileres datos={datosAlquileres} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionAlquileres>
        </>
    );
}

export default ModalAlquilerForm;
