import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import { guardarDetalle, editarDetalle } from "../../apiUrls";
import ModalInformacionDetalle from "./modalInformacionDetalle";
import { AxiosPrivado } from "../../axios/Axios";

// Componente para el formulario de detalle de una nota de peso
function ModalDetalleForm({ accion, datosDetalle, ActualizarTabla }) {
    const [showModal, setShowModal] = useState(false);// Estado para controlar la visibilidad del modal de formulario
    const [showModalInformacion, setShowModalInformacion] = useState(false);// Estado para controlar la visibilidad del modal de información
    const [errorPesada, setErrorPesada] = useState(false);// Estado para controlar el error en el campo de pesada
    const [errorCantidad, setErrorCantidad] = useState(false);// Estado para controlar el error en el campo de cantidad
    const [errorPesoBruto, setErrorPesoBruto] = useState(false);// Estado para controlar el error en el campo de peso bruto
    const [errorTara, setErrorTara] = useState(false);// Estado para controlar el error en el campo de tara
    const [formularioDetalle, setFormularioDetalle] = useState({ // Estado para almacenar los datos del formulario
        id: datosDetalle? datosDetalle.id: null,
        pesada: datosDetalle? datosDetalle.pesada: "",
        cantidad: datosDetalle? datosDetalle.cantidad:"",
        pesoBruto: datosDetalle? datosDetalle.pesoNeto:"",
        tara: datosDetalle? datosDetalle.tara:"",
    });

    useEffect(() => {
        if (datosDetalle != null) {
            setFormularioDetalle(datosDetalle);
        } else{
            limpiarCampos();
        }
    }, [datosDetalle]);

    // Función para manejar cambios en los campos del formulario
    const manejadorDetalle = (event) => {
        setFormularioDetalle({
            ...formularioDetalle,
            [event.target.name]: event.target.value,
        });
    };

    // Función para guardar un nuevo detalle
    const saveDetalle = async () => {
        // Expresiones regulares para validar los campos numéricos
        const pesadaPattern = /^\d+$/;
        const cantidadPattern = /^\d+$/;
        const pesoBrutoPattern = /^\d+(\.\d+)?$/;
        const taraPattern = /^\d+(\.\d+)?$/;

        // Validación de los campos numéricos
        if (!pesadaPattern.test(formularioDetalle.pesada) || !cantidadPattern.test(formularioDetalle.cantidad) || !pesoBrutoPattern.test(formularioDetalle.pesoBruto) || !taraPattern.test(formularioDetalle.tara)) {
            mostraAlerta("Los campos de cantidad, peso neto y tara deben contener solo números", "warning");
            setErrorCantidad(!cantidadPattern.test(formularioDetalle.cantidad));
            setErrorPesoBruto(!pesoBrutoPattern.test(formularioDetalle.pesoBruto));
            setErrorTara(!taraPattern.test(formularioDetalle.tara));
            return;
        }

        setErrorPesada(false);
        setErrorCantidad(false);
        setErrorPesoBruto(false);
        setErrorTara(false);

        try {
            // Llamada a la API para guardar el detalle
            const response = await AxiosPrivado.post(guardarDetalle, formularioDetalle);
            console.log("Respuesta:", response.data);
            if(response.data.tipo === 1) {
                // Si la respuesta es exitosa, se muestra una alerta y se actualiza la tabla
                mostraAlerta(response.data.msj, "success");
                ActualizarTabla();
                limpiarCampos();
            } else {
                handleErrorResponse(response.data);
            }
        } catch (error) {
            console.error("Error:", error);
            mostraAlertaError("Error al guardar el detalle.");
        }
    };

    // Función para modificar un detalle existente
    const modificarDetalle = () => {
        // Expresiones regulares para validar los campos numéricos
        const pesadaPattern = /^\d+$/;
        const cantidadPattern = /^\d+$/;
        const pesoBrutoPattern = /^\d+(\.\d+)?$/;
        const taraPattern = /^\d+(\.\d+)?$/;

        // Validación de los campos numéricos
        if (!pesadaPattern.test(formularioDetalle.pesada) || !cantidadPattern.test(formularioDetalle.cantidad) || !pesoBrutoPattern.test(formularioDetalle.pesoBruto) || !taraPattern.test(formularioDetalle.tara)) {
            mostraAlerta("Los campos de cantidad, peso neto y tara deben contener solo números", "warning");
            setErrorCantidad(!cantidadPattern.test(formularioDetalle.cantidad));
            setErrorPesoBruto(!pesoBrutoPattern.test(formularioDetalle.pesoBruto));
            setErrorTara(!taraPattern.test(formularioDetalle.tara));
            return;
        }

        setErrorPesada(false);
        setErrorCantidad(false);
        setErrorPesoBruto(false);
        setErrorTara(false);

        // Llamada a la API para modificar el detalle
        AxiosPrivado.put(editarDetalle + formularioDetalle.id, formularioDetalle)
            .then((response) => {
                console.log("Respuesta:", response.data);
                if (response.data.tipo === 1) {
                    // Si la respuesta es exitosa, se muestra una alerta y se actualiza la tabla
                    ActualizarTabla();
                    mostraAlerta(response.data.msj, "success");
                } else {
                    handleErrorResponse(response.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                mostraAlertaError("Error al modificar el detalle.");
            });
    };

    // Función para manejar la respuesta de error de la API
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

    // Función para limpiar los campos del formulario
    const limpiarCampos = () => {
        setFormularioDetalle({
            id: null,
            pesada: "",
            cantidad: "",
            pesoBruto: "",
            tara: "",
        });
    };

    // Función para mostrar el modal de formulario
    const handleShow = () => setShowModal(true);
    // Función para cerrar el modal de formulario
    const handleClose = () => setShowModal(false);
    // Función para mostrar el modal de información
    const handleOpenModal = () => setShowModalInformacion(true);

    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Agregar Detalle
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

            <Modal show={showModal} onHide={handleClose} size="lg">
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Formulario de Detalle de Nota</h4>
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
                            <div className="card-header">
                                <div className="widget-header">
                                    <h3 className="widget-user-username"><i className="fas fa-desktop"></i> DESOFIW</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="pesada">No.</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errorPesada ? "is-invalid" : ""}`}
                                                id="pesada"
                                                name="pesada"
                                                value={formularioDetalle.pesada}
                                                onChange={manejadorDetalle}
                                            />
                                            {errorPesada && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="cantidad">Sacos</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errorCantidad ? "is-invalid" : ""}`}
                                                id="cantidad"
                                                name="cantidad"
                                                value={formularioDetalle.cantidad}
                                                onChange={manejadorDetalle}
                                            />
                                            {errorCantidad && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="pesoBruto">Peso Bruto</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errorPesoBruto ? "is-invalid" : ""}`}
                                                id="pesoBruto"
                                                name="pesoBruto"
                                                value={formularioDetalle.pesoBruto}
                                                onChange={manejadorDetalle}
                                            />
                                            {errorPesoBruto && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                    <div className="form-group">
                                            <label htmlFor="pesoNeto">Tara</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errorTara ? "is-invalid" : ""}`}
                                                id="tara"
                                                name="tara"
                                                value={formularioDetalle.tara}
                                                onChange={manejadorDetalle}
                                            />
                                            {errorTara && <div className="invalid-feedback">Este campo es requerido.</div>}
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
                        <Button variant="primary" onClick={saveDetalle}>
                            Crear
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={modificarDetalle}>
                            Actualizar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <ModalInformacionDetalle datos={datosDetalle} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionDetalle>
        </>
    );

}

export default ModalDetalleForm;