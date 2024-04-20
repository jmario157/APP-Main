import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import { guardarTicket, editarTicket } from "../../apiUrls";
import ModalInformacionTicket from "./modalInformacionTicket";
import { AxiosPrivado } from "../../axios/Axios";

function ModalTicketForm({ accion, datosTicket, ActualizarTabla }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const [errorTitulo, setErrorTitulo] = useState(false);
    const [errorDescripcion, setErrorDescripcion] = useState(false);
    const [formularioTicket, setFormularioTicket] = useState({
        id: datosTicket ? datosTicket.id : null,
        titulo: datosTicket ? datosTicket.titulo : "",
        descripcion: datosTicket ? datosTicket.descripcion : "",
        activo: datosTicket ? datosTicket.activo : true,
    });

    useEffect(() => {
        if (datosTicket != null) {
            setFormularioTicket(datosTicket);
        } else {
            limpiarCampos();
        }
    }, [datosTicket]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormularioTicket({
            ...formularioTicket,
            [name]: value
        });
    };

    const saveTicket = async () => {
        // Validaciones de campos
        if (!formularioTicket.titulo || !formularioTicket.descripcion) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorTitulo(!formularioTicket.titulo);
            setErrorDescripcion(!formularioTicket.descripcion);
            return;
        }

        // Resetear errores
        setErrorTitulo(false);
        setErrorDescripcion(false);
        try {
            const response = await AxiosPrivado.post(guardarTicket, formularioTicket);
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
            mostraAlertaError("Error al guardar el ticket.");
        }
    };

    const modificarTicket = () => {
        // Validaciones de campos
        if (!formularioTicket.titulo || !formularioTicket.descripcion) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorTitulo(!formularioTicket.titulo);
            setErrorDescripcion(!formularioTicket.descripcion);
            return;
        }

        // Resetear errores
        setErrorTitulo(false);
        setErrorDescripcion(false);

        AxiosPrivado.put(editarTicket + formularioTicket.id, formularioTicket)
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
                mostraAlertaError("Error al modificar el ticket.");
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
        setFormularioTicket({
            id: null,
            titulo: "",
            descripcion: "",
            activo: true,
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
                        Crear Ticket
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
                    <h4 className="modal-title text-primary">Formulario del Ticket</h4>
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
                                        <label htmlFor="titulo">Titulo</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorTitulo ? "is-invalid" : ""}`}
                                            id="titulo"
                                            name="titulo"
                                            value={formularioTicket.titulo}
                                            onChange={handleInputChange}
                                        />
                                        {errorTitulo && <div className="invalid-feedback">Este campo es requerido.</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="descripcion">Descripcion</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorDescripcion ? "is-invalid" : ""}`}
                                            id="descripcion"
                                            name="descripcion"
                                            value={formularioTicket.descripcion}
                                            onChange={handleInputChange}
                                        />
                                        {errorDescripcion && <div className="invalid-feedback">Este campo es requerido.</div>}
                                    </div>
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
                                                checked={formularioTicket.activo}
                                                onChange={(event) => {
                                                    setFormularioTicket({
                                                        ...formularioTicket,
                                                        activo: event.target.checked,
                                                    });
                                                }}
                                            />
                                            <label
                                                className="custom-control-label"
                                                htmlFor="customSwitch3"
                                            >
                                                {formularioTicket.activo ? 'Activo' : 'Inactivo'}
                                            </label>
                                        </div>
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
                        <Button variant="primary" onClick={saveTicket}>
                        Crear
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={modificarTicket}>
                        Actualizar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <ModalInformacionTicket datos={datosTicket} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionTicket>
        </>
    );
}

export default ModalTicketForm;